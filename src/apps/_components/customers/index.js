// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import {
  Editors,
  PiramisTable,
  HistoryTitle,
  DropdownTableColumnFilter
} from "../../_components";
import { ITEM_CATEGORY } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";

export default function CustomersList(props: {
  routingParams: { group: string },
  preventUpdateVehicle?: boolean
}) {
  const [expandedRows: Array<any>, setExpandedRows] = React.useState();
  const groupId = props.routingParams.group;
  let dtable: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      includeChildren: true,
      includeParents: [groupId],
      type: "terms",
      field: "category",
      value: [
        ITEM_CATEGORY["cliente-privato"],
        ITEM_CATEGORY["cliente-azienda"]
      ],
      filters: {
        group: { matchMode: "match", value: groupId }
      }
    },
    entityService,
    hub
  );

  async function onPutCustomer(customer) {
    await entityService.put([customer]);
    onLoadResults(options, "refresh");
  }

  async function onPutVehicle(vehicle) {
    await entityService.put([vehicle]);
    onLoadResults(options, "refresh");
  }

  function rowExpansionTemplate(customer: IEntity) {
    const vehicles = result.childrenBag[customer.uuid] || [];

    return (
      <div key={customer.uuid}>
        <DataTable
          header={
            <div className="p-clearfix" style={{ lineHeight: "1.87em" }}>
              {labels.get("elencoVeicoli")}{" "}
              {!props.preventUpdateVehicle && (
                <Editors.VehicleEditor
                  key={`${customer.uuid}-${vehicles.length}`}
                  parent={customer}
                  onConfirm={async vehicle => onPutVehicle(vehicle)}
                  buttonSettings={{
                    style: { float: "left" },
                    icon: "fas fa-plus",
                    tooltip: labels.get("aggiungiNuovoVeicolo")
                  }}
                />
              )}
            </div>
          }
          value={vehicles}
          paginator={true}
          rowsPerPageOptions={[5, 10, 20]}
          rows={5}
        >
          <Column
            field="plate"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("targa")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="type"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("tipo")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="frame"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("numeroTelaio")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="make"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("marca")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="model"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("modello")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            field="preparation"
            header={labels.get("allestimento")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            field="km"
            header={labels.get("km")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="actions"
            style={{
              maxWidth: "100px",
              wordWrap: "break-word",
              display: props.preventUpdateVehicle ? "none" : undefined
            }}
            body={vehicle =>
              !props.preventUpdateVehicle ? (
                <Editors.VehicleEditor
                  vehicle={vehicle}
                  parent={customer}
                  onConfirm={async vehicle => await onPutVehicle(vehicle)}
                  buttonSettings={{
                    icon: "fas fa-car",
                    tooltip: labels.get("modificaVeicolo")
                  }}
                />
              ) : null
            }
          />
        </DataTable>
      </div>
    );
  }

  function getEditColumnTemplate(rowData, column) {
    const parent =
      result.parentsBag[rowData.group] &&
      result.parentsBag[rowData.group].length
        ? result.parentsBag[rowData.group][0]
        : undefined;
    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        {rowData.category === ITEM_CATEGORY["cliente-privato"] ? (
          <Editors.PrivateEditor
            customer={rowData}
            parent={parent}
            onConfirm={onPutCustomer}
            buttonSettings={{
              style: { marginRight: "5px" },
              icon: "fas fa-user",
              tooltip: labels.get("modificaClienteSelezionato")
            }}
          />
        ) : (
          <Editors.CompanyEditor
            parent={parent}
            customer={rowData}
            onConfirm={onPutCustomer}
            buttonSettings={{
              style: { marginRight: "5px" },
              icon: "fas fa-building",
              tooltip: labels.get("modificaAzienda")
            }}
          />
        )}
        <Editors.VehicleEditor
          parent={rowData}
          onConfirm={vehicle => onPutVehicle(vehicle)}
          buttonSettings={{
            style: { marginRight: "5px" },
            icon: "fas fa-plus",
            tooltip: labels.get("aggiungiNuovoVeicolo")
          }}
        />
      </div>
    );
  }

  const parentForNew =
    result.parentsBag[groupId] && result.parentsBag[groupId].length
      ? result.parentsBag[groupId][0]
      : { uuid: groupId, group: groupId };
  return (
    <Card title={HistoryTitle(labels.get("elencoClienti"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerLeft: (
            <div>
              <Editors.PrivateEditor
                parent={parentForNew}
                onConfirm={onPutCustomer}
                buttonSettings={{
                  style: { marginRight: "5px" },
                  icon: "fas fa-user",
                  tooltip: labels.get("aggiungiClientePrivato")
                }}
              />
              <Editors.CompanyEditor
                parent={parentForNew}
                onConfirm={onPutCustomer}
                buttonSettings={{
                  icon: "fas fa-building",
                  tooltip: labels.get("aggiungiClienteAzienda")
                }}
              />
            </div>
          ),
          headerTitle: labels.get("elencoClienti"),
          expandedRows: expandedRows,
          onRowToggle: e => setExpandedRows(e.data),
          rowExpansionTemplate: rowExpansionTemplate
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column expander={true} style={{ width: "3em" }} />
        <Column
          field="category"
          style={{ maxWidth: "80px", wordWrap: "break-word" }}
          header={labels.get("tipo")}
          body={rowData => rowData.category.replace("cliente-", "")}
          sortable
          filter
          filterElement={
            <DropdownTableColumnFilter
              field="category"
              options={[
                {
                  value: ITEM_CATEGORY["cliente-azienda"],
                  label: labels.get("azienda")
                },
                {
                  value: ITEM_CATEGORY["cliente-privato"],
                  label: labels.get("privato")
                }
              ]}
              onChange={(e: any) => dtable.filter(e.value, e.field, "match")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["category"]
                  ? options.esoptions.filters["category"].value
                  : ""
              }
            />
          }
        />
        {/* <Column
          header={labels.get('targhe')}
          field="plate"
          sortable
          filter
          filterMatchMode="contains"
        /> */}
        <Column
          field="name"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("cliente")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="notes"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("note")}
          filter
          filterMatchMode="contains"
        />
        <Column
          field="taxCode"
          style={{ maxWidth: "120px", wordWrap: "break-word" }}
          header={labels.get("codiceFiscale")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="vatCode"
          style={{ maxWidth: "120px", wordWrap: "break-word" }}
          header={labels.get("partitaIva")}
          sortable
          filter
        />
        <Column
          field="phone"
          header={labels.get("tel")}
          sortable
          filter
          style={{ maxWidth: "9em", wordWrap: "break-word" }}
        />
        <Column
          field="address.formatted_address"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("indirizzo")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="mail"
          header={labels.get("email")}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          sortable
          filter
        />
        <Column
          field="actions"
          body={getEditColumnTemplate}
          style={{ maxWidth: "80px", wordWrap: "break-word" }}
        />
      </PiramisTable>
    </Card>
  );
}
