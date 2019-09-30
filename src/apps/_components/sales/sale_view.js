// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { EntityView, S3Files } from "../../_components";
import { getGridDateTemplate } from "../../_components/utils";
import moment from "moment";
import { ITEM_CATEGORY } from "../../shared/const";

function getSaleFields(
  sell: any,
  parent: any,
  customer: any,
  labels: Localizer
): Array<{ label: string, value: any }> {
  return [
    {
      label: labels.get("cliente"),
      value: `${customer.name} ${customer.surname || ""}`
    },
    {
      label: labels.get("indirizzoCliente"),
      value: customer.address && customer.address.formatted_address
    },
    {
      label: labels.get("telefonoCliente"),
      value: customer.phone
    },
    {
      label: labels.get("mailCliente"),
      value: customer.mail || customer.pec
    },
    {
      label: labels.get("CfPiCliente"),
      value: customer.taxCode || customer.vatCode
    },
    {
      label: labels.get("targheAssociateVendita"),
      value: sell.plate
    },
    {
      label: labels.get("modelloDeviceQuantita"),
      value: `${sell.quantity} ${sell.model}`
    },
    {
      label: labels.get("effettuataDa"),
      value: `${parent.name} ${parent.surname || ""} ${parent.taxCode ||
        parent.vatCode} ${parent.address.formatted_address}`
    },
    {
      label: labels.get("carrier"),
      value: sell.createdBy
    },
    {
      label: labels.get("createdDate"),
      value: moment(sell.creationDate).format(labels.get("gridColDates"))
    }
  ];
}

type Props = {
  sell: any,
  parent: any,
  children: any,
  entityService: EntityService,
  labels: Localizer
};
export default function SalesView(props: Props) {
  const [loading, setLoading] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState();
  const [selectedVehicles, setSelectedVehicles] = React.useState([]);
  const collaudi = (props.children || []).filter(
    el => el.category === ITEM_CATEGORY.collaudo
  );

  async function onOpen(): any {
    const sell = props.sell;
    setLoading(true);
    const children = [sell.reference1].concat(sell.reference2);
    try {
      const result: any = await props.entityService.search({
        from: 0,
        size: children.length,
        type: "terms",
        field: "uuid",
        value: children
      });

      if (result.items && result.items.length) {
        const customer = result.items.find(el =>
          [
            ITEM_CATEGORY["cliente-privato"],
            ITEM_CATEGORY["cliente-azienda"]
          ].includes(el.category)
        );
        const vehicles = result.items.filter(
          el => el.category === ITEM_CATEGORY.veicolo
        );
        setSelectedCustomer(customer);
        setSelectedVehicles(vehicles);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <EntityView
      onOpen={onOpen}
      header={`${props.labels.get("Scheda vendita")} ${props.sell.uuid}`}
      tooltip={props.labels.get("Visualizza dettaglio")}
      style={{ marginLeft: "5px" }}
      fields={getSaleFields(
        props.sell,
        props.parent,
        selectedCustomer || {},
        props.labels
      )}
    >
      {() => (
        <div>
          <DataTable
            responsive
            loading={loading}
            value={selectedVehicles}
            header={props.labels.get(`Veicoli associati a questa vendita`)}
            paginator={false}
          >
            <Column
              field="plate"
              header={props.labels.get("targa")}
              style={{ maxWidth: "100px", wordWrap: "break-word" }}
              sortable
            />
            <Column
              field="km"
              header={props.labels.get("km")}
              style={{ maxWidth: "150px", wordWrap: "break-word" }}
              sortable
            />
            <Column
              field="type"
              header={props.labels.get("tipo")}
              style={{ maxWidth: "150px", wordWrap: "break-word" }}
              sortable
            />
            <Column
              field="frame"
              header={props.labels.get("numeroTelaio")}
              style={{ maxWidth: "150px", wordWrap: "break-word" }}
              sortable
            />
            <Column
              field="make"
              header={props.labels.get("marca")}
              sortable
              style={{ maxWidth: "150px", wordWrap: "break-word" }}
            />
            <Column
              field="model"
              header={props.labels.get("modello")}
              sortable
              style={{ maxWidth: "150px", wordWrap: "break-word" }}
            />
            <Column
              field="preparation"
              header={props.labels.get("allestimento")}
              sortable
              style={{ maxWidth: "150px", wordWrap: "break-word" }}
            />
          </DataTable>

          <DataTable
            responsive
            loading={loading}
            value={collaudi || []}
            header={props.labels.get(`Collaudi associati a questa vendita`)}
            paginator={false}
          >
            <Column field="uuid" header={props.labels.get("codice")} />
            <Column
              field="items"
              style={{ maxWidth: "150px", wordWrap: "break-word" }}
              header={props.labels.get("documenti")}
              body={item => {
                return (
                  <S3Files
                    docs={item.items.map(el => ({ key: el }))}
                    dockey={`${item.reference2}/${item.reference1}/`}
                  />
                );
              }}
            />
            <Column
              field="reference2"
              header={props.labels.get("imei")}
              sortable
            />
            <Column
              field="reference1"
              header={props.labels.get("targa")}
              sortable
            />
            <Column
              field="creationDate"
              header={props.labels.get("dataCollaudo")}
              body={getGridDateTemplate}
            />
            <Column
              field="createdBy"
              header={props.labels.get("creatoDa")}
              sortable
            />
          </DataTable>
        </div>
      )}
    </EntityView>
  );
}
