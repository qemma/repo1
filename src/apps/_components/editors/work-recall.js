// @flow
import * as React from "react";
import * as Yup from "yup";
import { ITEM_CATEGORY, CATEGORY_ICON } from "../../shared/const";
import ModalEditor from "./modal-editor";
import * as Fields from "./fields";
import { View } from "../entity-view/index";
import moment from "moment";

import { PiramisContext } from "../../shared/piramis-context";

const schema = vehicle =>
  Yup.object({
    notes: Yup.string().required(
      "Inserire note di chiusura e ltipo di lavoro eseguito"
    ),
    endDate: Yup.string().required("Inserire data di chiusura richiamo"),

    km: Yup.number().when("quantity", (quantity, schema) => {
      return quantity
        ? schema
        : schema.required(
            "Almeno uno tra scadenza chilometrica e scadenza temporale deve essere specificato"
          );
    }),
    quantity: Yup.number(),
    description: Yup.string().required(
      "Inserire una descrizione per il modello"
    )
  });

const getDataFields = (vehicle, labels, model, recall) => {
  return [
    {
      label: labels.get("descrizioneRichiamo"),
      value: model.description
    },
    {
      label: labels.get("scadenzaKm"),
      value: model.km || "-"
    },
    {
      label: labels.get("scadenzaMesi"),
      value: model.quantity || "-"
    },
    {
      label: labels.get("dataCreazioneRichiamo"),
      value: moment(recall.creationDate).format(labels.get("gridColDates"))
    },
    {
      label: labels.get("kmScadenza"),
      value: recall.km || "-"
    },
    {
      label: labels.get("giorniScadenza"),
      value: recall.quantity || "-"
    },
    {
      label: labels.get("targa"),
      value: vehicle.plate
    },
    {
      label: labels.get("telaio"),
      value: vehicle.frame
    },
    {
      label: labels.get("tipo"),
      value: vehicle.type
    },
    {
      label: labels.get("marca"),
      value: vehicle.make
    },
    {
      label: labels.get("modello"),
      value: vehicle.model
    },
    {
      label: labels.get("allestimento"),
      value: vehicle.preparation
    },
    {
      label: labels.get("km"),
      value: vehicle.km || "-"
    },
    {
      label: labels.get("dataPrimaImmatricolazione"),
      value: moment(vehicle.registrationDate).format(labels.get("gridColDates"))
    }
  ];
};

type Props = {
  recall: any,
  model: any,
  vehicle: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const WorkRecall = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService } = context;

  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={() => schema(props.vehicle)}
      labels={labels}
      category={ITEM_CATEGORY.richiamo}
      parent={props.vehicle}
      onConfirm={async closeData => {
        const result = await entityService.closeRecall(
          closeData,
          props.vehicle,
          props.recall
        );
        props.onConfirm(result);
      }}
      entity={props.model}
      header={props.header}
      children={frmProps => (
        <React.Fragment>
          <div className="p-col-12 mt-4">
            <h3>{labels.get("dati richiamo")}</h3>
            <View
              fields={getDataFields(
                props.vehicle,
                labels,
                props.model,
                props.recall
              )}
            />
          </div>

          <Fields.CalendarField
            onChange={frmProps.handleChange}
            id="endDate"
            label={labels.get("dataChiusuraRichiamo")}
            value={frmProps.values["endDate"]}
            errors={frmProps.errors}
          />

          <Fields.TextAreaField
            onChange={frmProps.handleChange}
            id="notes"
            label={labels.get("noteRichiamo")}
            value={frmProps.values["notes"]}
            errors={frmProps.errors}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="km"
            input={{ keyfilter: "pint" }}
            label={labels.get("richiamaTraKm")}
            icon="fas fa-tachometer-alt"
            value={frmProps.values.km}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="quantity"
            input={{ keyfilter: "pint" }}
            label={labels.get("richiamaTraMesi")}
            icon="far fa-clock"
            value={frmProps.values.quantity}
          />

          <Fields.TextAreaField
            onChange={frmProps.handleChange}
            id="description"
            label={labels.get("descrizioneProssimoRichiamo")}
            value={frmProps.values["description"]}
            errors={frmProps.errors}
          />
        </React.Fragment>
      )}
    />
  );
};

WorkRecall.defaultProps = {
  buttonSettings: {
    tooltip: "chiudi richiamo",
    icon: CATEGORY_ICON[ITEM_CATEGORY.richiamo]
  },
  header: "chiusura richiamo"
};

export default WorkRecall;
