// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  Editors,
  PiramisTable,
  HistoryButton,
  HistoryTitle
} from "../../_components";
import {
  ITEM_CATEGORY,
  PIRAMIS_ROLES,
  CATEGORY_ICON
} from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";

export default function AgentsList() {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      category: ITEM_CATEGORY.utente,
      filters: { roles: { matchType: "match", value: PIRAMIS_ROLES.agente } }
    },
    entityService,
    hub
  );

  async function onEditAgent(agent) {
    await entityService.put([agent]);
    onLoadResults(options, "refresh");
  }

  async function onPutAgent(agent) {
    await context.usersService.create(agent);
    onLoadResults(options, "refresh");
  }

  function actionsTemplate(rowData, column) {
    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        <Editors.UserEditor
          onConfirm={onEditAgent}
          user={rowData}
          disable={["roles", "entityId", "username"]}
          buttonSettings={{
            style: { marginRight: "5px" },
            icon: "fas fa-pencil-alt",
            tooltip: labels.get("modificaAgenteSelezionato")
          }}
        />

        <HistoryButton
          style={{ marginLeft: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaOrdini")}
          icon={CATEGORY_ICON[ITEM_CATEGORY.ordine]}
          url={`${context.root}/agentOrders/${encodeURIComponent(
            rowData.uuid
          )}`}
          data={rowData}
        />

        <HistoryButton
          style={{ marginLeft: "5px", marginTop: "2px" }}
          tooltip={labels.get("visualizzaDealersAssociati")}
          icon={CATEGORY_ICON[ITEM_CATEGORY.dealer]}
          url={`${context.root}/agentDealers/${encodeURIComponent(
            rowData.uuid
          )}`}
          data={rowData}
        />
      </div>
    );
  }

  return (
    <Card title={HistoryTitle(labels.get("elencoAgenti"))}>
      <PiramisTable
        options={options.esoptions}
        table={{
          loading,
          headerLeft: (
            <Editors.UserEditor
              onConfirm={onPutAgent}
              user={{
                roles: PIRAMIS_ROLES.agente
              }}
              disable={["roles", "entityId"]}
              buttonSettings={{
                icon: "fas fa-plus",
                tooltip: labels.get("aggiungiAgente")
              }}
            />
          ),
          headerTitle: labels.get("elencoAgenti")
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column
          field="username"
          header={labels.get("nomeUtente")}
          sortable
          filter
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
        <Column
          field="name"
          header={labels.get("nome")}
          sortable
          filter
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
        <Column
          field="surname"
          header={labels.get("cognome")}
          sortable
          filter
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
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
          body={data =>
            data.address ? data.address.formatted_address : labels.get("N/D")
          }
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
          field="actions"
          body={actionsTemplate}
          style={{
            maxWidth: "100px",
            wordWrap: "break-word",
            textAlign: "center"
          }}
        />
      </PiramisTable>
    </Card>
  );
}
