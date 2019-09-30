// @flow
import * as React from "react";
import * as Yup from "yup";
import ModalEditor from "./modal-editor";
import {
  ITEM_CATEGORY,
  PIRAMIS_ROLES,
  CATEGORY_ICON
} from "../../shared/const";
import * as Fields from "./fields";
import EntitySelector from "../entity-select";
import { PiramisContext } from "../../shared/piramis-context";
import { getentityDescription } from "../utils";

const schema = Yup.object({
  username: Yup.string()
    .required("Nome utente obbligatorio")
    .email("Il nome utente deve essere una mail valida"),
  roles: Yup.string().required(`inserire un ruolo`),
  group: Yup.string().nullable(),
  entityId: Yup.string().nullable(),

  name: Yup.string()
    .required("Nome obbligatorio")
    .min(3, "Inserire un nome di almeno 3 caratteri"),
  surname: Yup.string()
    .required("Cognome obbligatorio")
    .min(3, "Inserire un cognome di almeno 3 caratteri"),
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
  address: Yup.object().address(),
  phone: Yup.string()
    .required()
    .min(8, "Il numero di cellulare deve essere compreso tra 8 e 15 cifre")
    .max(15, "Il numero di cellulare deve essere compreso tra 8 e 15 cifre"),
  intPhone: Yup.string().max(
    15,
    "l'interno aziendale deve essere massimo 15 cifre"
  ),
  pec: Yup.string().email("la pec deve essere una mail valida"),
  codElectronicInvoice: Yup.string(),
  mail: Yup.string()
    .required(`Mail personale obbligatoria`)
    .email("Inserire una mail valida")
});

type Props = {
  user?: any,
  onConfirm: Function,
  labels: any,
  header?: any,
  parent?: any,
  disable?: Array<string>,
  buttonSettings?: any,
  entityService: EntityService
};

const UserEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService } = context;

  const [entityDescription, setEntityDescription] = React.useState("");

  function onEditorOpen() {
    setEntityDescription("");
    if (props.user && props.user.entityId) {
      resolveEntity(props.user.entityId);
    }
  }
  async function resolveEntity(id: string) {
    const result: any = await entityService.search({
      from: 0,
      size: 1,
      type: "match",
      field: "uuid",
      value: id
    });

    if (result.items && result.items.length) {
      const description = getentityDescription(result.items[0]);
      setEntityDescription(description);
    }
  }

  function getAssociationCategoryOptions(role) {
    if (
      [
        PIRAMIS_ROLES.venditore,
        PIRAMIS_ROLES.service,
        PIRAMIS_ROLES.agente,
        PIRAMIS_ROLES.marketing
      ].includes(role)
    ) {
      return {
        includeChildren: true,
        type: "terms",
        field: "category",
        value: [ITEM_CATEGORY.dealer]
      };
    } else {
      return {
        category: role
      };
    }
  }

  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={schema}
      parent={props.parent}
      category={ITEM_CATEGORY.utente}
      onConfirm={props.onConfirm}
      entity={props.user}
      labels={labels}
      onOpen={onEditorOpen}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={(e: any) => {
              frmProps.setFieldValue("uuid", e.target.value);
              frmProps.handleChange(e);
            }}
            input={{
              disabled: props.disable && props.disable.includes("username")
            }}
            id="username"
            label={labels.get("username (email)")}
            icon="fas fa-user"
            value={frmProps.values["username"]}
            errors={frmProps.errors}
          />

          <Fields.SelectField
            onChange={e => {
              frmProps.handleChange(e);
              frmProps.setFieldValue("entityId", "");
              frmProps.setFieldValue("group", frmProps.values["uuid"]);
              frmProps.setFieldValue("parentId", frmProps.values["uuid"]);
              frmProps.setFieldValue("hierarchyId", frmProps.values["uuid"]);
              setEntityDescription("");
            }}
            id="roles"
            input={{
              options: Object.keys(PIRAMIS_ROLES).map(key => ({
                label: key,
                value: key
              })),
              disabled: props.disable && props.disable.includes("roles")
            }}
            label={labels.get("ruoli utente")}
            icon="fas fa-thumbs-up"
            value={frmProps.values["roles"]}
            errors={frmProps.errors}
          />

          {[
            PIRAMIS_ROLES.venditore,
            PIRAMIS_ROLES.dealer,
            PIRAMIS_ROLES.service,
            PIRAMIS_ROLES.agente,
            PIRAMIS_ROLES.marketing
          ].includes(frmProps.values["roles"]) && (
            <div className="p-col-12 mt-4">
              <label>{labels.get("associato a")}</label>
              <div className="p-inputgroup">
                <strong>{entityDescription}</strong>
                <span>
                  <EntitySelector
                    disabled={
                      props.disable && props.disable.includes("entityId")
                    }
                    options={getAssociationCategoryOptions(
                      frmProps.values["roles"]
                    )}
                    style={{ marginLeft: "5px", marginBottom: "5px" }}
                    tooltip={labels.get(
                      "seleziona entita' da associare a questo utente"
                    )}
                    onSelect={(entity: any) => {
                      frmProps.setFieldValue("group", entity.group);
                      frmProps.setFieldValue("entityId", entity.uuid);
                      frmProps.setFieldValue("parentId", entity.uuid);
                      const description = getentityDescription(entity);
                      setEntityDescription(description);
                      frmProps.setFieldValue("group", entity.group);
                      frmProps.setFieldValue(
                        "hierarchyId",
                        `${entity.hierarchyId}*${frmProps.values["uuid"]}`
                      );
                    }}
                  />
                </span>
              </div>
            </div>
          )}

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="name"
            label={labels.get("nome")}
            icon="far fa-address-card"
            value={frmProps.values["name"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="surname"
            label={labels.get("cognome")}
            icon="far fa-address-card"
            value={frmProps.values["surname"]}
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

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="phone"
            input={{ keyfilter: "pint" }}
            icon="fas fa-phone"
            label={labels.get("cellulare")}
            value={frmProps.values["phone"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="intPhone"
            input={{ keyfilter: "pint" }}
            icon="fas fa-phone"
            label={labels.get("interno aziendale")}
            value={frmProps.values["intPhone"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            id="pec"
            icon="fas fa-at"
            label={labels.get("mail certificata (pec)")}
            value={frmProps.values["pec"]}
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
            id="mail"
            icon="fas fa-at"
            label={labels.get("mail personale")}
            value={frmProps.values["mail"]}
            errors={frmProps.errors}
          />
        </React.Fragment>
      )}
    />
  );
};

UserEditor.defaultProps = {
  buttonSettings: {
    tooltip: "editor utente",
    icon: CATEGORY_ICON[ITEM_CATEGORY.utente]
  },
  header: "editor utente"
};

export default UserEditor;
