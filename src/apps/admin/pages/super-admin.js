// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { JsonEditor as Editor } from "jsoneditor-react";
import {
  PiramisTable,
  CalendarTableColumnFilter,
  Confirm
} from "../../_components";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import { getGridDateTemplate } from "../../_components/utils";

const SuperAdmin = () => {
  let dtable: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [showDetails, toggleShowDetails] = React.useState(false);
  const { labels, entityService, hub, fullReindex } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      type: "terms",
      field: "category",
      value: [
        "dealer",
        "ordine",
        "vendita",
        "cliente-privato",
        "cliente-azienda",
        "veicolo",
        "utente",
        "collaudo",
        "tagliando",
        "richiamo",
        "marketing"
      ]
    },
    entityService,
    hub
  );

  const deleteEntity = async rowData => {
    try {
      hub.loading(true);
      const result = await entityService.deleteEntity(rowData);
      console.log(result);
      onLoadResults(options, "refresh");
    } catch (error) {
      console.log(error);
    } finally {
      hub.loading(false);
    }
  };

  const getEditColumnTemplate = (rowData: any) => {
    return (
      <div key={rowData.uuid}>
        <Button
          className="p-button p-component p-button-secondary p-button-icon-only"
          icon="fas fa-eye"
          style={{ marginRight: "5px" }}
          onClick={() => {
            toggleShowDetails(rowData.uuid);
          }}
        />
        <Button
          icon="fas fa-trash-alt"
          className="p-button p-component p-button-rounded p-button-danger p-button-icon-only"
          onClick={() =>
            Confirm(labels.get(`Sicuro di voler proseguire?`), labels).then(
              async () => {
                //ok called
                deleteEntity(rowData);
              }
            )
          }
        />
        <Dialog
          header={labels.get("dettaglio dato")}
          visible={showDetails === rowData.uuid}
          onHide={e => toggleShowDetails(false)}
          modal={true}
          maximizable
          style={{ width: "50%" }}
        >
          <Editor
            mode="code"
            navigationBar={true}
            allowedModes={["view", "code"]}
            value={rowData}
          />
        </Dialog>
      </div>
    );
  };

  const reindexClick = async () => {
    try {
      hub.loading(true);
      if (fullReindex) {
        await fullReindex();
      }
    } catch (error) {
      console.error(error);
    } finally {
      hub.loading(false);
    }
  };

  return (
    <Card title={labels.get("Dati Piramis")}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerLeft: (
            <div>
              <Button
                label="full es reindex"
                className="p-button p-component p-button-rounded p-button-danger p-button-text-only"
                onClick={reindexClick}
              />
            </div>
          ),
          headerTitle: labels.get("elenco record")
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column
          field="category"
          header={labels.get("categoria")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="lookup"
          header={labels.get("descrizione")}
          filter
          sortable
          filterMatchMode="contains"
        />
        <Column
          field="createdBy"
          header={labels.get("creatoDa")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="status"
          header={labels.get("stato")}
          filter
          filterMatchMode="contains"
        />
        <Column
          field="creationDate"
          header={labels.get("data inserimento")}
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
          style={{ width: "6rem" }}
          field="actions"
          body={getEditColumnTemplate}
        />
      </PiramisTable>
    </Card>
  );
};

export default SuperAdmin;
