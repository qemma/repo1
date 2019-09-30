// @flow
import * as React from "react";
import { Button } from "primereact/button";
import ModalContainer from "../modals";
import DropdownTableColumnFilter from "../table/dropdown-filter-control";
import { Column } from "primereact/column";
import { PiramisTable } from "../index";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import { isEqual } from "lodash";

type Props = {
  style?: any,
  tooltip: string,
  options: Options,
  disabled?: boolean
};

export default function MatchedVehicles(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [opened: boolean, openModal] = React.useState(false);
  const { labels, entityService, hub, domainData } = context;
  let dtable: any;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(props.options, entityService, hub);

  async function openSelector() {
    if (!isEqual(options.esoptions, props.options)) {
      await onLoadResults(props.options, "refresh");
    }
    openModal(true);
  }

  return (
    <React.Fragment>
      <ModalContainer
        onClose={() => openModal(false)}
        visible={opened}
        height="auto"
        header={labels.get(`veicoli inclusi nella campagna`)}
        width="90%"
      >
        <PiramisTable
          options={options.esoptions}
          table={{
            loading,
            headerTitle: labels.get("elenco veicoli'")
          }}
          onLoadResults={onLoadResults}
          result={result}
        >
          <Column
            field="plate"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("targa")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="name"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("dettaglioCliente")}
            sortable
            filter
            filterMatchMode="contains"
          />

          <Column
            field="km"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("km")}
            sortable
            filter
          />
          <Column
            field="type"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("tipo")}
            sortable
            filter
            filterElement={
              <DropdownTableColumnFilter
                field="type"
                options={domainData.vehicleTypes}
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
            field="supplier"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("alimentazione")}
            sortable
            filter
          />

          <Column
            field="make"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("marca")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="model"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("modello")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="preparation"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("allestimento")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="imei"
            header={labels.get("imei")}
            sortable
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            filter
            filterMatchMode="contains"
          />
          <Column
            field="frame"
            style={{ maxWidth: "100px", wordWrap: "break-word" }}
            header={labels.get("numeroTelaio")}
            sortable
            filter
            filterMatchMode="contains"
          />
        </PiramisTable>
      </ModalContainer>
      <Button
        style={props.style}
        disabled={props.disabled}
        tooltip={props.tooltip}
        className="p-button p-component p-button-secondary p-button-icon-only"
        icon="fas fa-equals"
        onClick={openSelector}
      />
    </React.Fragment>
  );
}
