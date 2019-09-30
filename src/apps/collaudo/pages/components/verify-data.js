// @flow
import * as React from "react";
import { Button } from "primereact/button";
import { Alert } from "../../../_components";
import { View } from "../../../_components/entity-view";
import { PiramisContext } from "../../../shared/piramis-context";
import moment from "moment";

export default function VehicleData(props: {
  vehicleData: any,
  deviceData: any,
  isValid: boolean,
  onProceed: Function
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels } = context;

  const getVeicoloFields = (vehicle: any) => {
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
        label: labels.get("data prima immatricolazione"),
        value: moment(vehicle.registrationDate).format(
          labels.get("gridColDates")
        )
      }
    ];
  };

  const getDeviceFields = (device: any, order: any) => {
    return [
      {
        label: labels.get("serialNumber"),
        value: device.sn
      },
      {
        label: labels.get("imei"),
        value: device.imei
      },
      {
        label: labels.get("telefono"),
        value: device.tel
      },
      {
        label: labels.get("iccid"),
        value: device.tel
      },
      {
        label: labels.get("modello"),
        value: device.model
      },

      {
        label: labels.get("concessionario"),
        value: order.reference1
      },
      {
        label: labels.get("consegnato il"),
        value: moment(order.deliveryDate).format(labels.get("gridColDates"))
      },
      {
        label: labels.get("con ordine"),
        value: order.code
      }
    ];
  };

  return (
    <div className="p-grid w-full">
      <div className="p-col-12">
        <h4>{labels.get("dati device")}</h4>
        <View
          fields={getDeviceFields(
            props.deviceData.device,
            props.deviceData.order
          )}
        />
      </div>
      <div className="p-col-12">
        <h4>{labels.get("dati veicolo")}</h4>
        <View fields={getVeicoloFields(props.vehicleData.vehicle)} />
      </div>
      {!props.isValid && (
        <div className="p-col-12 mt-4">
          <Alert
            color="red"
            title={labels.get("attenzione!")}
            content={
              <p>
                {labels.get(
                  "Il dispositivo e il veicolo selezionati appartengono a dealer diversi!! cambiare la selezione"
                )}
              </p>
            }
          />
        </div>
      )}
      {props.isValid && (
        <div className="p-col-12 mt-4">
          <Alert
            color="green"
            title={labels.get("Selezione completata!")}
            content={
              <div>
                <p>{labels.get("procedere con i vari test per il collaudo")}</p>
                <div>
                  <Button
                    className=" p-button"
                    type="button"
                    label={labels.get("procedi!")}
                    onClick={props.onProceed}
                  />
                </div>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
