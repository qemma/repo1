// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Editors, PiramisTable } from "../../_components";
import { ITEM_CATEGORY } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";

function UsersList() {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, usersService } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    { category: ITEM_CATEGORY.utente },
    context.entityService,
    context.hub
  );

  async function onCreateUser(user) {
    await usersService.create(user);
    onLoadResults(options, "refresh");
  }

  async function onUserAction(user: IEntity, action: string = "edituser") {
    await usersService.action(user, action);
    onLoadResults(options, "refresh");
  }

  function userActionsTemplate(rowData, column) {
    return (
      <div>
        <InputSwitch
          checked={(rowData.isActive && true) || false}
          tooltip={labels.get(
            `clicca per ${
              rowData.isActive ? "disattivare" : "attivare"
            } l'utente`
          )}
          disabled={loading}
          onChange={() =>
            onUserAction(rowData, rowData.isActive ? "disable" : "enable")
          }
        />
        {rowData.status === "CONFIRMED" && (
          <Button
            style={{ marginLeft: "5px" }}
            type="button"
            tooltip={labels.get("resetPassword")}
            disabled={loading}
            onClick={e => onUserAction(rowData, "resetpassword")}
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-lock"}
          />
        )}

        <Editors.UserEditor
          onConfirm={onUserAction}
          user={rowData}
          edit
          buttonSettings={{
            style: { marginLeft: "5px" },
            icon: "fas fa-pencil-alt",
            tooltip: labels.get("modifica utente")
          }}
        />
      </div>
    );
  }

  return (
    <Card title={labels.get("Utenti")}>
      <PiramisTable
        options={options.esoptions}
        table={{
          loading,
          headerLeft: (
            <Editors.UserEditor
              onConfirm={onCreateUser}
              buttonSettings={{
                style: { marginLeft: "5px" },
                icon: "fas fa-plus",
                tooltip: labels.get("aggiungi utente")
              }}
            />
          ),
          headerTitle: labels.get("elencoUtentiHeader"),
          rowClassName: rowData => {
            return {
              "p-user-warning-row": rowData.status !== "CONFIRMED"
            };
          }
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
          field="roles"
          header={labels.get("ruoli")}
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
          header={labels.get("cellulare")}
          sortable
          filter
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
        <Column
          field="actions"
          body={userActionsTemplate}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
      </PiramisTable>
    </Card>
  );
}

export default UsersList;
