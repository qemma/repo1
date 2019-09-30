// @flow
import * as React from "react";
import { Button } from "primereact/button";
import ModalContainer from "../modals";
import { Column } from "primereact/column";
import { PiramisTable } from "../index";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import { isEqual } from "lodash";

type Props = {
  style?: any,
  tooltip: string,
  options: Options,
  disabled?: boolean,
  onSelect: (entity: IEntity) => void
};

export default function EntitySelector(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [opened: boolean, openModal] = React.useState(false);
  const { labels, entityService, hub } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(props.options, entityService, hub);

  function selectEntity({ value }) {
    props.onSelect(value);
    openModal(false);
  }

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
        header={labels.get(`Clicca sulla riga per selezionare`)}
        width="90%"
      >
        <PiramisTable
          options={options.esoptions}
          table={{
            loading,
            headerTitle: labels.get("elencoEntita'"),
            selectionMode: "single",
            onSelectionChange: selectEntity
          }}
          onLoadResults={onLoadResults}
          result={result}
        >
          <Column
            field="name"
            header={labels.get("nome")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="surname"
            header={labels.get("cognome")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="taxCode"
            header={labels.get("codiveFiscale")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="vatCode"
            header={labels.get("codiceFiscale")}
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column
            field="phone"
            header={labels.get("tel")}
            sortable
            filter
            style={{ width: "9em" }}
          />
          <Column
            field="address.formatted_address"
            header={labels.get("indirizzo")}
            body={data =>
              data.address ? data.address.formatted_address : labels.get("N/D")
            }
            sortable
            filter
            filterMatchMode="contains"
          />
          <Column field="pec" header={labels.get("pec")} sortable filter />
          <Column field="mail" header={labels.get("email")} sortable filter />
        </PiramisTable>
      </ModalContainer>
      <Button
        style={props.style}
        disabled={props.disabled}
        tooltip={props.tooltip}
        className="p-button p-component p-button-secondary p-button-icon-only"
        icon="fas fa-hand-pointer"
        onClick={openSelector}
      />
    </React.Fragment>
  );
}
