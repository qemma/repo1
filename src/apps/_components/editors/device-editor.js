// @flow
import * as React from "react";
import * as Yup from "yup";
import ModalEditor from "./modal-editor";
import { ITEM_CATEGORY, CATEGORY_ICON } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import * as Fields from "./fields";

const schema = () =>
  Yup.object({
    imei: Yup.string()
      .required("IMEI obbligatorio")
      .min(15, "Il codice IMEI deve essere di 15 cifre")
      .max(15, "Il codice IMEI deve essere di 15 cifre"),
    sn: Yup.string().required("Il numero seriale e' obbligatorio"),
    model: Yup.string().required("Il modello e' obbligatorio"),
    supplier: Yup.string().required("Il fornitore e' obbligatorio"),
    insertionDate: Yup.string()
      .ensure()
      .required("La data inserimento e' obbligatoria")
      .min(8, `La data inserimento e' obbligatoria`)
  });

type Props = {
  sat?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

function DeviceEditor(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData } = context;
  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={schema}
      category={ITEM_CATEGORY.sat}
      parent={props.parent}
      labels={labels}
      onConfirm={props.onConfirm}
      entity={props.sat}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="imei"
            label={labels.get("imei")}
            icon="far fa-address-card"
            value={frmProps.values["imei"]}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="sn"
            label={labels.get("serialNumber")}
            icon="fas fa-barcode"
            value={frmProps.values["sn"]}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="model"
            label={labels.get("model")}
            icon="far fa-list-alt"
            value={frmProps.values["model"]}
            errors={frmProps.errors}
          />
          <Fields.SelectField
            onChange={frmProps.handleChange}
            id="type"
            label={labels.get("tipoDispositivo")}
            input={{
              options: domainData.devicesType
            }}
            icon="far fa-list-alt"
            value={frmProps.values["type"]}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={frmProps.handleChange}
            id="supplier"
            label={labels.get("supplier")}
            input={{
              options: domainData.suppliers
            }}
            icon="fas fa-truck"
            value={frmProps.values["supplier"]}
            errors={frmProps.errors}
          />

          <Fields.CalendarField
            onChange={frmProps.handleChange}
            id="insertionDate"
            label={labels.get("insertionDate")}
            value={frmProps.values["insertionDate"]}
            errors={frmProps.errors}
          />
        </React.Fragment>
      )}
    />
  );
}

DeviceEditor.defaultProps = {
  buttonSettings: {
    tooltip: "editor dispositivo",
    icon: CATEGORY_ICON[ITEM_CATEGORY.device]
  },
  header: "editor dispositivo"
};

export default DeviceEditor;
