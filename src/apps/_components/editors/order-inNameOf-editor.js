// @flow
import * as React from "react";
import * as Yup from "yup";
import ModalEditor from "./modal-editor";
import { ITEM_CATEGORY, CATEGORY_ICON } from "../../shared/const";
import * as Fields from "./fields";
import { PiramisContext } from "../../shared/piramis-context";
// import EntitySelector from '../entity-select';
import EntityTreeSelector from "../entity-select/tree-select";
import { getentityDescription } from "../../_components/utils";

const schema = () =>
  Yup.object({
    reference1: Yup.string().required(
      "Selezionare il dealer per conto del quale si vuole effettuare il nuovo ordine"
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
  domainData: any,
  inNameOf: "*" | Array<string>
};

const OrderInNameOfEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData } = context;
  const [parent, setParent] = React.useState();

  return (
    <ModalEditor
      labels={labels}
      buttonSettings={props.buttonSettings}
      schema={schema}
      parent={parent}
      entity={props.order}
      category={ITEM_CATEGORY.ordine}
      onConfirm={props.onConfirm}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <div className="p-col-12 mt-4">
            <label>{labels.get("dealer a cui si associa l'ordine")}</label>
            <div className="p-inputgroup">
              <strong>{parent ? getentityDescription(parent) : ""}</strong>
              <span>
                <EntityTreeSelector
                  groups={props.inNameOf}
                  style={{ marginLeft: "5px", marginBottom: "5px" }}
                  tooltip={labels.get(
                    "Selezionare il dealer per conto del quale si vuole effettuare il nuovo ordine"
                  )}
                  onSelect={(parent: any) => {
                    setParent(parent);
                    frmProps.setFieldValue("group", parent.group);
                    frmProps.setFieldValue("parentId", parent.uuid);
                    const description = getentityDescription(parent);
                    frmProps.setFieldValue("reference1", description);
                    frmProps.setFieldValue("name", parent.name);
                    frmProps.setFieldValue("address", parent.address);
                  }}
                />
              </span>
            </div>
          </div>
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
            label={labels.get("quantitativoRichiesto")}
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

OrderInNameOfEditor.defaultProps = {
  buttonSettings: {
    tooltip: "crea ordine per conto di",
    icon: CATEGORY_ICON[ITEM_CATEGORY.ordine]
  },
  header: "crea ordine per conto di"
};

export default OrderInNameOfEditor;
