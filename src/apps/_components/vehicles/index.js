// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  Editors,
  PiramisTable,
  HistoryTitle,
  DropdownTableColumnFilter
} from "../../_components";
import { ITEM_CATEGORY } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import { DataTable } from "primereact/datatable";
import { getGridDateTemplate } from "../../_components/utils";

export default function Vehicles(props: { routingParams: { group: string } }) {
  const [expandedRows: Array<any>, setExpandedRows] = React.useState();
  const groupId = props.routingParams.group;
  let dtable: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub, domainData } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      type: "match",
      field: "category",
      includeChildren: true,
      includeParents: true,
      value: ITEM_CATEGORY.veicolo,
      filters: {
        group: { matchMode: "match", value: groupId }
      }
    },
    entityService,
    hub
  );

  async function onPutVeichle(veic) {
    await entityService.put([veic]);
    onLoadResults(options, "refresh");
  }

  function getEditColumnTemplate(rowData, column) {
    const parent = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;

    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        <Editors.VehicleEditor
          parent={parent}
          vehicle={rowData}
          onConfirm={onPutVeichle}
          buttonSettings={{
            style: { marginRight: "5px" },
            icon: "fas fa-pencil-alt",
            tooltip: labels.get("modificaVeicolo")
          }}
        />
      </div>
    );
  }

  function rowExpansionTemplate(item: any) {
    const recalls = result.childrenBag[item.uuid] || [];
    return (
      <div key={item.uuid}>
        <DataTable
          header={
            <div className="p-clearfix" style={{ lineHeight: "1.87em" }}>
              {labels.get("elencoRichiami")}
              <Editors.RichiamoEditor
                vehicle={item}
                onConfirm={() => onLoadResults(options, "refresh")}
                buttonSettings={{
                  style: { marginRight: "5px", float: "left" },
                  icon: "fas fa-plus",
                  tooltip: labels.get("creaRichiamo")
                }}
              />
            </div>
          }
          value={recalls}
          paginator={true}
          rowsPerPageOptions={[5, 10, 20]}
          rows={5}
        >
          <Column
            field="status"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("stato")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="description"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("descrizione")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="km"
            style={{ maxWidth: "50px", wordWrap: "break-word" }}
            header={labels.get("scadenzaKm")}
            sortable
            filter
            filterMatchMode="contains"
          />

          <Column
            field="quantity"
            style={{ maxWidth: "50px", wordWrap: "break-word" }}
            header={labels.get("giorniScadenza")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="creationDate"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("dataRichiamo")}
            body={getGridDateTemplate}
            sortable
            filter
            filterMatchMode="match"
          />
          <Column
            field="endDate"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("dataChiusura")}
            body={getGridDateTemplate}
            sortable
            filter
            filterMatchMode="match"
          />
          <Column
            field="notes"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("noteChiusura")}
            sortable
            filter
            filterMatchMode="contains"
          />
        </DataTable>
      </div>
    );
  }

  return (
    <Card title={HistoryTitle(labels.get("elencoVeicoli"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerTitle: labels.get("elencoVeicoliXDealer"),
          expandedRows: expandedRows,
          onRowToggle: e => setExpandedRows(e.data),
          rowExpansionTemplate: rowExpansionTemplate
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column expander={true} style={{ width: "3em" }} />
        <Column
          field="plate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("targa")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="name"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dettaglioCliente")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="km"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("km")}
          sortable
          filter
        />
        <Column
          field="type"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("tipo")}
          sortable
          filter
          filterElement={
            <DropdownTableColumnFilter
              field="type"
              options={domainData.vehicleTypes}
              onChange={(e: any) => dtable.filter(e.value, e.field, "match")}
              value={
                options.esoptions.filters && options.esoptions.filters["type"]
                  ? options.esoptions.filters["type"].value
                  : ""
              }
            />
          }
        />

        <Column
          field="supplier"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("alimentazione")}
          sortable
          filter
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
          field="preparation"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("allestimento")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="imei"
          header={labels.get("imei")}
          sortable
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
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
          field="actions"
          body={getEditColumnTemplate}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
      </PiramisTable>
    </Card>
  );
}
