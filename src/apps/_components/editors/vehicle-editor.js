// @flow
import * as React from "react";
import * as Yup from "yup";
import moment from "moment";
import { ITEM_CATEGORY, CATEGORY_ICON } from "../../shared/const";
import ModalEditor from "./modal-editor";
import * as Fields from "./fields";
import { PiramisContext } from "../../shared/piramis-context";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import PlateInfo from "./vehicle-fillfromPlate";
import { JsonEditor as Editor } from "jsoneditor-react";
// $FlowIgnore: require ace
import ace from "brace";
// $FlowIgnore: require json
import "brace/mode/json";
// $FlowIgnore: require theme
import "brace/theme/github";

const schema = () =>
  Yup.object({
    frame: Yup.string().required("Numero di telaio obbligatorio"),
    type: Yup.string()
      .required("Tipo di veicolo obbligatorio")
      .default(),
    km: Yup.number(), //.required("KM obbligatorio"),
    infocarSupplier: Yup.string().required(
      "Tipo di alimentazione obbligatorio"
    ),
    infocarMake: Yup.string().required("Marca obbligatoria"),
    // infocarModel: Yup.string().required('modello obbligatorio'),
    // preparation: Yup.string().required('tipo di allestimento'),
    registrationDate: Yup.string()
      .ensure()
      .required("La data di prima immatricolazione e' obbligatoria")
      .min(8, `La data di prima immatricolazione e' obbligatoria`)
  });

type Props = {
  vehicle?: any,
  parent: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const VehicleEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData, gisApi } = context;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [plateSearchText, setPlateSearchText] = React.useState("");
  const [makes, setMakes] = React.useState([]);
  const [models, setModels] = React.useState([]);
  const [plateData, setPlateData] = React.useState();
  const [preparations, setPreparations] = React.useState([]);

  async function changeTab(e) {
    setActiveIndex(e.index);
    if (e.index === 1) {
      await loadMakes();
      if (
        props.vehicle &&
        props.vehicle.infocarMake &&
        props.vehicle.infocarSupplier
      ) {
        loadModels(props.vehicle.infocarSupplier, props.vehicle.infocarMake);
        if (props.vehicle && props.vehicle.infocarModel) {
          loadPreparations(props.vehicle.infocarModel);
        }
      }
    }
  }

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

  async function loadModels(alimen: any, make: any) {
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

  function onCancel() {
    setPlateData(undefined);
  }

  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={schema}
      labels={labels}
      category={ITEM_CATEGORY.veicolo}
      parent={props.parent}
      onConfirm={vehicle => {
        const customer = props.parent;
        const updtVehicle = customer
          ? {
              ...vehicle,
              name: `${customer.name} ${customer.taxCode ||
                ""} ${customer.vatCode || ""}`,
              mail: customer.mail,
              phone: customer.phone,
              taxCode: customer.taxCode,
              vatCode: customer.vatCode,
              address: customer.address,
              pec: customer.pec,
              ownerType: customer.category === "cliente-azienda" ? 1 : 2
            }
          : vehicle;
        return props.onConfirm(updtVehicle);
      }}
      onCancel={onCancel}
      entity={props.vehicle}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <TabView
            activeIndex={activeIndex}
            onTabChange={changeTab}
            style={{ width: "100%" }}
          >
            <TabPanel header="Ricava dati da targa">
              <div>
                <h2>
                  {labels.get(
                    "Seleziona modello, alimentazione e inserisci la targa poi procedi"
                  )}
                </h2>

                <div className="p-col-12 mt-4">
                  <span className="p-float-label">
                    <div className="p-inputgroup">
                      <InputText
                        onChange={e => setPlateSearchText(e.target.value)}
                        value={plateSearchText || ""}
                        className="w-full"
                        id="plateSearch"
                      />
                      <span className="p-inputgroup-addon">
                        <PlateInfo
                          plate={plateSearchText}
                          plateData={plateData}
                          disabled={
                            !plateSearchText || plateSearchText.length < 5
                          }
                          tooltip={labels.get(
                            "Ottieni dati da targa. Seleziona prima modello e alimentazione"
                          )}
                          onSelect={async (plateData): any => {
                            setPlateData(undefined);
                            setPlateData(plateData);
                            frmProps.setFieldValue(
                              "preparation",
                              plateData.DescrizioneCompleta
                            );
                            frmProps.setFieldValue(
                              "model",
                              plateData.DescrizioneModello
                            );
                            frmProps.setFieldValue(
                              "make",
                              plateData.DescrizioneMarca
                            );
                            frmProps.setFieldValue(
                              "infocarMake",
                              plateData.CodiceMarca
                            );
                            frmProps.setFieldValue(
                              "infocarModel",
                              plateData.CodiceModello
                            );
                            frmProps.setFieldValue(
                              "registrationDate",
                              moment(plateData.Dataimmatricolazione)
                            );
                            frmProps.setFieldValue("frame", plateData.Telaio);
                            frmProps.setFieldValue("plate", plateSearchText);
                          }}
                        />
                      </span>
                      <label htmlFor="plateSearch">
                        {labels.get("cerca targa")}
                      </label>
                    </div>
                  </span>
                </div>

                <Fields.SelectField
                  onChange={frmProps.handleChange}
                  id="type"
                  label={labels.get("tipoVeicolo")}
                  input={{
                    options: domainData.vehicleTypes
                    // defaultValue: domainData.vehicleTypes.filter(
                    //   el => (el.value = domainData.vehicleTypes[1])
                    // )
                  }}
                  icon="far fa-list-alt"
                  value={frmProps.values["type"]}
                  errors={frmProps.errors}
                />
                <Fields.SelectField
                  onChange={e => {
                    frmProps.handleChange(e);
                    frmProps.setFieldValue("supplier", e.target.text);
                  }}
                  id="infocarSupplier"
                  label={labels.get("alimentazione")}
                  input={{
                    options: domainData.alimentazione.filter(
                      el => el.value !== "0"
                    )
                  }}
                  icon="far fa-list-alt"
                  value={frmProps.values.infocarSupplier}
                  errors={frmProps.errors}
                />

                <Fields.InputField
                  onChange={frmProps.handleChange}
                  errors={frmProps.errors}
                  id="km"
                  input={{ keyfilter: "pint" }}
                  label={labels.get("chilometri")}
                  icon="fas fa-tachometer-alt"
                  value={frmProps.values.km}
                />

                {plateData && (
                  <Editor
                    mode="view"
                    ace={ace}
                    theme="ace/theme/github"
                    navigationBar={false}
                    allowedModes={["view"]}
                    value={
                      plateData
                        ? {
                            Dataimmatricolazione: plateData.Dataimmatricolazione
                              ? moment(plateData.Dataimmatricolazione).format(
                                  "DD/MM/YYYY"
                                )
                              : undefined,
                            TargaPrecedente: plateData.TargaPrecedente,
                            Telaio: plateData.Telaio,
                            Anno: plateData.Anno,
                            Marca: plateData.DescrizioneMarca,
                            Modello: plateData.DescrizioneModello,
                            Allestimento: plateData.DescrizioneCompleta
                          }
                        : {}
                    }
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel header="Inserisci dati manualmente">
              <Fields.InputField
                id="plate"
                onChange={frmProps.handleChange}
                label={labels.get("targa")}
                icon="fas fa-newspaper"
                value={frmProps.values.plate}
                errors={frmProps.errors}
              />

              <Fields.InputField
                onChange={frmProps.handleChange}
                errors={frmProps.errors}
                id="frame"
                label={labels.get("numeroTelaio")}
                icon="fas fa-id-card"
                value={frmProps.values.frame}
              />

              <Fields.InputField
                onChange={frmProps.handleChange}
                errors={frmProps.errors}
                id="km"
                input={{ keyfilter: "pint" }}
                label={labels.get("chilometri")}
                icon="fas fa-tachometer-alt"
                value={frmProps.values.km}
              />

              <Fields.SelectField
                onChange={e => {
                  frmProps.handleChange(e);
                  frmProps.setFieldValue("model", undefined);
                  frmProps.setFieldValue("infocarModel", undefined);
                  frmProps.setFieldValue("preparation", undefined);
                  frmProps.setFieldValue("make", undefined);
                  frmProps.setFieldValue("infocarMake", undefined);
                  setPreparations([]);
                  setModels([]);
                }}
                id="type"
                label={labels.get("tipoVeicolo")}
                input={{
                  options: domainData.vehicleTypes
                }}
                icon="far fa-list-alt"
                value={frmProps.values["type"]}
                errors={frmProps.errors}
              />

              <Fields.SelectField
                onChange={e => {
                  frmProps.handleChange(e);
                  frmProps.setFieldValue("supplier", e.target.text);
                  frmProps.setFieldValue("model", undefined);
                  frmProps.setFieldValue("infocarModel", undefined);
                  frmProps.setFieldValue("preparation", undefined);
                  setPreparations([]);
                  setModels([]);
                  if (frmProps.values.make) {
                    loadModels(e.target.value, frmProps.values.infocarMake);
                  }
                }}
                id="infocarSupplier"
                label={labels.get("alimentazione")}
                input={{
                  options: domainData.alimentazione.filter(
                    el => el.value !== "0"
                  )
                }}
                icon="far fa-list-alt"
                value={frmProps.values.infocarSupplier}
                errors={frmProps.errors}
              />

              <Fields.SelectField
                onChange={e => {
                  frmProps.handleChange(e);
                  frmProps.setFieldValue("make", e.target.text);
                  frmProps.setFieldValue("model", undefined);
                  frmProps.setFieldValue("infocarModel", undefined);
                  frmProps.setFieldValue("preparation", undefined);
                  setPreparations([]);
                  setModels([]);
                  loadModels(
                    frmProps.values["infocarSupplier"] || "0",
                    e.target.value
                  );
                }}
                id="infocarMake"
                label={labels.get("marca")}
                input={{
                  //filter: true,
                  //editable: true,
                  options: makes.map(el => ({
                    label: el.Descrizione,
                    value: el.CodiceMarca
                  }))
                  // disabled:
                  //   !frmProps.values.supplier ||
                  //   Number(frmProps.values.supplier) === 0 ||
                  //   !frmProps.values.type
                }}
                icon="far fa-list-alt"
                value={frmProps.values["infocarMake"]}
                errors={frmProps.errors}
              />

              <Fields.SelectField
                onChange={e => {
                  frmProps.handleChange(e);
                  frmProps.setFieldValue("model", e.target.text);
                  frmProps.setFieldValue("preparation", undefined);
                  loadPreparations(e.target.value);
                }}
                id="infocarModel"
                label={labels.get("modello")}
                input={{
                  //filter: true,
                  //editable: true,
                  options: models.map(el => ({
                    label: el.Descrizione,
                    value: el.CodiceModello
                  }))
                  //disabled: !frmProps.values.make
                }}
                icon="fas fa-business-time"
                value={frmProps.values.infocarModel}
                errors={frmProps.errors}
              />

              <Fields.SelectField
                onChange={frmProps.handleChange}
                errors={frmProps.errors}
                id="preparation"
                label={labels.get("allestimento")}
                icon="fas fa-business-time"
                input={{
                  //filter: true,
                  //editable: true,
                  options: preparations.map(el => ({
                    label: el.DescrizioneCompleta,
                    value: el.DescrizioneCompleta
                  }))
                  //disabled: !frmProps.values.model
                }}
                value={frmProps.values.preparation}
              />

              <Fields.CalendarField
                onChange={frmProps.handleChange}
                id="registrationDate"
                input={{ defaultNull: true }}
                label={labels.get("dataPrimaImmatricolazione")}
                value={frmProps.values["registrationDate"]}
                errors={frmProps.errors}
              />
            </TabPanel>
          </TabView>
        </React.Fragment>
      )}
    />
  );
};

VehicleEditor.defaultProps = {
  buttonSettings: {
    tooltip: "Editor veicolo",
    icon: CATEGORY_ICON[ITEM_CATEGORY.veicolo]
  },
  header: "Editor veicolo"
};

export default VehicleEditor;
