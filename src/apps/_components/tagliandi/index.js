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

export default function Tagliandi(props: { group: string }) {
  const groupId = props.group;
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
      includeParents: true,
      field: "category",
      value: ITEM_CATEGORY.tagliando,
      filters: {
        group: { matchMode: "match", value: groupId }
      }
    },
    entityService,
    hub
  );

  async function onPutTagliando(tagl) {
    await entityService.put([tagl]);
    onLoadResults(options, "refresh");
  }

  function getEditColumnTemplate(rowData, column) {
    const parent = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;

    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        <Editors.TagliandiEditor
          parent={parent}
          entity={rowData}
          onConfirm={onPutTagliando}
          buttonSettings={{
            style: { marginRight: "5px" },
            icon: "fas fa-pencil-alt",
            tooltip: labels.get("modifica modello tagliando")
          }}
        />
      </div>
    );
  }

  return (
    <Card title={HistoryTitle(labels.get("Modelli tagliando"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerLeft: (
            <div>
              <Editors.TagliandiEditor
                parent={{ uuid: groupId, group: groupId }}
                onConfirm={onPutTagliando}
                buttonSettings={{
                  style: { marginRight: "5px" },
                  icon: "fas fa-plus",
                  tooltip: labels.get("aggiungiTagliando")
                }}
              />
            </div>
          ),
          headerTitle: labels.get("elencoModelliDealer")
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column
          field="km"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("limiteChilometri")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="quantity"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("limiteMesi")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="description"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("note")}
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
          field="preparation"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("allestimento")}
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
