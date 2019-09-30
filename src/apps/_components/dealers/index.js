// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  Editors,
  PiramisTreeTable,
  HistoryButton,
  HistoryTitle
} from "../../_components";
import {
  ITEM_CATEGORY,
  CATEGORY_ICON,
  PIRAMIS_ROLES
} from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import generateTree from "../../shared/entities-tree";

export default function DealersList(props: {
  options?: Options,
  canEdit: boolean
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      ...(props.options || {}),
      category: ITEM_CATEGORY.dealer,
      includeHierarchy: true
    },
    entityService,
    hub
  );

  const entities = result.items.concat(result.groups);

  async function onPutDealer(dealer) {
    await entityService.put([dealer]);
    onLoadResults(options, "refresh");
  }

  async function onEditSeller(user: IEntity) {
    await context.usersService.action(user, "edituser");
    onLoadResults(options, "refresh");
  }

  async function onAddSeller(user: IEntity) {
    await context.usersService.create(user);
    onLoadResults(options, "refresh");
  }

  function actionsTemplate(rowData) {
    switch (rowData.category) {
      case ITEM_CATEGORY.dealer:
        return dealerActionsTemplate(rowData);
      case ITEM_CATEGORY.utente:
        return venditoreActionsTemplate(rowData);
      default:
        return null;
    }
  }

  function dealerActionsTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        {props.canEdit && (
          <React.Fragment>
            <Editors.DealerEditor
              dealer={rowData}
              onConfirm={onPutDealer}
              buttonSettings={{
                style: { marginRight: "5px", marginTop: "2px" },
                icon: "fas fa-pencil-alt",
                tooltip: labels.get("modificaDealer")
              }}
            />

            <Editors.DealerEditor
              parent={rowData}
              header={labels.get("aggiungiFiliale")}
              onConfirm={onPutDealer}
              buttonSettings={{
                style: { marginRight: "5px", marginTop: "2px" },
                icon: CATEGORY_ICON["filiale"],
                tooltip: labels.get("aggiungiFiliale")
              }}
            />
            <Editors.UserEditor
              onConfirm={onAddSeller}
              user={{
                parentId: rowData.uuid,
                group: rowData.group,
                entityId: rowData.uuid,
                roles: PIRAMIS_ROLES.venditore
              }}
              parent={rowData}
              disable={["roles", "entityId"]}
              buttonSettings={{
                style: { marginRight: "5px", marginTop: "2px" },
                icon: CATEGORY_ICON[PIRAMIS_ROLES.venditore],
                tooltip: labels.get("aggiungiVenditore")
              }}
            />
          </React.Fragment>
        )}

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaClienti")}
          icon="fas fa-users"
          url={`${context.root}/customers/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaVeicoli")}
          icon="fas fa-car"
          url={`${context.root}/vehicles/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaOrdiniGruppo")}
          icon="fas fa-truck"
          url={`${context.root}/grouporders/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaModelliTagliando")}
          icon="fas fa-wrench"
          url={`${context.root}/tagliandi/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaRichiami")}
          icon="fas fa-tools"
          url={`${context.root}/richiami/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaVenditeGruppo")}
          icon="fas fa-dollar-sign"
          url={`${context.root}/groupsales/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("dettaglioGerarchia")}
          icon="fas fa-sitemap"
          url={`${context.root}/group/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaMagazzino")}
          icon="fas fa-warehouse"
          url={`${context.root}/entitystorage/${rowData.uuid}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaMarketing")}
          icon="fas fa-mail-bulk"
          url={`${context.root}/marketing/${rowData.uuid}`}
          data={rowData}
        />
      </div>
    );
  }

  function venditoreActionsTemplate(rowData) {
    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        {props.canEdit && (
          <Editors.UserEditor
            onConfirm={onEditSeller}
            user={rowData}
            disable={["roles", "entityId", "username"]}
            buttonSettings={{
              style: { marginRight: "5px", marginTop: "2px" },
              icon: "fas fa-pencil-alt",
              tooltip: labels.get("modificaVenditore")
            }}
          />
        )}
        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaVenditeXVend")}
          icon="fas fa-dollar-sign"
          url={`${context.root}/entitysales/${
            rowData.group
          }/${encodeURIComponent(rowData.uuid)}`}
          data={rowData}
        />
      </div>
    );
  }

  const tree = generateTree(entities);
  return (
    <Card title={HistoryTitle(labels.get("elencoDealers"))}>
      <PiramisTreeTable
        options={options.esoptions}
        table={{
          loading,
          headerLeft: props.canEdit ? (
            <Editors.DealerEditor
              onConfirm={onPutDealer}
              buttonSettings={{
                icon: "fas fa-plus",
                tooltip: labels.get("aggiungiNuovoDealer")
              }}
            />
          ) : null,
          headerTitle: labels.get("elencoDealers"),
          rowClassName: rowData => {
            return {
              "dealer-row":
                rowData.category === ITEM_CATEGORY.dealer &&
                rowData.group === rowData.parentId,
              "filiale-row":
                rowData.category === ITEM_CATEGORY.dealer &&
                rowData.group !== rowData.parentId,
              "seller-row": rowData.category === ITEM_CATEGORY.utente
            };
          }
        }}
        onLoadResults={onLoadResults}
        result={result}
        tree={tree}
      >
        <Column
          expander
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          field="category"
          header={labels.get("tipo")}
          body={data => (
            <span>
              <i
                style={{ marginRight: "2px" }}
                className={
                  data.category === ITEM_CATEGORY.utente
                    ? CATEGORY_ICON["venditore"]
                    : CATEGORY_ICON[data.category]
                }
              />
              {data.category === ITEM_CATEGORY.utente
                ? labels.get("venditore")
                : labels.get(data.category)}
            </span>
          )}
        />
        <Column
          field="name"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("denominazione")}
          sortable
          body={data => `${data.name}${data.surname ? ` ${data.surname}` : ""}`}
          filter
          filterMatchMode="contains"
        />
        <Column
          field="phone"
          header={labels.get("tel")}
          sortable
          filter
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
        <Column
          field="address.formatted_address"
          header={labels.get("indirizzo")}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="pec"
          header={labels.get("pec")}
          sortable
          filter
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
        <Column
          field="mail"
          header={labels.get("email")}
          sortable
          filter
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
        <Column
          field="reference2"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("agenteRiferimento")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="actions"
          body={actionsTemplate}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
      </PiramisTreeTable>
    </Card>
  );
}
