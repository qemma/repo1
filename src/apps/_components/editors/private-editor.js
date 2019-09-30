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
      .required("Nome obbligatorio")
      .min(3, "Inserire un nome di almeno 3 caratteri"),
    taxCode: Yup.string()
      .taxCode()
      .required("Inserire il codice fiscale"),
    address: Yup.object().address(),
    phone: Yup.string()
      .required()
      .min(8, "Il numero di cellulare deve essere compreso tra 8 e 15 cifre")
      .max(15, "Il numero di cellulare deve essere compreso tra 8 e 15 cifre"),
    mail: Yup.string()
      .required(`Mail personale obbligatoria`)
      .email("Inserire una mail valida")
  });

type Props = {
  customer?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const PrivateCustomerEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels } = context;
  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={schema}
      labels={labels}
      category={ITEM_CATEGORY["cliente-privato"]}
      parent={props.parent}
      onConfirm={props.onConfirm}
      entity={props.customer}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            id="name"
            onChange={frmProps.handleChange}
            label={labels.get("nomeCompletoCliente")}
            icon="far fa-address-card"
            value={frmProps.values.name}
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
            id="taxCode"
            label={labels.get("codiceFiscale")}
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
            errors={frmProps.errors}
            id="phone"
            input={{ keyfilter: "pint" }}
            label={labels.get("tel")}
            icon="fas fa-phone"
            value={frmProps.values.phone}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="mail"
            icon="fas fa-at"
            label={labels.get("email")}
            value={frmProps.values.mail}
          />
        </React.Fragment>
      )}
    />
  );
};

PrivateCustomerEditor.defaultProps = {
  buttonSettings: {
    tooltip: "editor cliente privato",
    icon: CATEGORY_ICON[ITEM_CATEGORY["cliente-privato"]]
  },
  header: "editor cliente privato"
};

export default PrivateCustomerEditor;
