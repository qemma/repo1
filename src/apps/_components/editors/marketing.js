// @flow
import * as React from "react";
import * as Yup from "yup";
import {
  ITEM_CATEGORY,
  CATEGORY_ICON,
  ENTITY_STATUS
} from "../../shared/const";
import ModalEditor from "./modal-editor";
import { Editor } from "primereact/editor";
import * as Fields from "./fields";
import { isEmpty, sortBy } from "lodash";
import PossibleMatchingVehicles from "../marketing/possible-matches";

import { PiramisContext } from "../../shared/piramis-context";

// function insertAddress(e, p) {
//   debugger;
// }
const schema = () =>
  Yup.object({
    name: Yup.string().required("Inserire il nome della campagna"),
    description: Yup.string().required(
      "Inserire la descrizione della campagna"
    ),
    //mail:Yup.string().required('inserire il mittente della campagna (indirizzo noreply per esempio)'),
    notes: Yup.string().required("Inserire il testo della campagna"),
    startDate: Yup.string().required("Inserire la data inizio della campagna"),
    endDate: Yup.string().required("Inserire la data fine della campagna"),
    criteria: Yup.object().required(
      "Inserire almeno un criterio di ricerca per la campagna"
    )
  });

type Props = {
  entity?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const MarketingEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData, gisApi } = context;
  const [makes, setMakes] = React.useState([]);
  const [models, setModels] = React.useState([]);
  const [preparations, setPreparations] = React.useState([]);
  const province = sortBy(
    domainData.regioni.reduce((acc, curr) => {
      return acc.concat(curr.province);
    }, []),
    el => el
  );

  async function loadMakes() {
    const makesString = localStorage.getItem("infocarmakes");
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
      Alimentazione: alimen || "0",
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

  function editorToolbar() {
    return (
      <div>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="0">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="0">Normal</option>
          </select>
          <select className="ql-font">
            <option />
            <option value="serif" />
            <option value="monospace" />
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" aria-label="Bold" />
          <button className="ql-italic" aria-label="Italic" />
          <button className="ql-underline" aria-label="Underline" />
        </span>
        <span className="ql-formats">
          <select className="ql-color" />
          <select className="ql-background" />
        </span>
        <span className="ql-formats">
          <button
            className="ql-list"
            value="ordered"
            aria-label="Ordered List"
          />
          <button
            className="ql-list"
            value="bullet"
            aria-label="Unordered List"
          />
          <select className="ql-align">
            <option defaultValue />
            <option value="center" />
            <option value="right" />
            <option value="justify" />
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-link" aria-label="Insert Link" />
          <button className="ql-image" aria-label="Insert Image" />
          <button className="ql-code-block" aria-label="Insert Code Block" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" aria-label="Remove Styles" />
        </span>
        <span className="ql-formats">
          <button
            className="ql-insertPlaceholderName"
            style={{ marginRight: "20px" }}
          >
            <span>Nome</span>
          </button>
        </span>
        <span className="ql-formats">
          <button
            className="ql-insertPlaceholderPlate"
            style={{ marginRight: "20px" }}
          >
            <span>targa</span>
          </button>
        </span>
        <span className="ql-formats">
          <button
            className="ql-insertPlaceholderMake"
            style={{ marginRight: "20px" }}
          >
            <span>marca</span>
          </button>
        </span>
        <span className="ql-formats">
          <button
            className="ql-insertPlaceholderModel"
            style={{ marginRight: "20px" }}
          >
            <span>modello</span>
          </button>
        </span>

        <button className="ql-insertAddress" style={{ marginRight: "20px" }}>
          <span>indirizzo</span>
        </button>
      </div>
    );
  }

  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={() => schema()}
      labels={labels}
      category={ITEM_CATEGORY.marketing}
      parent={props.parent}
      onConfirm={e => {
        const item = {
          ...e,
          status: e.status || ENTITY_STATUS.inserted
        };
        return props.onConfirm(item);
      }}
      entity={props.entity}
      onOpen={() => {
        loadMakes();
        if (
          props.entity &&
          props.entity.criteria &&
          props.entity.criteria.infocarMake &&
          props.entity.criteria.infocarSupplier
        ) {
          loadModels(
            props.entity.criteria.infocarSupplier,
            props.entity.criteria.infocarMake
          );
          if (
            props.entity &&
            props.entity.criteria &&
            props.entity.criteria.infocarModel
          ) {
            loadPreparations(props.entity.criteria.infocarModel);
          }
        }
      }}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="name"
            label={labels.get("nomeCampagna")}
            icon="far fa-clock"
            value={frmProps.values.name}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="mail"
            label={labels.get("Mittente (per esempio indirizzo noreply)")}
            icon="fas fa-user"
            value={frmProps.values.mail}
          />

          <Fields.TextAreaField
            onChange={frmProps.handleChange}
            id="description"
            label={labels.get("descrizioneCampagna")}
            value={frmProps.values["description"]}
            errors={frmProps.errors}
          />

          <Fields.CalendarField
            onChange={frmProps.handleChange}
            id="startDate"
            input={{ defaultNull: true }}
            label={labels.get("dataInizio")}
            value={frmProps.values["startDate"]}
            errors={frmProps.errors}
          />

          <Fields.CalendarField
            onChange={frmProps.handleChange}
            id="endDate"
            input={{ defaultNull: true }}
            label={labels.get("dataFine")}
            value={frmProps.values["endDate"]}
            errors={frmProps.errors}
          />

          <div className="p-col-12 mt-4">
            <div>
              <label htmlFor="notes">{labels.get("testoCampagna")}</label>
            </div>
            <Editor
              id="notes"
              // headerTemplate={editorToolbar()}
              // modules={{
              //   toolbar: {
              //     handlers: {
              //       insertAddress
              //     }
              //   }
              // }}
              className={`w-full ${frmProps.errors.notes && "p-error"}`}
              style={{ height: "320px" }}
              value={frmProps.values.notes}
              onTextChange={e => frmProps.setFieldValue("notes", e.htmlValue)}
            />
          </div>
          <div
            className="w-full"
            style={{
              border: !isEmpty(frmProps.errors.criteria)
                ? "1px solid red"
                : "none"
            }}
          >
            <div className="p-col-12 mt-4">
              <h3 style={{ padding: 0, marginBottom: "-10px" }}>
                {labels.get("criteriRicerca")}
                {isEmpty(frmProps.errors.criteria) && (
                  <PossibleMatchingVehicles
                    style={{ marginLeft: "5px" }}
                    tooltip={labels.get("possibiliVeicoliCoinvolti")}
                    criteria={frmProps.values.criteria}
                    hierarchyId={props.parent.hierarchyId}
                  />
                )}
              </h3>
            </div>

            <Fields.InputField
              onChange={frmProps.handleChange}
              errors={frmProps.errors}
              id="criteria.kmFrom"
              input={{ keyfilter: "pint" }}
              label={labels.get("kmPercorsiDa")}
              icon="fas fa-tachometer-alt"
              value={
                frmProps.values.criteria && frmProps.values.criteria.kmFrom
              }
            />

            <Fields.InputField
              onChange={frmProps.handleChange}
              errors={frmProps.errors}
              id="criteria.kmTo"
              input={{ keyfilter: "pint" }}
              label={labels.get("kmPercorsiA")}
              icon="fas fa-tachometer-alt"
              value={frmProps.values.criteria && frmProps.values.criteria.kmTo}
            />

            <Fields.CalendarField
              onChange={frmProps.handleChange}
              id="criteria.registrationDateFrom"
              input={{ defaultNull: true }}
              label={labels.get("immatricolataDal")}
              value={
                frmProps.values.criteria &&
                frmProps.values.criteria["registrationDateFrom"]
              }
              errors={frmProps.errors}
            />

            <Fields.CalendarField
              onChange={frmProps.handleChange}
              id="criteria.registrationDateTo"
              input={{ defaultNull: true }}
              label={labels.get("immatricolataAl")}
              value={
                frmProps.values.criteria &&
                frmProps.values.criteria["registrationDateTo"]
              }
              errors={frmProps.errors}
            />

            <Fields.SelectField
              onChange={frmProps.handleChange}
              id="criteria.customerType"
              label={labels.get("tipo cliente")}
              input={{
                options: [
                  { label: "privato", value: "cliente-privato" },
                  { label: "azienda", value: "cliente-azienda" }
                ]
              }}
              icon="fas fa-users"
              value={
                frmProps.values.criteria &&
                frmProps.values.criteria["customerType"]
              }
              errors={frmProps.errors}
            />

            <Fields.SelectField
              onChange={frmProps.handleChange}
              id="criteria.imeiCondition"
              label={labels.get("tipo cliente")}
              input={{
                options: [
                  { label: "qualsiasi", value: "" },
                  { label: "con dispositivo", value: "imei" },
                  { label: "senza dispositivo", value: "noimei" }
                ]
              }}
              icon="fas fa-tablet"
              value={
                frmProps.values.criteria
                  ? frmProps.values.criteria["imeiCondition"] || ""
                  : ""
              }
              errors={frmProps.errors}
            />

            <Fields.MultiSelectField
              onChange={frmProps.handleChange}
              id="criteria.regions"
              label={labels.get("regioni")}
              input={{
                options: domainData.regioni.map(el => ({
                  label: el.nome,
                  value: el.nome
                })),
                multi: true
              }}
              icon="fas fa-globe-europe"
              value={
                frmProps.values.criteria && frmProps.values.criteria.regions
              }
              errors={frmProps.errors}
            />

            <Fields.MultiSelectField
              onChange={frmProps.handleChange}
              id="criteria.provinces"
              label={labels.get("province")}
              input={{
                options: province.map(el => ({
                  label: el,
                  value: el
                })),
                multi: true
              }}
              icon="fas fa-globe-europe"
              value={
                frmProps.values.criteria && frmProps.values.criteria.provinces
              }
              errors={frmProps.errors}
            />

            <Fields.SelectField
              onChange={e => {
                frmProps.handleChange(e);
                frmProps.setFieldValue("criteria.model", undefined);
                frmProps.setFieldValue("criteria.infocarModel", undefined);
                frmProps.setFieldValue("criteria.preparation", undefined);
                frmProps.setFieldValue("criteria.make", undefined);
                frmProps.setFieldValue("criteria.infocarMake", undefined);
                setPreparations([]);
                setModels([]);
              }}
              id="criteria.type"
              label={labels.get("tipoVeicolo")}
              input={{
                options: domainData.vehicleTypes
              }}
              icon="far fa-list-alt"
              value={
                frmProps.values.criteria && frmProps.values.criteria["type"]
              }
              errors={frmProps.errors}
            />

            <Fields.SelectField
              onChange={e => {
                frmProps.handleChange(e);
                frmProps.setFieldValue("criteria.supplier", e.target.text);
                frmProps.setFieldValue("criteria.model", undefined);
                frmProps.setFieldValue("criteria.infocarModel", undefined);
                frmProps.setFieldValue("criteria.preparation", undefined);
                setPreparations([]);
                setModels([]);
                if (frmProps.values.make) {
                  loadModels(e.target.value, frmProps.values.infocarMake);
                }
              }}
              id="criteria.infocarSupplier"
              label={labels.get("alimentazione")}
              input={{
                options: domainData.alimentazione.filter(el => el.value !== "0")
              }}
              icon="far fa-list-alt"
              value={
                frmProps.values.criteria &&
                frmProps.values.criteria.infocarSupplier
              }
              errors={frmProps.errors}
            />

            <Fields.SelectField
              onChange={e => {
                frmProps.handleChange(e);
                frmProps.setFieldValue("criteria.make", e.target.text);
                frmProps.setFieldValue("criteria.model", undefined);
                frmProps.setFieldValue("criteria.infocarModel", undefined);
                frmProps.setFieldValue("criteria.preparation", undefined);
                setPreparations([]);
                setModels([]);
                loadModels(
                  (frmProps.values.criteria &&
                    frmProps.values.criteria["infocarSupplier"]) ||
                    "0",
                  e.target.value
                );
              }}
              id="criteria.infocarMake"
              label={labels.get("marca")}
              input={{
                filter: true,
                editable: true,
                options: makes.map(el => ({
                  label: el.Descrizione,
                  value: el.CodiceMarca
                }))
              }}
              icon="far fa-list-alt"
              value={
                frmProps.values.criteria &&
                frmProps.values.criteria["infocarMake"]
              }
              errors={frmProps.errors}
            />

            <Fields.SelectField
              onChange={e => {
                frmProps.handleChange(e);
                frmProps.setFieldValue("criteria.model", e.target.text);
                frmProps.setFieldValue("criteria.preparation", undefined);
                loadPreparations(e.target.value);
              }}
              id="criteria.infocarModel"
              label={labels.get("modello")}
              input={{
                filter: true,
                editable: true,
                options: models.map(el => ({
                  label: el.Descrizione,
                  value: el.CodiceModello
                }))
              }}
              icon="fas fa-business-time"
              value={
                frmProps.values.criteria &&
                frmProps.values.criteria.infocarModel
              }
              errors={frmProps.errors}
            />

            <Fields.SelectField
              onChange={frmProps.handleChange}
              errors={frmProps.errors}
              id="criteria.preparation"
              label={labels.get("allestimento")}
              icon="fas fa-business-time"
              input={{
                filter: true,
                editable: true,
                options: preparations.map(el => ({
                  label: el.DescrizioneCompleta,
                  value: el.DescrizioneCompleta
                }))
              }}
              value={
                frmProps.values.criteria && frmProps.values.criteria.preparation
              }
            />
          </div>
        </React.Fragment>
      )}
    />
  );
};

MarketingEditor.defaultProps = {
  buttonSettings: {
    tooltip: "modifica/crea campagna",
    icon: CATEGORY_ICON[ITEM_CATEGORY.marketing]
  },
  header: "modifica/crea campagna"
};

export default MarketingEditor;
