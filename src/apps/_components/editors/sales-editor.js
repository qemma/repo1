// @flow
import * as React from "react";
import * as Yup from "yup";
import type { FormikProps } from "formik";
import {
  ITEM_CATEGORY,
  CATEGORY_ICON,
  ENTITY_STATUS
} from "../../shared/const";
import ModalEditor from "./modal-editor";
import { View } from "../entity-view";
import * as Fields from "./fields";
import { PiramisContext } from "../../shared/piramis-context";
import EntitySelector from "../entity-select";
import CompanyEditor from "./company-editor";
import PrivateEditor from "./private-editor";
import VehicleEditor from "./vehicle-editor";

// reference3 keeps parent track
// reference 1 customer
// reference2 vehiclesid
// plate: vehicle plates
// description: full customer description
// description customer full details
// items vehicles full details
const schema = Yup.object({
  reference1: Yup.string().required("selezionare il cliente"),
  reference2: Yup.array(Yup.string())
    .ensure()
    .required("selezionare il veicolo/i")
    .when(["quantity"], (quantity, schema) => {
      return quantity > 0
        ? schema
            .max(quantity, `selezionare ${quantity} veicoli`)
            .min(quantity, `selezionare ${quantity} veicoli`)
        : schema;
    }),
  model: Yup.string().required("tipo dispositivo e' obbligatorio"),
  quantity: Yup.number()
    .required("totale dispositivi e' obbligatorio")
    .positive("totale dispositivi e' obbligatorio"),
  registrationDate: Yup.string()
});

type Props = {
  sell?: any,
  parent: any,
  onConfirm: Function,
  header?: any,
  buttonSettings?: any,
  domainData: any
};

const getCustomerFields = (customer, labels) => {
  if (!customer) return [];
  return [
    {
      label: labels.get("nome"),
      value: customer.name
    },
    {
      label: labels.get("indirizzo"),
      value: customer.address.formatted_address
    },
    {
      label: labels.get("tel"),
      value: customer.phone
    },
    {
      label: labels.get("email"),
      value: customer.mail || customer.pec
    },
    {
      label: labels.get("codiceFiscaleIva"),
      value: customer.taxCode || customer.vatCode
    }
  ];
};

const SellEditor = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, domainData, hub } = context;
  const [loading, setLoading] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState();

  React.useEffect(() => {
    getCustomerVehicles(selectedCustomer);
  }, [selectedCustomer]);

  const [customerVehicles, setCustomerVehicles] = React.useState([]);

  async function onEditorOpen(): any {
    const sell = props.sell;
    if (sell && sell.reference1) {
      setLoading(true);
      hub.loading(true);
      try {
        const result: any = await await entityService.search({
          from: 0,
          size: 1,
          includeChildren: true,
          type: "match",
          field: "uuid",
          value: sell.reference1
        });

        if (result.items && result.items.length) {
          setSelectedCustomer(result.items[0]);
        }
      } finally {
        setLoading(false);
        hub.loading(false);
      }
    }
  }

  function getVehiclesDescription(vehicles: Array<any>) {
    const vehicleLU = vehicles.map(vehicle => {
      return `${vehicle.plate ? vehicle.plate.toLowerCase() : "noplate"}|${
        vehicle.frame ? vehicle.frame.toLowerCase() : "noframe"
      }|${vehicle.make ? vehicle.make.toLowerCase() : "nomake"}|${
        vehicle.model ? vehicle.model.toLowerCase() : ""
      }`;
    });
    return vehicleLU.join("*");
  }

  function getCustomerDescription(customer) {
    if (!customer) return "";
    return `${customer.name.toLowerCase()}|${(
      customer.taxCode || customer.vatCode
    ).toLowerCase()}|${(
      customer.mail || ""
    ).toLowerCase()}|${customer.address.formatted_address.toLowerCase()}|${customer.phone.toLowerCase()}`;
  }

  async function onPutCustomer(customer: IEntity, frmProps: FormikProps) {
    setLoading(true);
    const result: any = await entityService.put([customer]);
    setLoading(false);
    if (result.errors)
      throw new Error("impossibile aggiungere cliente, si prega di riprovare");
    onSelectCustomer(result.items[0], frmProps);
  }

  function selectedCarTemplate(value) {
    const vh = customerVehicles.find(el => el.uuid === value);
    if (vh)
      return (
        <span
          style={{
            backgroundColor: "#007ad9",
            color: "#fff",
            padding: "4px",
            margin: "2px",
            display: "inline-block",
            borderRadius: "10px"
          }}
        >
          {`${vh.plate} ${vh.make} ${vh.model || ""}`}
        </span>
      );

    return <span />;
  }

  async function onPutVehicle(vehicle, frmProps: FormikProps) {
    setLoading(true);

    await entityService.put([vehicle]);
    setLoading(false);

    setCustomerVehicles(customerVehicles.concat(vehicle));
    const selected = (frmProps.values["reference2"] || []).concat(vehicle.uuid);
    onSelectVehicles(selected, frmProps);
  }

  async function onSelectCustomer(customer: any, frmProps: FormikProps) {
    setSelectedCustomer(customer);
    frmProps.setFieldValue("reference1", customer.uuid); // customer uuid
    frmProps.setFieldValue("address", customer.address); // customer uuid
    frmProps.setFieldValue("reference2", undefined);
  }

  function onSelectVehicles(selected: Array<string>, frmProps: FormikProps) {
    frmProps.setFieldValue("reference2", selected);
  }

  async function getCustomerVehicles(customer) {
    if (!customer) return null;
    setLoading(true);
    try {
      const query = {
        body: {
          query: {
            bool: {
              filter: {
                bool: {
                  must: [
                    {
                      term: {
                        category: "veicolo"
                      }
                    },
                    { match: { "entity.group": customer.group } },
                    { match: { "entity.parentId": customer.uuid } }
                  ]
                }
              }
            }
          }
        }
      };
      const result: any = await entityService.esProxy(query);
      setCustomerVehicles(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function onConfirm(sell) {
    const selectedVehicles = customerVehicles.filter(el =>
      sell.reference2.includes(el.uuid)
    );
    const updtSell = {
      ...sell,
      description: getCustomerDescription(selectedCustomer),
      items: getVehiclesDescription(selectedVehicles),
      plate: selectedVehicles.map(el => el.plate).join(", ")
    };
    return await props.onConfirm(updtSell);
  }

  return (
    <ModalEditor
      labels={labels}
      buttonSettings={props.buttonSettings}
      schema={schema}
      parent={props.parent}
      onOpen={onEditorOpen}
      category={ITEM_CATEGORY.vendita}
      onConfirm={onConfirm}
      entity={props.sell}
      header={props.header}
      children={frmProps => {
        return (
          <React.Fragment>
            <Fields.SelectField
              onChange={frmProps.handleChange}
              id="model"
              label={labels.get("modelloDispositivo")}
              input={{
                options: domainData.devicesType
              }}
              icon="far fa-list-alt"
              value={frmProps.values["model"]}
              errors={frmProps.errors}
            />
            <Fields.InputField
              onChange={frmProps.handleChange}
              errors={frmProps.errors}
              id="quantity"
              input={{ keyfilter: "pint" }}
              label={labels.get("totaleDispositivi")}
              icon={CATEGORY_ICON[ITEM_CATEGORY.device]}
              value={frmProps.values.quantity}
            />

            <div className="p-col-12 mt-4">
              <label>{labels.get("selezionaCliente")}</label>
              <div className="p-inputgroup">
                <EntitySelector
                  options={{
                    type: "terms",
                    field: "category",
                    value: [
                      ITEM_CATEGORY["cliente-privato"],
                      ITEM_CATEGORY["cliente-azienda"]
                    ]
                  }}
                  style={{ marginRight: "5px" }}
                  tooltip={labels.get("selezionaClientePrivato")}
                  onSelect={async (customer): any => {
                    await onSelectCustomer(customer, frmProps);
                  }}
                />
                <PrivateEditor
                  parent={{
                    uuid: props.parent.group,
                    group: props.parent.group
                  }}
                  onConfirm={async (customer): any => {
                    await onPutCustomer(customer, frmProps);
                  }}
                  buttonSettings={{
                    style: { marginRight: "5px" },
                    icon: "fas fa-user",
                    tooltip: labels.get("aggiungiClientePrivato")
                  }}
                />

                <CompanyEditor
                  parent={{
                    uuid: props.parent.group,
                    group: props.parent.group
                  }}
                  onConfirm={async (customer): any => {
                    await onPutCustomer(customer, frmProps);
                  }}
                  buttonSettings={{
                    icon: "fas fa-building",
                    tooltip: labels.get("aggiungiClienteAzienda")
                  }}
                />
              </div>
            </div>
            <div className="p-col-12 mt-4">
              <View fields={getCustomerFields(selectedCustomer, labels)} />
            </div>

            <div className="p-col-12">
              <div className="p-grid">
                <div className="p-col-9">
                  <Fields.MultiSelectField
                    onChange={e => {
                      onSelectVehicles(e.target.value, frmProps);
                    }}
                    id="reference2"
                    input={{
                      options: customerVehicles.map((vh: any) => ({
                        ...vh,
                        label: `${vh.plate} ${vh.make} ${vh.model || ""}`,
                        value: vh.uuid
                      })),
                      required: true,
                      multi: true,
                      selectedItemTemplate: selectedCarTemplate,
                      disabled: loading
                    }}
                    label={labels.get("veicoli")}
                    icon={
                      loading ? "fas fa-circle-notch fa-spin" : "fas fa-car"
                    }
                    value={frmProps.values["reference2"]}
                    errors={frmProps.errors}
                  />
                </div>
                <div className="p-col-3 relative">
                  {selectedCustomer && (
                    <VehicleEditor
                      key={`${selectedCustomer.uuid}-${customerVehicles.length}`}
                      parent={selectedCustomer}
                      onConfirm={async vehicle =>
                        await onPutVehicle(vehicle, frmProps)
                      }
                      buttonSettings={{
                        style: {
                          marginRight: "5px",
                          position: "absolute",
                          bottom: "13px"
                        },
                        icon: "fas fa-plus",
                        tooltip: labels.get("aggiungiNuovoVeicolo")
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      }}
    />
  );
};

SellEditor.defaultProps = {
  sell: {
    status: ENTITY_STATUS.inserted
  },
  buttonSettings: {
    tooltip: "editor vendita",
    icon: CATEGORY_ICON[ITEM_CATEGORY.vendita]
  },
  header: "editor vendita"
};

export default SellEditor;
