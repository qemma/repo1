// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { PiramisTable, DropdownTableColumnFilter, HistoryTitle } from "..";
import { ENTITY_STATUS, ENTITY_STATUS_DOMAIN } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import OrdersView from "../orders/view_orders";

export default function Storage(props: { query: Options, parentId: string }) {
  let dtable: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub, domainData } = context;

  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(props.query, entityService, hub);

  // async function onPutOrder(orderTosave) {
  //   const order = { ...orderTosave, code: orderTosave.code || orderTosave.uuid.replace(/-/g, '') };
  //   await entityService.put([order]);
  //   onLoadResults(options, 'refresh');
  // }

  function getEditColumnTemplate(rowData, column) {
    const parent = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;

    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        <OrdersView order={parent} labels={labels} devices={null} />
      </div>
    );
  }

  return (
    <Card title={HistoryTitle(labels.get("Magazzino dispositivi"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerLeft: <div>{labels.get("dispositiviEvidenziatiVerde")}</div>,
          headerTitle: labels.get("magazzinoDispositivi"),
          rowClassName: rowData => {
            return {
              "p-satsim-success-row": rowData.status === ENTITY_STATUS.delivered
            };
          }
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column
          field="lookup"
          header={labels.get("dealer")}
          body={data => data.name}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="type"
          header={labels.get("prodotto")}
          sortable
          filter
          filterMatchMode="match"
          filterElement={
            <DropdownTableColumnFilter
              field="type"
              options={domainData.devicesType}
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
          field="imei"
          header={labels.get("imei")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="sn"
          header={labels.get("serialNumber")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="tel"
          header={labels.get("tel")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="status"
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

        <Column field="actions" body={getEditColumnTemplate} />
      </PiramisTable>
    </Card>
  );
}
