// @flow
import * as React from 'react';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import { Alert, Editors } from '../../_components';
import { Card } from 'primereact/card';
import { PiramisContext } from '../../shared/piramis-context';

const schema = Yup.object({
  name: Yup.string()
    .required('nome obbligatorio')
    .min(3, 'inserire un nome di almeno 3 caratteri'),
  surname: Yup.string()
    .required('cognome obbligatorio')
    .min(3, 'inserire un cognome di almeno 3 caratteri'),
  phone: Yup.string()
    .required()
    .min(8, 'il numero di cellulare deve essere compreso tra 8 e 15 cifre')
    .max(15, 'il numero di cellulare deve essere compreso tra 8 e 15 cifre'),
  mail: Yup.string()
    .required(`mail personale obbligatoria`)
    .email('inserire una mail valida'),
  pec: Yup.string().email('la pec deve essere una mail valida')
});

export default function Dashboard() {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub, user } = context;

  const ValidationSummary = (props: { errors: any, labels: Localizer }) =>
    !isEmpty(props.errors) ? (
      <Alert
        color="red"
        title={props.labels.get('error')}
        content={Object.keys(props.errors).map((key, i) => (
          <p key={`val-${i}`}>{props.labels.get(props.errors[key])}</p>
        ))}
      />
    ) : null;

  const EditorButtons = (props: { loading: boolean, inline?: boolean, onConfirm: Function }) => (
    <div className="text-right flex flex-row-reverse w-full">
      <div className="text-center">
        <Button
          disabled={props.loading}
          className="p-button-success p-button-icon-only"
          type="button"
          icon={props.loading ? 'fas fa-circle-notch fa-spin' : 'pi pi-check'}
          onClick={props.onConfirm}
        />
      </div>
    </div>
  );

  async function onConfirm(data, actions) {
    actions.setSubmitting(true);
    hub.loading(true);
    try {
      await entityService.put([data]);
    } catch (error) {
      actions.setStatus({
        msg: labels.get('errore durante il salvataggio. si prega di riprovare')
      });
    } finally {
      actions.setSubmitting(false);
      hub.loading(false);
    }
  }

  return (
    <Card title={labels.get('Dati utente')}>
      <Formik
        initialValues={user}
        validationSchema={schema}
        onSubmit={onConfirm}
        render={frmProps => (
          <div className="p-grid">
            <Editors.Fields.InputField
              id="username"
              input={{ readOnly: true }}
              label={labels.get('username')}
              icon="fas fa-user"
              value={frmProps.values['username']}
              errors={frmProps.errors}
            />
            <Editors.Fields.InputField
              onChange={frmProps.handleChange}
              id="name"
              label={labels.get('nome')}
              icon="far fa-address-card"
              value={frmProps.values['name']}
              errors={frmProps.errors}
            />

            <Editors.Fields.InputField
              onChange={frmProps.handleChange}
              id="surname"
              label={labels.get('cognome')}
              icon="far fa-address-card"
              value={frmProps.values['surname']}
              errors={frmProps.errors}
            />

            <Editors.Fields.InputField
              onChange={frmProps.handleChange}
              id="phone"
              input={{ keyfilter: 'pint' }}
              icon="fas fa-phone"
              label={labels.get('cellulare')}
              value={frmProps.values['phone']}
              errors={frmProps.errors}
            />
            <Editors.Fields.InputField
              onChange={frmProps.handleChange}
              id="mail"
              icon="fas fa-at"
              label={labels.get('mail personale')}
              value={frmProps.values['mail']}
              errors={frmProps.errors}
            />
            <Editors.Fields.InputField
              onChange={frmProps.handleChange}
              id="pec"
              icon="fas fa-at"
              label={labels.get('mail certificata (pec)')}
              value={frmProps.values['pec']}
              errors={frmProps.errors}
            />

            {frmProps.status && (
              <div className="p-col-12">
                <Alert color="red" title={labels.get('error')} content={frmProps.status.msg} />
              </div>
            )}
            <div className="p-col-12">
              <ValidationSummary errors={frmProps.errors} labels={labels} />
            </div>
            <EditorButtons loading={frmProps.isSubmitting} onConfirm={frmProps.handleSubmit} />
          </div>
        )}
      />
    </Card>
  );
}
