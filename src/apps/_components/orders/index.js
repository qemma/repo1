// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import {
  Editors,
  PiramisTable,
  CalendarTableColumnFilter,
  DropdownTableColumnFilter,
  HistoryTitle,
  Confirm
} from "../../_components";
import {
  getGridDateTemplate,
  createHistory,
  getentityDescription
} from "../../_components/utils";
import {
  ITEM_CATEGORY,
  ENTITY_STATUS,
  CATEGORY_ICON,
  ENTITY_STATUS_DOMAIN
} from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import CreateDelivery from "../create-delivery";
import { isEmpty } from "lodash";
import moment from "moment";
import OrdersView from "./view_orders";

export default function Orders(props: {
  query: Options,
  group?: string,
  parentId?: string,
  inNameOf?: "*" | Array<string>,
  canCreateDelivery?: boolean,
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

  async function onPutOrder(orderTosave) {
    const order = {
      ...orderTosave,
      code: orderTosave.code || orderTosave.uuid.replace(/-/g, "")
    };
    await entityService.put([order]);
    onLoadResults(options, "refresh");
  }

  async function onCreateDelivery(items) {
    await entityService.put(items);
    onLoadResults(options, "refresh");
  }

  async function markAsDelivered(
    order: any,
    children: Array<any>,
    parent: any
  ) {
    // todo ADD cONFIRM
    const updtOrder = {
      ...order,
      status: ENTITY_STATUS.delivered,
      deliveryDate: moment()
        .utc()
        .toISOString()
    };

    const sats = children
      .filter(el => el.category === ITEM_CATEGORY.device)
      .map(el => ({
        ...el,
        status: ENTITY_STATUS.delivered,
        hierarchyId: `${order.hierarchyId}*${el.uuid}`
      }));

    const history = sats.map(el =>
      createHistory(
        el,
        `consegnato con ordine ${order.code} presso ${order.name} indirizzo ${parent.address.formatted_address}`,
        ""
      )
    );

    const updtParent = {
      ...parent,
      left: (parent.left || 0) + Number(order.quantity)
    };
    const itemsToUpdate: any = [updtOrder]
      .concat(sats)
      .concat(history)
      .concat([updtParent]);
    await entityService.put(itemsToUpdate);
    onLoadResults(options, "refresh");
  }

  function canEditOrder(order: IEntity) {
    return (
      order.status === ENTITY_STATUS.inserted &&
      ((order.parentId === props.parentId && props.canEdit) ||
        order.createdBy === currentUsername)
    );
  }

  function getEditColumnTemplate(rowData, column) {
    const parent = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;
    const children = result.childrenBag[rowData.uuid] || [];

    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        <OrdersView order={rowData} labels={labels} devices={children} />
        {canEditOrder(rowData) && (
          <Editors.OrderEditor
            order={rowData}
            onConfirm={onPutOrder}
            buttonSettings={{
              icon: "fas fa-pencil-alt",
              style: { marginLeft: "5px" },
              tooltip: labels.get("modificaOrdine")
            }}
          />
        )}
        {props.canCreateDelivery && rowData.status === ENTITY_STATUS.inserted && (
          <CreateDelivery
            order={rowData}
            entity={parent}
            onCreateDelivery={onCreateDelivery}
            buttonSettings={{
              icon: CATEGORY_ICON[ITEM_CATEGORY.ordine],
              style: { marginLeft: "5px" },
              tooltip: labels.get("creaSpedizione")
            }}
          />
        )}

        {rowData.status === ENTITY_STATUS.inDelivery && (
          <Button
            icon="fas fa-check-square"
            disabled={loading}
            tooltip={labels.get("Metti in stato consegnato")}
            className="p-button-success"
            style={{ marginLeft: "5px" }}
            onClick={el => {
              Confirm(labels.get(`Sicuro di voler proseguire?`), labels).then(
                async () => {
                  //ok called
                  try {
                    hub.loading(true);
                    await markAsDelivered(rowData, children, parent);
                  } finally {
                    hub.loading(false);
                  }
                }
              );
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
    <Card title={HistoryTitle(labels.get("elencoOrdini"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerLeft: (
            <div>
              {!isEmpty(parent) && props.canAdd && (
                <Editors.OrderEditor
                  parent={parent}
                  order={{
                    reference1: getentityDescription(parent),
                    name: parent.name,
                    address: parent.address,
                    status: ENTITY_STATUS.inserted
                  }}
                  onConfirm={onPutOrder}
                  buttonSettings={{
                    style: { marginRight: "5px" },
                    icon: "fas fa-plus",
                    tooltip: labels.get("aggiungiOrdine")
                  }}
                />
              )}
              {props.inNameOf && (
                <Editors.OrderInNameOfEditor
                  order={{
                    status: ENTITY_STATUS.inserted
                  }}
                  inNameOf={props.inNameOf}
                  onConfirm={onPutOrder}
                  buttonSettings={{
                    style: { marginRight: "5px" },
                    icon: "fas fa-hands-helping",
                    tooltip: labels.get("Aggiungi ordine per conto di")
                  }}
                />
              )}
            </div>
          ),
          headerTitle: labels.get("elencoOrdini"),
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
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("richiestoDa")}
          body={data => data.name}
          filter
          sortable
          filterMatchMode="contains"
        />
        <Column
          field="createdBy"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("creatoDa")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="model"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("modelloDispositivo")}
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
          header={labels.get("dispositiviRichiesti")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="status"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("statoOrdine")}
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

        <Column field="actions" body={getEditColumnTemplate} />
      </PiramisTable>
    </Card>
  );
}
