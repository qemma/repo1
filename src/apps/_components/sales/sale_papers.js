// @flow
import * as React from "react";
import EntityView, { View } from "../../_components/entity-view";
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
      label: labels.get("modelloDevice"),
      value: sell.model
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
  sell: any,
  parent: any,
  children: any,
  entityService: EntityService,
  labels: Localizer
};
export default function SalesPapersView(props: Props) {
  const [loading, setLoading] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState();
  const [selectedVehicles, setSelectedVehicles] = React.useState([]);
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
      tooltip={props.labels.get("Visualizza scheda per veicolo")}
      style={{ marginLeft: "5px" }}
      icon="fas fa-newspaper"
      fields={[]}
    >
      {() =>
        loading ? (
          <div className="text-center">
            <i
              className="fas fa-circle-notch fa-spin text-grey-light"
              style={{ fontSize: "20em" }}
            />
          </div>
        ) : (
          <div>
            {selectedVehicles.map(vehicle => (
              <div key={vehicle.uuid} style={{ pageBreakAfter: "always" }}>
                <h4>
                  {props.labels.get("Scheda veicolo")} {vehicle.uuid}
                </h4>
                <View
                  fields={getSaleFields(
                    props.sell,
                    props.parent,
                    selectedCustomer,
                    props.labels
                  )}
                />
                <View fields={getVeicoloFields(vehicle, props.labels)} />
              </div>
            ))}
          </div>
        )
      }
    </EntityView>
  );
}
