// @flow
import * as React from "react";
import * as Yup from "yup";
import {
  ITEM_CATEGORY,
  CATEGORY_ICON,
  PIRAMIS_ROLES
} from "../../shared/const";
import ModalEditor from "./modal-editor";
import * as Fields from "./fields";
import EntitySelector from "../entity-select";
import { PiramisContext } from "../../shared/piramis-context";
import { getentityDescription } from "../utils";

const schema = Yup.object({
  name: Yup.string()
    .required("Denominazione obbligatoria")
    .min(3, "Inserire una denominazione di almeno 3 caratteri"),
  phone: Yup.string()
    //.required()
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
  mail: Yup.string().email("Inserire una mail valida"),
  pec: Yup.string("La pec deve essere una mail valida"),
  //.required()
  //.email("la pec deve essere una mail valida"),
  reference1: Yup.string()
  // reference2: Yup.string(),
  // reference3: Yup.string()
});

type Props = {
  dealer?: any,
  parent?: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const DealerEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [agentDescription, setAgentDescription] = React.useState("");
  const { labels, entityService } = context;

  function onEditorOpen() {
    setAgentDescription("");
    if (props.dealer && props.dealer.reference1) {
      resolveAgent(props.dealer.reference1);
    }
  }

  async function resolveAgent(id: string) {
    const result: any = await entityService.search({
      from: 0,
      size: 1,
      type: "match",
      field: "uuid",
      value: id
    });

    if (result.items && result.items.length) {
      const description = getentityDescription(result.items[0]);
      setAgentDescription(description);
    }
  }

  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={schema}
      ownGroup
      labels={labels}
      parent={props.parent}
      category={ITEM_CATEGORY.dealer}
      onConfirm={props.onConfirm}
      entity={props.dealer}
      onOpen={onEditorOpen}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="name"
            label={labels.get("ragioneSociale")}
            icon="far fa-address-card"
            value={frmProps.values["name"]}
            errors={frmProps.errors}
          />
          <Fields.InputField
            onChange={frmProps.handleChange}
            id="vatCode"
            label={labels.get("partitaIva")}
            icon="fas fa-barcode"
            value={frmProps.values["vatCode"]}
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
            label={labels.get("codiceFatturazioneElettronica")}
            value={frmProps.values["codElectronicInvoice"]}
            errors={frmProps.errors}
          />

          <div className="p-col-12 mt-4">
            <label>{labels.get("agenteRiferimento")}</label>
            <div className="p-inputgroup">
              <strong>{agentDescription}</strong>
              <span>
                <EntitySelector
                  options={{
                    category: ITEM_CATEGORY.utente,
                    filters: {
                      roles: { matchMode: "match", value: PIRAMIS_ROLES.agente }
                    }
                  }}
                  style={{ marginLeft: "5px", marginBottom: "5px" }}
                  tooltip={labels.get(
                    "Seleziona agente da associare a questo dealer"
                  )}
                  onSelect={(entity: any) => {
                    frmProps.setFieldValue("reference1", entity.uuid);
                    const description = getentityDescription(entity);
                    frmProps.setFieldValue("reference2", description);
                    setAgentDescription(description);
                  }}
                />
              </span>
            </div>
          </div>
        </React.Fragment>
      )}
    />
  );
};

DealerEditor.defaultProps = {
  buttonSettings: {
    tooltip: "Editor dealer",
    icon: CATEGORY_ICON[ITEM_CATEGORY.dealer]
  },
  header: "Editor Dealer"
};

export default DealerEditor;
