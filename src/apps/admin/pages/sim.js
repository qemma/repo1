// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  Editors,
  PiramisTable,
  CalendarTableColumnFilter,
  DropdownTableColumnFilter
} from "../../_components";
import { getGridDateTemplate } from "../../_components/utils";
import {
  ITEM_CATEGORY,
  ENTITY_STATUS,
  ENTITY_STATUS_DOMAIN
} from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";

export default function SimCardsList() {
  let dtable: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub, domainData } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList({ category: ITEM_CATEGORY.sim }, entityService, hub);

  async function onEditSim(sim: IEntity) {
    await entityService.put([sim]);
    onLoadResults(options, "refresh");
  }

  function editTemplate(rowData: IEntity) {
    if (rowData.status !== ENTITY_STATUS.inserted) return null;
    return (
      <Editors.SimEditor
        onConfirm={onEditSim}
        sim={rowData}
        header={labels.get("modificaSimSelezionata")}
        buttonSettings={{
          icon: "fas fa-pencil-alt",
          tooltip: labels.get("modificaSimSelezionata")
        }}
      />
    );
  }

  return (
    <Card title={labels.get("simCards")}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerTitle: labels.get("elenco sim")
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column
          field="tel"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("numero")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="iccid"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("iccid")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="imei"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("device")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="simType"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("simType")}
          sortable
          filter
          filterElement={
            <DropdownTableColumnFilter
              field="simType"
              options={domainData.simTypes}
              onChange={(e: any) => dtable.filter(e.value, e.field, "match")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["simType"]
                  ? options.esoptions.filters["simType"].value
                  : ""
              }
            />
          }
          filterMatchMode="match"
        />
        <Column
          field="carrier"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("carrier")}
          sortable
          filter
          filterElement={
            <DropdownTableColumnFilter
              field="carrier"
              options={domainData.carriers}
              onChange={(e: any) => dtable.filter(e.value, e.field, "match")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["carrier"]
                  ? options.esoptions.filters["carrier"].value
                  : ""
              }
            />
          }
          filterMatchMode="match"
        />
        <Column
          field="status"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("stato")}
          sortable
          filter
          filterElement={
            <DropdownTableColumnFilter
              field="status"
              options={ENTITY_STATUS_DOMAIN}
              onChange={(e: any) => dtable.filter(e.value, e.field, "match")}
              value={
                options.esoptions.filters && options.esoptions.filters["status"]
                  ? options.esoptions.filters["status"].value
                  : ""
              }
            />
          }
        />
        <Column
          field="insertionDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("data inserimento")}
          body={getGridDateTemplate}
          filterElement={
            <CalendarTableColumnFilter
              field="insertionDate"
              onChange={(e: any) => dtable.filter(e.value, e.field, "range")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["insertionDate"]
                  ? options.esoptions.filters["insertionDate"].value
                  : ""
              }
            />
          }
          sortable
          filter
          filterMatchMode="match"
        />
        <Column field="actions" body={editTemplate} style={{ width: "4em" }} />
      </PiramisTable>
    </Card>
  );
}
