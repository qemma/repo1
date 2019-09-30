// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  Editors,
  PiramisTable,
  HistoryTitle,
  CalendarTableColumnFilter
} from "../../_components";
import { ITEM_CATEGORY, ENTITY_STATUS } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import { S3Files } from "../../_components";
import { getGridDateTemplate } from "../../_components/utils";
import JSONView from "../entity-view/json-view";

export default function Richiami(props: { group: string }) {
  const groupId = props.group;
  let dtable: any;
  const [expandedRows: Array<any>, setExpandedRows] = React.useState();
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      type: "match",
      includeRelated: "reference1",
      includeParents: true,
      field: "category",
      value: ITEM_CATEGORY.richiamo,
      filters: {
        group: { matchMode: "match", value: groupId }
      }
    },
    entityService,
    hub
  );

  const viewCar = (car: any) => {
    return {
      targa: car.plate,
      telaio: car.frame,
      marca: car.make,
      modello: car.model,
      tipo: car.type,
      allestimento: car.preparation,
      alimentazione: car.supplier || " ",
      km: car.km,
      imei: car.imei,
      cliente: car.name
    };
  };

  function getEditColumnTemplate(rowData, column) {
    const car = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;
    const model: any =
      rowData.customTagl ||
      result.related.find(m => m.itemId === rowData.reference1);
    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        {rowData.status !== ENTITY_STATUS.closed && (
          <div>
            <Editors.RichiamoEditor
              model={model}
              vehicle={car}
              recall={rowData}
              onConfirm={() => onLoadResults(options, "refresh")}
              buttonSettings={{
                style: { marginRight: "5px" },
                icon: "fas fa-pencil-alt",
                tooltip: labels.get("customizzaRichiamo")
              }}
            />

            <Editors.WorkRichiamo
              model={model}
              vehicle={car}
              recall={rowData}
              onConfirm={() => onLoadResults(options, "refresh")}
              buttonSettings={{
                style: { marginRight: "5px" },
                icon: "fas fa-power-off",
                tooltip: labels.get("completaRichiamo")
              }}
            />
          </div>
        )}
        <JSONView entity={viewCar(car)} tooltip="visualizza macchina" />
      </div>
    );
  }

  async function onDocsUpdated(item, docs) {
    const updt = { ...item, items: docs.map(el => el.key) };
    await entityService.put([updt]);
    onLoadResults(options, "refresh");
  }

  function rowExpansionTemplate(item: any) {
    const model: any =
      item.customTagl || result.related.find(m => m.itemId === item.reference1);
    return (
      <div>
        <div>{`Tipo tagliando: ${model.description}`}</div>
        <div>{`Scadenza km: ${model.km || "-"}`}</div>
        <div>{`Scadenza temporale (mesi): ${model.quantity || "-"}`}</div>
      </div>
    );
  }

  return (
    <Card title={HistoryTitle(labels.get("Richiami"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerTitle: labels.get("Lista richiami pianificati"),
          expandedRows: expandedRows,
          onRowToggle: e => setExpandedRows(e.data),
          rowExpansionTemplate: rowExpansionTemplate
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column expander={true} style={{ width: "3em" }} />
        <Column
          field="status"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("stato")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="plate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("targa")}
          sortable
          filter
          filterMatchMode="contains"
        />
        {/* <Column
          field="frame"
          style={{ maxWidth: '100px', wordWrap: 'break-word' }}
          header={labels.get('telaio')}
          sortable
          filter
          filterMatchMode="contains"
        /> */}
        <Column
          field="name"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("cliente")}
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
          field="make"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("marca")}
          sortable
          filter
          filterMatchMode="contains"
        />
        {/* <Column
          field="model"
          style={{ maxWidth: '100px', wordWrap: 'break-word' }}
          header={labels.get('modello')}
          sortable
          filter
          filterMatchMode="contains"
        /> */}

        <Column
          field="creationDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dataRichiamo")}
          body={getGridDateTemplate}
          filterElement={
            <CalendarTableColumnFilter
              field="creationDate"
              onChange={(e: any) => dtable.filter(e.value, e.field, "range")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["creationDate"]
                  ? options.esoptions.filters["creationDate"].value
                  : ""
              }
            />
          }
          sortable
          filter
          filterMatchMode="match"
        />
        <Column
          field="startDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dataAppuntamento")}
          body={getGridDateTemplate}
          filterElement={
            <CalendarTableColumnFilter
              field="startDate"
              onChange={(e: any) => dtable.filter(e.value, e.field, "range")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["startDate"]
                  ? options.esoptions.filters["startDate"].value
                  : ""
              }
            />
          }
          sortable
          filter
          filterMatchMode="match"
        />
        <Column
          field="endDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dataChiusura")}
          body={getGridDateTemplate}
          filterElement={
            <CalendarTableColumnFilter
              field="endDate"
              onChange={(e: any) => dtable.filter(e.value, e.field, "range")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["endDate"]
                  ? options.esoptions.filters["endDate"].value
                  : ""
              }
            />
          }
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
        <Column
          field="items"
          header={labels.get("documenti")}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          body={item => {
            return (
              <S3Files
                docs={(item.items || []).map(el => ({ key: el }))}
                dockey={`${item.uuid}/${item.reference2}/${item.reference1}/`}
                onNewDoc={docs => onDocsUpdated(item, docs)}
              />
            );
          }}
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
