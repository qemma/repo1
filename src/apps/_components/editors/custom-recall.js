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
    km: Yup.number()
      .min(
        vehicle.km,
        `Non si possono inserire meno chilometri dei ${vehicle.km} quanti registrati dal veicolo`
      )
      .when("quantity", (quantity, schema) => {
        return quantity
          ? schema
          : schema.required(
              "Almeno uno tra scadenza chilometrica e scadenza temporale deve essere specificato"
            );
      }),
    quantity: Yup.number(),
    description: Yup.string().required()
  });

const getVeicoloFields = (vehicle, labels) => {
  return [
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
  recall?: any,
  model?: any,
  vehicle: any,
  header?: any,
  onConfirm: Function,
  buttonSettings?: any
};

const RichiamoEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService } = context;

  return (
    <ModalEditor
      buttonSettings={props.buttonSettings}
      schema={() => schema(props.vehicle)}
      labels={labels}
      category={ITEM_CATEGORY.richiamo}
      parent={props.vehicle}
      onConfirm={async model => {
        const result = await entityService.putRecall(
          model,
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
            <h3>{labels.get("datiVeicolo")}</h3>
            <View fields={getVeicoloFields(props.vehicle, labels)} />
          </div>
          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="km"
            input={{ keyfilter: "pint" }}
            label={labels.get("scadenzaKm")}
            icon="fas fa-tachometer-alt"
            value={frmProps.values.km}
          />

          <Fields.InputField
            onChange={frmProps.handleChange}
            errors={frmProps.errors}
            id="quantity"
            input={{ keyfilter: "pint" }}
            label={labels.get("scadenzaMesi")}
            icon="far fa-clock"
            value={frmProps.values.quantity}
          />

          <Fields.TextAreaField
            onChange={frmProps.handleChange}
            id="description"
            label={labels.get("noteRichiamo")}
            value={frmProps.values["description"]}
            errors={frmProps.errors}
          />

          <Fields.CalendarField
            onChange={frmProps.handleChange}
            id="startDate"
            input={{ defaultNull: true }}
            label={labels.get("dataAppuntamento")}
            value={frmProps.values["startDate"]}
            errors={frmProps.errors}
          />
        </React.Fragment>
      )}
    />
  );
};

RichiamoEditor.defaultProps = {
  buttonSettings: {
    tooltip: "personalizza/crea richiamo",
    icon: CATEGORY_ICON[ITEM_CATEGORY.richiamo]
  },
  header: "personalizza/crea richiamo"
};

export default RichiamoEditor;
