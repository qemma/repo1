// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { ITEM_CATEGORY, CATEGORY_ICON } from '../../shared/const';
import ModalEditor from './modal-editor';
import * as Fields from './fields';

import { PiramisContext } from '../../shared/piramis-context';

const schema = () =>
  Yup.object({
    km: Yup.number().when('quantity', (quantity, schema) => {
      return quantity
        ? schema
        : schema.required(
            'almeno uno tra scadenza chilometrica e scadenza temporale deve essere specificato'
          );
    }),
    quantity: Yup.number(),
    description: Yup.string().required('inserire una descrizione per il modello')
  });

type Props = {
  entity?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const TagliandoEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData, gisApi } = context;
  const [makes, setMakes] = React.useState([]);
  const [models, setModels] = React.useState([]);
  const [preparations, setPreparations] = React.useState([]);

  async function loadMakes() {
    const makesString = localStorage.getItem('infocarmakes');
    let makesList = [];
    if (makesString) {
      makesList = JSON.parse(makesString);
    } else {
      makesList = await gisApi.getMakes();
    }
    setMakes(makesList);
  }

  async function loadModels(alimen, make) {
    const modelsList = await gisApi.getModels({
      Alimentazione: alimen || '0',
      CodiceMarca: make
    });

    setPreparations([]);
    setModels(modelsList);
  }

  async function loadPreparations(modello: string) {
    const modelsList = await gisApi.getPreparations({
      CodiceModello: modello
    });

    setPreparations(modelsList);
  }

  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={schema}
      labels={labels}
      category={ITEM_CATEGORY.tagliando}
      parent={props.parent}
      onConfirm={props.onConfirm}
      onOpen={() => {
        loadMakes();
        if (props.entity && props.entity.infocarMake && props.entity.infocarSupplier) {
          loadModels(props.entity.infocarSupplier, props.entity.infocarMake);
          if (props.entity && props.entity.infocarModel) {
            loadPreparations(props.entity.infocarModel);
          }
        }
      }}
      entity={props.entity}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="km"
            input={{ keyfilter: 'pint' }}
            label={labels.get('scadenza chilometri')}
            icon="fas fa-tachometer-alt"
            value={frmProps.values.km}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="quantity"
            input={{ keyfilter: 'pint' }}
            label={labels.get('scadenza temporale (mesi)')}
            icon="far fa-clock"
            value={frmProps.values.quantity}
          />

          <Fields.TextAreaField
            onChange={frmProps.handleChange}
            id="description"
            label={labels.get('note modello tagliando')}
            value={frmProps.values['description']}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={e => {
              frmProps.handleChange(e);
              frmProps.setFieldValue('model', undefined);
              frmProps.setFieldValue('infocarModel', undefined);
              frmProps.setFieldValue('preparation', undefined);
              frmProps.setFieldValue('make', undefined);
              frmProps.setFieldValue('infocarMake', undefined);
              setPreparations([]);
              setModels([]);
            }}
            id="type"
            label={labels.get('tipo veicolo')}
            input={{
              options: domainData.vehicleTypes
            }}
            icon="far fa-list-alt"
            value={frmProps.values['type']}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={e => {
              frmProps.handleChange(e);
              frmProps.setFieldValue('supplier', e.target.text);
              frmProps.setFieldValue('model', undefined);
              frmProps.setFieldValue('infocarModel', undefined);
              frmProps.setFieldValue('preparation', undefined);
              setPreparations([]);
              setModels([]);
              if (frmProps.values.make) {
                loadModels(e.target.value, frmProps.values.infocarMake);
              }
            }}
            id="infocarSupplier"
            label={labels.get('alimentazione')}
            input={{
              options: domainData.alimentazione.filter(el => el.value !== '0')
            }}
            icon="far fa-list-alt"
            value={frmProps.values.infocarSupplier}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={e => {
              frmProps.handleChange(e);
              frmProps.setFieldValue('make', e.target.text);
              frmProps.setFieldValue('model', undefined);
              frmProps.setFieldValue('infocarModel', undefined);
              frmProps.setFieldValue('preparation', undefined);
              setPreparations([]);
              setModels([]);
              loadModels(frmProps.values['infocarSupplier'] || '0', e.target.value);
            }}
            id="infocarMake"
            label={labels.get('marca')}
            input={{
              filter: true,
              editable: true,
              options: makes.map(el => ({
                label: el.Descrizione,
                value: el.CodiceMarca
              }))
            }}
            icon="far fa-list-alt"
            value={frmProps.values['infocarMake']}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={e => {
              frmProps.handleChange(e);
              frmProps.setFieldValue('model', e.target.text);
              frmProps.setFieldValue('preparation', undefined);
              loadPreparations(e.target.value);
            }}
            id="infocarModel"
            label={labels.get('modello')}
            input={{
              filter: true,
              editable: true,
              options: models.map(el => ({
                label: el.Descrizione,
                value: el.CodiceModello
              }))
            }}
            icon="fas fa-business-time"
            value={frmProps.values.infocarModel}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="preparation"
            label={labels.get('allestimento')}
            icon="fas fa-business-time"
            input={{
              filter: true,
              editable: true,
              options: preparations.map(el => ({
                label: el.DescrizioneCompleta,
                value: el.DescrizioneCompleta
              }))
            }}
            value={frmProps.values.preparation}
          />
        </React.Fragment>
      )}
    />
  );
};

TagliandoEditor.defaultProps = {
  buttonSettings: {
    tooltip: 'editor modello tagliando',
    icon: CATEGORY_ICON[ITEM_CATEGORY.tagliando]
  },
  header: 'editor modello tagliando'
};

export default TagliandoEditor;
