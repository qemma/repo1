// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { getGridDateTemplate } from "../../_components/utils";
import {
  PiramisTable,
  CalendarTableColumnFilter,
  HistoryTitle,
  S3Files
} from "../../_components";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import JSONView from "../entity-view/json-view";

export default function CollaudoList(props: {
  query: Options,
  personal?: boolean
}) {
  let dtable: any;

  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(props.query, entityService, hub);

  async function onDocsUpdated(item, docs) {
    const updt = { ...item, items: docs.map(el => el.key) };
    await entityService.put([updt]);
    onLoadResults(options, "refresh");
  }

  const viewCar = car => {
    return {
      targa: car.plate,
      telaio: car.frame,
      marca: car.make,
      modello: car.model,
      tipo: car.type,
      allestimento: car.preparation,
      alimentazione: car.supplier || " ",
      km: car.km
    };
  };

  const getColumns = () => {
    let columns = [
      <Column
        key={1}
        field="uuid"
        style={{ maxWidth: "100px", wordWrap: "break-word" }}
        header={labels.get("codice")}
        filter
        filterMatchMode="contains"
      />,
      <Column
        key={2}
        field="items"
        style={{ maxWidth: "100px", wordWrap: "break-word" }}
        header={labels.get("documenti")}
        body={item => {
          return (
            <S3Files
              docs={item.items.map(el => ({ key: el }))}
              dockey={`${item.reference2}/${item.reference1}/`}
              onNewDoc={docs => onDocsUpdated(item, docs)}
            />
          );
        }}
      />,
      <Column
        key={3}
        field="reference2"
        style={{ maxWidth: "100px", wordWrap: "break-word" }}
        header={labels.get("imei")}
        sortable
        filter
        filterMatchMode="contains"
      />,
      <Column
        key={4}
        style={{ maxWidth: "100px", wordWrap: "break-word" }}
        header={labels.get("targa")}
        body={el => {
          const car: any = result.related.find(car => car.itemId === el.carId);
          return car ? (
            <div>
              <span>{car.plate}</span>{" "}
              <JSONView entity={viewCar(car)} tooltip="visualizza macchina" />
            </div>
          ) : (
            " - "
          );
        }}
      />,

      <Column
        key={5}
        field="creationDate"
        style={{ maxWidth: "100px", wordWrap: "break-word" }}
        header={labels.get("dataCollaudo")}
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
      />
    ];

    if (!props.personal) {
      columns = columns.concat(
        <Column
          key={7}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          field="createdBy"
          header={labels.get("creatoDa")}
          sortable
          filter
          filterMatchMode="contains"
        />
      );
    }

    return columns;
  };
  return (
    <Card title={HistoryTitle(labels.get("elencoCollaudi"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerTitle: labels.get("elencoCollaudi")
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        {getColumns()}
      </PiramisTable>
    </Card>
  );
}
