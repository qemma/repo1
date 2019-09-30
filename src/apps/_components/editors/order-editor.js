// @flow
import * as React from "react";
import * as Yup from "yup";
import ModalEditor from "./modal-editor";
import { ITEM_CATEGORY, CATEGORY_ICON } from "../../shared/const";
import * as Fields from "./fields";
import { PiramisContext } from "../../shared/piramis-context";

const schema = () =>
  Yup.object({
    reference1: Yup.string().required(
      "Inserire il riferimento ordine (mettere il nome del dealer/filiale)"
    ),
    description: Yup.string().required("Inserire una descrizione per l'ordine"),
    model: Yup.string().required("Il tipo di dispositivo e' obbligatorio"),
    quantity: Yup.number().required("Totale dispositivi e' obbligatorio"),
    endDate: Yup.string()
      .ensure()
      .required("La data di consegna richiesta e' obbligatoria")
      .min(8, `La data di consegna richiesta e' obbligatoria`)
  });

type Props = {
  order?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any,
  domainData: any
};

const OrderEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData } = context;
  return (
    <ModalEditor
      labels={labels}
      buttonSettings={props.buttonSettings}
      schema={schema}
      category={ITEM_CATEGORY.ordine}
      parent={props.parent}
      onConfirm={props.onConfirm}
      entity={props.order}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="reference1"
            label={labels.get("riferimentoOrdine")}
            icon="far fa-address-card"
            value={frmProps.values["reference1"]}
            errors={frmProps.errors}
          />
          <Fields.TextAreaField
            onChange={frmProps.handleChange}
            id="description"
            label={labels.get("noteOrdine")}
            value={frmProps.values["description"]}
            errors={frmProps.errors}
          />
          <Fields.SelectField
            onChange={frmProps.handleChange}
            id="model"
            label={labels.get("tipoDispositivo")}
            input={{
              options: domainData.devicesType
            }}
            icon="far fa-list-alt"
            value={frmProps.values["model"]}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="quantity"
            input={{ keyfilter: "pint" }}
            label={labels.get("qiantitativoRichiesto")}
            icon={CATEGORY_ICON[ITEM_CATEGORY.device]}
            value={frmProps.values.quantity}
          />

          <Fields.CalendarField
            onChange={frmProps.handleChange}
            id="endDate"
            input={{ defaultNull: true }}
            label={labels.get("dataConsegnaRichiesta")}
            value={frmProps.values["endDate"]}
            errors={frmProps.errors}
          />
        </React.Fragment>
      )}
    />
  );
};

OrderEditor.defaultProps = {
  buttonSettings: {
    tooltip: "editor ordine",
    icon: CATEGORY_ICON[ITEM_CATEGORY.ordine]
  },
  header: "editor ordine"
};

export default OrderEditor;
