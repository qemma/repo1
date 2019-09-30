// @flow
import * as React from 'react';
import * as Yup from 'yup';
import ModalEditor from './modal-editor';
import { ITEM_CATEGORY, CATEGORY_ICON } from '../../shared/const';
import * as Fields from './fields';
import { PiramisContext } from '../../shared/piramis-context';

const schema = () =>
  Yup.object({
    tel: Yup.string()
      .required()
      .min(8, 'il numero di telefono deve essere compreso tra 8 e 15 cifre')
      .max(15, 'il numero di telefono deve essere compreso tra 8 e 15 cifre'),
    iccid: Yup.string().required("il codice iccid e' obbligatorio"),
    simType: Yup.string().required("il tipo di sim e' obbligatorio"),
    carrier: Yup.string().required("l'operatore e' obbligatorio"),
    insertionDate: Yup.string().required("la data inserimento e' obbligatorio")
  });

type Props = {
  sim?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any,
  domainData: any
};

export default function SimEditor(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData } = context;
  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={schema}
      labels={labels}
      category={ITEM_CATEGORY.sim}
      parent={props.parent}
      onConfirm={props.onConfirm}
      entity={props.sim}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="tel"
            label={labels.get('numero di telefono')}
            icon="far fa-phone"
            value={frmProps.values['tel']}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="iccid"
            label={labels.get('iccid')}
            icon="fas fa-barcode"
            value={frmProps.values['iccid']}
            errors={frmProps.errors}
          />
          <Fields.SelectField
            onChange={frmProps.handleChange}
            id="simType"
            label={labels.get('simType')}
            input={{
              options: domainData.simTypes
            }}
            icon="far fa-list-alt"
            value={frmProps.values['simType']}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={frmProps.handleChange}
            id="carrier"
            label={labels.get('carrier')}
            input={{
              options: domainData.carriers
            }}
            icon="fas fa-broadcast-tower"
            value={frmProps.values['carrier']}
            errors={frmProps.errors}
          />

          <Fields.CalendarField
            onChange={frmProps.handleChange}
            id="insertionDate"
            label={labels.get('insertionDate')}
            value={frmProps.values['insertionDate']}
            errors={frmProps.errors}
          />
        </React.Fragment>
      )}
    />
  );
}

SimEditor.defaultProps = {
  buttonSettings: {
    tooltip: 'editor sim',
    icon: CATEGORY_ICON[ITEM_CATEGORY.sim]
  },
  header: 'editor sim'
};
