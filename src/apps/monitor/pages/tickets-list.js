// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  PiramisTable,
  HistoryTitle,
  HistoryButton,
  CalendarTableColumnFilter
} from "../../_components";
import { ITEM_CATEGORY, ENTITY_STATUS } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import JSONView from "../../_components/entity-view/json-view";
import { getGridDateTemplate } from "../../_components/utils";

export default function Tickets(props: any) {
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
      type: "match",
      field: "category",
      includeRelated: "reference1",
      includeParents: true,
      value: ITEM_CATEGORY.ticket
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
    const customer: any = result.related.find(
      m => m.itemId === rowData.reference1
    );
    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        {[ENTITY_STATUS.inserted, ENTITY_STATUS.active].includes(
          rowData.status
        ) && (
          <HistoryButton
            tooltip={labels.get("lavora ticket")}
            style={{ marginRight: "5px", marginTop: "2px" }}
            icon="fas fa-pencil-alt"
            url={`${encodeURIComponent(context.root)}/edit-ticket/${
              rowData.uuid
            }`}
            data={rowData}
          />
        )}
        <JSONView
          style={{ marginRight: "5px", marginTop: "2px" }}
          entity={customer}
          tooltip="visualizza dati proprietario"
        />
        <JSONView
          style={{ marginRight: "5px", marginTop: "2px" }}
          entity={viewCar(car)}
          tooltip="visualizza dati veicolo"
        />
      </div>
    );
  }

  return (
    <Card title={HistoryTitle(labels.get("Centrale Operativa"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerTitle: labels.get("elenco dei ticket")
        }}
        onLoadResults={onLoadResults}
        result={result}
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
          field="plate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("targa")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="imei"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("imei")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="name"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("nome")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="notes"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("descrizione")}
          sortable
          filter
        />

        <Column
          field="createdBy"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("creatoDa")}
          sortable
          filter
        />

        <Column
          field="creationDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("creato il")}
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
          field="endDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("chiuso il")}
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
          field="actions"
          body={getEditColumnTemplate}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
      </PiramisTable>
    </Card>
  );
}
