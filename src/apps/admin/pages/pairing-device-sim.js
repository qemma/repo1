// @flow
import * as React from 'react';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import { getMessage } from '../../_components/utils';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Spinner } from 'primereact/spinner';
import { DeviceLabelList, Modal, Alert } from '../../_components';
import DeviceSimPairStore from './pairing-device-sim-store'
import { withContext } from '../../shared/piramis-context';

class DevicesSimPairing extends React.Component<any> {
  steps: Array<{ label: string, value: number }>;
  debounceOnScanComplete: function
  spinnerInput: any
  scanInput: any
  validationError: any
  store: any
  constructor(props) {
    super(props);
    this.store = new DeviceSimPairStore(props.context.entityService, props.context.hub)
    this.steps = [
      { label: props.context.labels.get('scansionaCodici'), value: 0 },
      { label: props.context.labels.get('verificaAbbinamentiConferma'), value: 1 },
      { label: props.context.labels.get('stampaEtichette'), value: 2 }
    ];

    this.debounceOnScanComplete = debounce(this.onScanComplete, 300);
  }

  componentDidMount() {
    this.store.reset();
  }

  componentDidUpdate() {
    this.setFocus();
  }

  setFocus = () => {
    this.store.step === 0 &&
    this.store.totalNumberOfItems === 0 &&
      this.spinnerInput &&
      this.spinnerInput.inputEl.focus();
      this.store.step === 0 && this.scanInput && this.scanInput.element.focus();
  };

  onScanEntry = e => {
    if (e.key === 'Enter') {
      this.debounceOnScanComplete(e.target.value);
    }
  };

  onScanComplete = value => {
    this.scanInput.element.value = '';
    this.setFocus();
    this.store.onScan(value);
  };

  getSelectionSummary = (labels, store) => {
    const items = store.step === 0 ? store.scans : store.summary;
    const okclass = store.step === 0 ? 'info' : 'success';
    const koclass = store.step === 0 ? 'warn' : 'error';
    if (!items || !items.length) return null;
    const selectionItems = items.map((el, i) => {
      return (
        <div
          key={`selected-${i}`}
          aria-live="polite"
          style={{ marginRight: '1rem', marginTop: '1rem' }}
          className={`p-message p-component p-message-${
            el.sn && el.iccid && !el.validationError ? okclass : koclass
          }`}
        >
          {store.step !== 2 && (
            <span
              className={
                store.loading ? 'fas fa-circle-notch fa-spin' : 'p-message-icon pi pi-fw pi-times'
              }
              style={{ cursor: 'pointer' }}
              onClick={e => {
                store.removeScan(el);
              }}
            />
          )}
          <span className="p-message-text">
            <span>
              <strong>{labels.get('SN')}: </strong>
              {el.sn} - <strong>{labels.get('ICCID')}: </strong>
              {el.iccid || ''}
            </span>
            {el.validationError && (
              <div>
                <strong>{labels.get('errore')}: </strong>
                {labels.get(el.validationError)}
              </div>
            )}
          </span>
        </div>
      );
    });
    return (
      <div style={{ marginBottom: '2em' }}>
        <h2>{labels.get(store.step === 2 ? 'Abbinamenti eseguiti' : 'Abbinamenti proposti')}</h2>
        {selectionItems}
      </div>
    );
  };

  getScannerInput = (labels, totalNumberOfItems, onChangeTotDevices) => {
    return (
      <div className="p-fluid">
        <div>
          <p>{labels.get('numeroDispositiviAbbinare')}</p>
          <Spinner
            ref={el => (this.spinnerInput = el)}
            id="numdevices"
            keyfilter="int"
            step={1}
            value={totalNumberOfItems}
            onChange={onChangeTotDevices}
          />
        </div>
        {totalNumberOfItems > 0 && (
          <div className="p-inputgroup" style={{ marginTop: '1em' }}>
            <InputText
              ref={el => (this.scanInput = el)}
              placeholder={labels.get(`scansionaCodiciPremiInvio`)}
              onKeyPress={this.onScanEntry}
            />
            <span className="p-inputgroup-addon">
              <i className="fas fa-barcode" />
            </span>
          </div>
        )}
      </div>
    );
  };

  getPairVerification = (labels, store) => {
    const message = store.isValid
      ? 'di seguito trovi il riepilogo dei dati proposti nel dettaglio. Premi conferma per salvare gli abbinamenti'
      : "ci sono degli errori negli abbinamenti proposti. Rimuovi gli abbinamenti non validi e ripeti l'operazione";
    return (
      <div>
        <h2>{labels.get('Dettaglio Abbinamenti proposti')}</h2>
        {getMessage('', <p>{labels.get(message)}</p>, store.isValid ? 'success' : 'error')}
        <div style={{ textAlign: 'right', marginBottom: '2em' }}>
          {store.isValid && (
            <Button
              disabled={store.loading}
              tooltip={labels.get('salva tutti gli abbinamenti')}
              className="p-button-success"
              style={{ marginRight: '1rem' }}
              label={labels.get('conferma')}
              icon={store.loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
              onClick={store.onSaveData}
            />
          )}
          <Button
            tooltip={labels.get('annulla tutti gli abbinamenti')}
            className="p-button-warning"
            disabled={store.loading}
            label={labels.get('annulla')}
            icon="pi pi-times"
            onClick={store.reset}
          />
        </div>
        <div>
          <DataTable
            value={store.summary}
            rowClassName={rowData => ({
              'p-satsim-success-row': !rowData.validationError,
              'p-satsim-error-row': rowData.validationError
            })}
          >
            <Column field="sn" header={labels.get('serialNumber')} />
            <Column field="sat.imei" header={labels.get('imei')} />
            <Column field="sat.model" header={labels.get('modello')} />
            <Column field="sat.status" header={labels.get('stato dispositivo')} />
            <Column field="iccid" header={labels.get('iccid')} />
            <Column field="sim.tel" header={labels.get('numero')} />
            <Column field="sim.carrier" header={labels.get('operatore')} />
            <Column field="sim.status" header={labels.get('stato sim')} />
            <Column
              field="validationError"
              body={data => {
                return data.validationError ? labels.get(data.validationError) : '';
              }}
              header={labels.get('errori')}
            />
          </DataTable>
        </div>
      </div>
    );
  };

  getFinalResult = (labels, store) => {
    return (
      <div>
        <h2>{labels.get('Generazione Etichette')}</h2>
        <div style={{ marginTop: '2em', marginBottom: '2em' }}>
          <Button
            disabled={store.loading}
            tooltip={labels.get('stampa etichette')}
            className="p-button-success"
            label={labels.get('stampa')}
            icon="fas fa-print"
            onClick={() => store.printLabels('labelsToPrint')}
          />
          {store.printOpened && (
            <Button
              tooltip={labels.get('abbina altri dispositivi')}
              className="p-button-warning"
              disabled={store.loading}
              label={labels.get('ricomincia')}
              icon="fas fa-redo"
              style={{ marginLeft: '1rem' }}
              onClick={store.reset}
            />
          )}
        </div>
        <DeviceLabelList
          id="labelsToPrint"
          items={store.summary.map(item => ({
            sn: item.sn,
            imei: item.sat.imei,
            phone: item.sim.tel
          }))}
        />
      </div>
    );
  };

  render() {
    const labels = this.props.context.labels;
    return (
      <Card title={labels.get('abbinamentoSatSim')}>
        <Fieldset
          legend={labels.get(
            `messagioAbbinaDispositivi`
          )}
          className={this.validationError ? 'p-error sat-sim-pair' : 'sat-sim-pair'}
        >
          <Steps model={this.steps} activeIndex={this.store.step} />
          {this.getSelectionSummary(labels, this.store)}
          {this.store.step === 0 && (
            <div>
              {this.getScannerInput(labels, this.store.totalNumberOfItems, this.store.onChangeTotDevices)}
            </div>
          )}
          {this.store.step === 1 && <div>{this.getPairVerification(labels, this.store)}</div>}
          {this.store.step === 2 && <div>{this.getFinalResult(labels, this.store)}</div>}
        </Fieldset>
        <Modal
          onClose={() => this.store.toggleModalWarning(false)}
          visible={this.store.modalWarning}
          height="50%"
          header={labels.get('Attenzione!!')}
          width="50%"
        ><Alert
        color="orange"
        title={labels.get('error')}
        content={<div><p>{labels.get(`Hai gia' scansionato il numero di dispositivi richiesto (${this.store.totalNumberOfItems})`)}</p><p>{labels.get(`Ora devi scansionare le sim. Utilizza un ICCID valido per una sim da abbinare!`)}</p></div>}
      /></Modal>
      </Card>
    );
  }
}

export default withContext(observer(DevicesSimPairing));
