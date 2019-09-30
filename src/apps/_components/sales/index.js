// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  Editors,
  PiramisTable,
  CalendarTableColumnFilter,
  HistoryTitle,
  DropdownTableColumnFilter
} from "../../_components";
import {
  getGridDateTemplate,
  getentityDescription
} from "../../_components/utils";
import { ENTITY_STATUS, ENTITY_STATUS_DOMAIN } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import SaleView from "./sale_view";
import SalePapersView from "./sale_papers";
import { isEmpty } from "lodash";

export default function SalesList(props: {
  query: Options,
  group?: string,
  parentId?: string,
  canAdd: boolean,
  canEdit: boolean
}) {
  let dtable: any;
  const parentId: any = props.parentId;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub, domainData } = context;
  const currentUsername = context.user.username;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(props.query, entityService, hub);

  async function onPutSell(sell) {
    await entityService.put([sell]);
    onLoadResults(options, "refresh");
  }

  function canEditSell(sell: IEntity) {
    return (
      sell.status === ENTITY_STATUS.inserted &&
      ((sell.parentId === props.parentId && props.canEdit) ||
        sell.createdBy === currentUsername)
    );
  }

  function getEditColumnTemplate(rowData, column) {
    const parent = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;

    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        <SaleView
          sell={rowData}
          entityService={entityService}
          parent={parent}
          labels={labels}
          children={result.childrenBag[rowData.uuid]}
        />
        <SalePapersView
          sell={rowData}
          entityService={entityService}
          parent={parent}
          labels={labels}
          children={result.childrenBag[rowData.uuid]}
        />
        {canEditSell(rowData) && (
          <Editors.SalesEditor
            parent={parent}
            sell={rowData}
            onConfirm={onPutSell}
            buttonSettings={{
              style: { marginRight: "5px" },
              icon: "fas fa-pencil-alt",
              tooltip: labels.get("modifica vendita")
            }}
          />
        )}
      </div>
    );
  }

  const parent = result.parentsBag[parentId]
    ? result.parentsBag[parentId][0]
    : {};

  return (
    <Card title={HistoryTitle(labels.get("Elenco vendite"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerLeft: !isEmpty(parent) && props.canAdd && (
            <Editors.SalesEditor
              parent={parent}
              sell={{
                reference3: getentityDescription(parent),
                status: ENTITY_STATUS.inserted
              }}
              onConfirm={onPutSell}
              buttonSettings={{
                style: { marginRight: "5px" },
                icon: "fas fa-plus",
                tooltip: labels.get("crea vendita")
              }}
            />
          ),
          headerTitle: labels.get("Elenco vendite")
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column
          field="lookup"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("cliente")}
          body={sell => {
            if (!sell.description) return undefined;
            const data = sell.description.split("|");
            return `${data[0]} ${data[1]}`;
          }}
          filter
          filterMatchMode="contains"
        />
        {/* <Column
          field="items"
          header={labels.get('veicoli')}
          body={sell => sell.plate}
          filter
          filterMatchMode="contains"
        /> */}
        <Column
          field="createdBy"
          style={{ maxWidth: "200px", wordWrap: "break-word" }}
          header={labels.get("creatoDa")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="model"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dispositivo")}
          sortable
          filter
          filterElement={
            <DropdownTableColumnFilter
              field="model"
              options={domainData.devicesType}
              onChange={(e: any) => dtable.filter(e.value, e.field, "match")}
              value={
                options.esoptions.filters && options.esoptions.filters["model"]
                  ? options.esoptions.filters["model"].value
                  : ""
              }
            />
          }
        />
        <Column
          field="quantity"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={
            <div style={{ maxWidth: "100px", wordWrap: "break-word" }}>
              {labels.get("nrDispositivi")}
            </div>
          }
          headerStyle={{ maxWidth: "80px", wordWrap: "break-word" }}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="status"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("stato")}
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
          field="creationDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dataInserimento")}
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

        <Column
          field="actions"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          body={getEditColumnTemplate}
        />
      </PiramisTable>
    </Card>
  );
}
