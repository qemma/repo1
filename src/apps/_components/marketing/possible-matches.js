// @flow
import * as React from "react";
import { Button } from "primereact/button";
import ModalContainer from "../modals";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { PiramisContext } from "../../shared/piramis-context";

type Props = {
  style?: any,
  tooltip: string,
  criteria: any,
  hierarchyId: string,
  disabled?: boolean
};

export default function PossibleMatchingVehicles(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [opened: boolean, openModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [vehicles, setVehicles] = React.useState([]);
  const { labels, entityService } = context;

  async function openSelector() {
    setLoading(true);
    openModal(true);
    try {
      const vehicles = await entityService.getMatchingVehicles(
        props.criteria,
        props.hierarchyId
      );
      setVehicles(vehicles);
    } finally {
      setLoading(false);
    }
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
        <DataTable
          header={
            <div className="p-clearfix" style={{ lineHeight: "1.87em" }}>
              {labels.get("elenco veicoli")}
            </div>
          }
          value={vehicles}
          paginator={true}
          rowsPerPageOptions={[5, 10, 20]}
          rows={20}
          loading={loading}
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
        </DataTable>
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
