// @flow
import * as React from "react";
import * as Yup from "yup";
import { ITEM_CATEGORY, CATEGORY_ICON } from "../../shared/const";
import ModalEditor from "./modal-editor";
import * as Fields from "./fields";
import { PiramisContext } from "../../shared/piramis-context";

const schema = () =>
  Yup.object({
    name: Yup.string()
      .required("Denominazione obbligatoria")
      .min(3, "Inserire una denominazione di almeno 3 caratteri"),
    users: Yup.array(Yup.string()).ensure(),
    phone: Yup.string()
      .required()
      .min(8, "Il numero di telefono deve essere compreso tra 8 e 15 cifre")
      .max(15, "Il numero di telefono deve essere compreso tra 8 e 15 cifre"),
    vatCode: Yup.string()
      .vatCode()
      .when("taxCode", (taxCode, schema) => {
        return taxCode
          ? schema
          : schema.required(
              "Almeno uno tra partita iva e codice fiscale deve essere inserito"
            );
      }),
    taxCode: Yup.string().taxCode(),
    codElectronicInvoice: Yup.string(),
    address: Yup.object().address(),
    mail: Yup.string()
      .required("Inserire una mail valida")
      .email("Inserire una mail valida"),
    pec: Yup.string()
      .required("La pec deve essere una mail valida")
      .email("La pec deve essere una mail valida"),
    reference1: Yup.string().required(
      "Inserire almeno una persona di riferimento"
    ),
    reference2: Yup.string(),
    reference3: Yup.string()
  });

type Props = {
  customer?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const CompanyCustomerEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels } = context;
  return (
    <ModalEditor
      labels={labels}
      buttonSettings={props.buttonSettings}
      schema={schema}
      category={ITEM_CATEGORY["cliente-azienda"]}
      parent={props.parent}
      onConfirm={props.onConfirm}
      entity={props.customer}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="name"
            label={labels.get("ragione sociale")}
            icon="far fa-address-card"
            value={frmProps.values["name"]}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="notes"
            label={labels.get("note")}
            icon="far fa-address-card"
            value={frmProps.values["notes"]}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="vatCode"
            label={labels.get("partita iva")}
            icon="fas fa-barcode"
            value={frmProps.values["vatCode"]}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="taxCode"
            label={labels.get("codice fiscale")}
            icon="fas fa-credit-card"
            value={frmProps.values["taxCode"]}
            errors={frmProps.errors}
          />

          <Fields.PlacesField
            onChange={frmProps.handleChange}
            id="address"
            icon="fas fa-map-marker-alt"
            label={labels.get("indirizzo")}
            value={frmProps.values["address"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="phone"
            input={{ keyfilter: "pint" }}
            icon="fas fa-phone"
            label={labels.get("tel")}
            value={frmProps.values["phone"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="pec"
            icon="fas fa-at"
            label={labels.get("pec")}
            value={frmProps.values["pec"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="mail"
            icon="fas fa-at"
            label={labels.get("email")}
            value={frmProps.values["mail"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="codElectronicInvoice"
            icon="fas fa-qrcode"
            label={labels.get("Codice Fatturazione Elettronica")}
            value={frmProps.values["codElectronicInvoice"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="reference1"
            icon="far fa-address-card"
            label={labels.get("personaRiferimento")}
            value={frmProps.values["reference1"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="reference2"
            icon="far fa-address-card"
            label={labels.get("personaRiferimento")}
            value={frmProps.values["reference2"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="reference3"
            icon="far fa-address-card"
            label={labels.get("personaRiferimento")}
            value={frmProps.values["reference3"]}
            errors={frmProps.errors}
          />
        </React.Fragment>
      )}
    />
  );
};

CompanyCustomerEditor.defaultProps = {
  buttonSettings: {
    tooltip: "editor cliente azienda",
    icon: CATEGORY_ICON[ITEM_CATEGORY["cliente-azienda"]]
  },
  header: "editor cliente azienda"
};

export default CompanyCustomerEditor;
