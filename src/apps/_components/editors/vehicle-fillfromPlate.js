// @flow
import * as React from "react";
import { Button } from "primereact/button";
import ModalContainer from "../modals";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { PiramisContext } from "../../shared/piramis-context";

type Props = {
  plate: string,
  style?: any,
  tooltip: string,
  disabled?: boolean,
  plateData?: any,
  onSelect: (entity: any) => void
};

const VehicleDataFromPlate = (props: Props) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [opened: boolean, openModal] = React.useState(false);
  const [loading: boolean, setLoading] = React.useState(false);
  const { labels, gisApi } = context;
  const [selection, setSelection] = React.useState();
  const [plateData, setPlateData] = React.useState(props.plateData);

  async function loadPlateData() {
    setLoading(true);
    try {
      if (!plateData) {
        const data = await gisApi.getFromPlate(props.plate);
        setPlateData(data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function selectCarAnag(e) {
    setSelection(e.value);
    setLoading(true);
    try {
      const carInfos = await gisApi.getPlateAnagrafica(e.value.CodiceInfocarAM);
      props.onSelect({
        ...plateData,
        ...carInfos
      });
      openModal(false);
    } finally {
      setLoading(false);
    }
  }

  async function openSelector() {
    openModal(true);
    await loadPlateData();
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
        <div>
          <DataTable
            value={plateData ? plateData.Lista : []}
            loading={loading}
            selectionMode="single"
            selection={selection}
            onSelectionChange={selectCarAnag}
          >
            <Column
              field="DescrizioneCompleta"
              header={`${labels.get("Seleziona allestimento per targa")} ${
                props.plate
              }`}
            />
          </DataTable>
        </div>
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
};

export default VehicleDataFromPlate;
