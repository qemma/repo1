// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { EntityView } from "../../_components";
// import { getGridDateTemplate } from '../../_components/utils';
import moment from "moment";

export function getViewOrderFields(
  order: any,
  labels: Localizer
): Array<{ label: string, value: any }> {
  return [
    {
      label: labels.get("intestatoA"),
      value: `${order.reference1} ${
        order.address ? order.address.formatted_address : ""
      }`
    },
    {
      label: labels.get("richiestoDa"),
      value: order.createdBy
    },
    {
      label: labels.get("descrizione"),
      value: `${order.description}`
    },
    {
      label: labels.get("dataConsegnaDesiderata"),
      value: moment(order.endDate).format(labels.get("gridColDates"))
    },
    {
      label: labels.get("createdDate"),
      value: moment(order.creationDate).format(labels.get("gridColDates"))
    },
    {
      label: labels.get("statoOrdine"),
      value: order.status
    },
    {
      label: labels.get("messoSpedizione"),
      value: order.putInDeliveryDate
        ? moment(order.putInDeliveryDate).format(labels.get("gridColDates"))
        : "-"
    },
    {
      label: labels.get("consegnatoIl"),
      value: order.deliveryDate
        ? moment(order.deliveryDate).format(labels.get("gridColDates"))
        : "-"
    },
    {
      label: labels.get("dataUltimoAggiornamento"),
      value: moment(order.updateDate).format(labels.get("gridColDates"))
    }
  ];
}

type Props = {
  order: any,
  labels: Localizer,
  devices: any
};
export default function OrdersView(props: Props) {
  return (
    <EntityView
      header={`${props.labels.get("schedaOrdine")} ${props.order.code}`}
      tooltip={props.labels.get("visualizzaDettaglioOrdine")}
      style={{ marginLeft: "5px" }}
      fields={getViewOrderFields(props.order, props.labels)}
    >
      {() =>
        props.devices ? (
          <DataTable
            responsive
            value={props.devices}
            header={props.labels.get(
              `${props.devices.length} dispositivi associati a questo ordine`
            )}
            paginator={false}
          >
            <Column field="imei" header={props.labels.get("imei")} sortable />
            <Column field="sn" header={props.labels.get("seriale")} sortable />
            <Column
              field="supplier"
              header={props.labels.get("fornitore")}
              sortable
            />
            <Column
              field="tel"
              header={props.labels.get("numero tel")}
              sortable
            />
            <Column
              field="type"
              header={props.labels.get("tipo dispositivo")}
              sortable
            />
            {/* <Column field="model" header={props.labels.get('modello')} sortable /> */}
            <Column
              field="status"
              header={props.labels.get("stato")}
              sortable
            />
          </DataTable>
        ) : null
      }
    </EntityView>
  );
}
