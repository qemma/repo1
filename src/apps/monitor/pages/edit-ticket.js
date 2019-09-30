// @flow
import * as React from 'react';
import { Card } from 'primereact/card';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { Alert, Editors, Confirm } from '../../_components';
import { ITEM_CATEGORY, ENTITY_STATUS } from '../../shared/const';
import { PiramisContext } from '../../shared/piramis-context';
import moment from 'moment';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import GisPanel from './gisPanel';
import { JsonEditor as Editor } from 'jsoneditor-react';
// $FlowIgnore: require ace
import ace from 'brace';
// $FlowIgnore: require json
import 'brace/mode/json';
// $FlowIgnore: require theme
import 'brace/theme/github';

export default function EditTicket(props: any) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;

  const [ticket: any, setTicket] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);
  const [device: any, setDevice] = React.useState(undefined);
  const [vehicle: any, setVehicle] = React.useState(undefined);

  const ticketId = props.routingParams ? props.routingParams.ticketId : undefined;
  const [refreshingGis: boolean, setRefreshGis] = React.useState(false);

  React.useEffect(() => {
    getTicket(ticketId);
  }, []);

  async function getTicket(ticketId) {
    hub.loading(true);
    setLoading(true);
    try {
      const result = await entityService.search({
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.ticket,
        includeRelated: 'reference1',
        includeParents: true,
        filters: {
          itemId: { matchMode: 'match', value: ticketId }
        }
      });

      const vehicleIt: any =
        result.parents && result.parents.length ? result.parents[0] : { imei: '' };
      setVehicle(vehicleIt);

      const deviceQuery = await entityService.search({
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.device,
        filters: {
          imei: { matchMode: 'match', value: vehicleIt.imei }
        }
      });

      const deviceIt: any =
        deviceQuery.items && deviceQuery.items.length ? deviceQuery.items[0] : undefined;
      setDevice(deviceIt);
      const ticket: any =
        result && result.items && result.items.length === 1 ? result.items[0] : undefined;
      setTicket(ticket);
    } finally {
      setLoading(false);
      hub.loading(false);
    }
  }

  const viewCar = (car: any) => {
    return {
      targa: car.plate,
      telaio: car.frame,
      marca: car.make,
      modello: car.model,
      tipo: car.type,
      allestimento: car.preparation,
      alimentazione: car.supplier || ' ',
      km: car.km,
      imei: car.imei,
      cliente: car.name,
      email: car.mail,
      telefono: car.phone
    };
  };

  function getTicketTimeline(ticket) {
    if (!ticket || !ticket.tagHist || !ticket.tagHist.length) return null;
    return (
      <div className="bg-grey p-1">
        <h3>{labels.get('Storico ticket')}</h3>
        <Timeline>
          {(ticket.tagHist || []).map((evt, i) => (
            <TimelineEvent
              key={i}
              title={`stato: ${evt.status} - Operatore ${evt.createdBy}`}
              createdAt={moment(evt.date).format('DD/MM/YYYY hh:mm:ss')}
              icon={<i className="far fa-calendar" />}
              container="card"
              collapsible
              showContent
              style={{
                border: '1px solid #777',
                borderRadius: 3
              }}
              cardHeaderStyle={{
                backgroundColor: evt.status === ENTITY_STATUS.closed ? '#8bc34a' : '#3490dc'
              }}
            >
              {evt.notes}
            </TimelineEvent>
          ))}
        </Timeline>
      </div>
    );
  }

  async function onAddDetails(data, actions) {
    actions.setSubmitting(true);
    hub.loading(true);
    try {
      const updtTicket: any = {
        ...ticket,
        status: data.status || ENTITY_STATUS.active,
        tagHist: ((ticket && ticket.tagHist) || []).concat({
          date: moment(),
          createdBy: context.user.itemId,
          notes: data.ticketDetails,
          status: data.status || ENTITY_STATUS.active
        })
      };
      const result: any = await entityService.put([updtTicket]);
      setTicket(result.items[0]);
      actions.setFieldValue('ticketDetails', '');
      actions.setFieldValue('status', undefined);
    } catch (error) {
      actions.setStatus({
        msg: labels.get('errore durante la modifica del ticket')
      });
    } finally {
      actions.setSubmitting(false);
      hub.loading(false);
    }
  }

  async function resetGisDashboard() {
    setRefreshGis(true);
    // if (device) await context.gisApi.smsCommand(device.tel, 'h s getrecord');
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setRefreshGis(false);
    }, 1000);
  }

  return (
    <Card title={labels.get('Lavora ticket')}>
      {loading ? (
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-grey-light" style={{ fontSize: '20em' }} />
        </div>
      ) : ticket ? (
        <div className="bg-white w-full p-4">
          {getTicketTimeline(ticket)}
          {ticket.status === ENTITY_STATUS.active && (
            <Formik
              onSubmit={onAddDetails}
              render={frmProps => (
                <div className="p-grid mb-4">
                  <Editors.Fields.TextAreaField
                    onChange={frmProps.handleChange}
                    id="ticketDetails"
                    label={labels.get('Aggiungi dettaglio al ticket')}
                    icon="fas fa-newspaper"
                    value={frmProps.values['ticketDetails']}
                    errors={frmProps.errors}
                  />

                  {frmProps.status && (
                    <div className="p-col-12">
                      <Alert
                        color="red"
                        title={labels.get('error')}
                        content={frmProps.status.msg}
                      />
                    </div>
                  )}

                  <div className="text-right flex flex-row-reverse w-full">
                    <div className="text-center">
                      <Button
                        id="addDetails"
                        style={{ marginRight: '5px' }}
                        label={labels.get('aggiungi dettaglio')}
                        disabled={frmProps.isSubmitting || !frmProps.values['ticketDetails']}
                        className="p-button-success"
                        type="button"
                        icon={frmProps.isSubmitting ? 'fas fa-circle-notch fa-spin' : 'fas fa-save'}
                        onClick={frmProps.handleSubmit}
                      />

                      <Button
                        id="closeButton"
                        disabled={frmProps.isSubmitting || !frmProps.values['ticketDetails']}
                        className="p-button-warning"
                        type="button"
                        label={labels.get('chiudi ticket')}
                        icon={
                          frmProps.isSubmitting
                            ? 'fas fa-circle-notch fa-spin'
                            : 'fas fa-door-closed'
                        }
                        onClick={async e => {
                          await Confirm(labels.get('confermi chiusura del ticket?'), labels, {});
                          await frmProps.setFieldValue('status', ENTITY_STATUS.closed);
                          return await frmProps.handleSubmit(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            />
          )}
          {ticket.status === ENTITY_STATUS.active && !refreshingGis && (
            <GisPanel device={device} vehicle={vehicle} onRefresh={resetGisDashboard} />
          )}
          {ticket.status === ENTITY_STATUS.active && refreshingGis && (
            <div className="text-center">
              <i
                className="fas fa-circle-notch fa-spin text-grey-light"
                style={{ fontSize: '20em' }}
              />
            </div>
          )}
          <div className="mt-4">
            <h3>{labels.get('Dettaglio veicolo e cliente')}</h3>
            <Editor
              mode="view"
              ace={ace}
              theme="ace/theme/github"
              navigationBar={false}
              allowedModes={['view']}
              value={viewCar(vehicle)}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white w-full p-4">
          {labels.get(`nessun ticket trovato con id ${ticketId || 'non specificato'}`)}
        </div>
      )}
    </Card>
  );
}
