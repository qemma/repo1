// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import {
  Editors,
  PiramisTable,
  CalendarTableColumnFilter,
  DropdownTableColumnFilter,
  DeviceLabelList,
  EntityView
} from "../../_components";
import { getViewOrderFields } from "../../_components/orders/view_orders";
import { View } from "../../_components/entity-view";
import {
  ITEM_CATEGORY,
  ENTITY_STATUS,
  ENTITY_STATUS_DOMAIN
} from "../../shared/const";
import {
  getGridDateTemplate,
  createHistory,
  printLabels
} from "../../_components/utils";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import UnlinkSim from "./unlink-sim";
import { sortBy } from "lodash";
import moment from "moment";

export default function DevicesList() {
  const [expandedRows: Array<any>, setExpandedRows] = React.useState([]);
  let dtable: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub, domainData } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      category: ITEM_CATEGORY.device,
      includeChildren: true,
      includeParents: [true]
    },
    entityService,
    hub
  );

  async function onEditDevice(device) {
    await entityService.put([device]);
    onLoadResults(options, "refresh");
  }

  async function unlinkSatSim(device, sim, userNotes): any {
    const updtSim = {
      ...sim,
      status: ENTITY_STATUS.inserted,
      imei: undefined,
      parentId: sim.uuid
    };

    const history: any = createHistory(
      device,
      `rimossa associazione da sim ${sim.uuid} da pagina di stato dispositivo`,
      userNotes
    );
    const updtDevice = {
      ...device,
      status: ENTITY_STATUS.inserted,
      tel: undefined,
      iccid: undefined
    };

    await entityService.put([updtSim, updtDevice, history]);
    onLoadResults(options, "refresh");
  }

  function printLabel(id: string) {
    printLabels(id);
  }

  function rowExpansionTemplate(sat: IEntity) {
    const history = (result.childrenBag[sat.uuid] || []).filter(
      el => el.category === ITEM_CATEGORY.storico
    );
    const orderedHistory = sortBy(history, (o: any) => {
      return moment(o.creationDate);
    }).reverse();

    return (
      <DataTable
        value={orderedHistory}
        paginator={true}
        rowsPerPageOptions={[5, 10, 20]}
        rows={5}
      >
        <Column field="notes" header={labels.get("evento")} />
        <Column field="userNotes" header={labels.get("nomeUtente")} />
        <Column
          field="creationDate"
          body={getGridDateTemplate}
          header={labels.get("dataEvento")}
        />
        {/* <Column field="color" header="Color" /> TODO ADD HISTORY EDITOR*/}
      </DataTable>
    );
  }

  function getViewSimFields(
    sim: any,
    labels: Localizer,
    device: any
  ): Array<{ label: string, value: any }> {
    return [
      {
        label: labels.get("tel"),
        value: sim.tel
      },
      {
        label: labels.get("iccid"),
        value: sim.iccid
      },
      {
        label: labels.get("carrier"),
        value: sim.carrier
      },
      {
        label: labels.get("simType"),
        value: sim.simType
      },
      {
        label: labels.get("insertionDate"),
        value: moment(sim.insertionDate).format(labels.get("gridColDates"))
      },
      {
        label: labels.get("statoDispositivo"),
        value: device.status
      },
      {
        label: labels.get("targaAssociata"),
        value: device.plate || ""
      },
      {
        label: labels.get("km"),
        value: device.km || ""
      }
    ];
  }

  function editColumnTemplate(rowData: any) {
    const sim = (result.childrenBag[rowData.uuid] || []).find(
      el => el.category === ITEM_CATEGORY.sim
    );

    const order = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;

    return (
      <div>
        {rowData.status === ENTITY_STATUS.inserted && (
          <Editors.DeviceEditor
            onConfirm={onEditDevice}
            sat={rowData}
            header={labels.get("modificaDispositivoSelezionato")}
            buttonSettings={{
              icon: "fas fa-pencil-alt",
              tooltip: labels.get("modificaDispositivoSelezionato")
            }}
          />
        )}
        {rowData.status !== ENTITY_STATUS.inserted && (
          <EntityView
            header={labels.get("Dettaglio Sim associata")}
            tooltip={labels.get("Visualizza dettaglio")}
            fields={getViewSimFields(sim, labels, rowData)}
          >
            {() => (
              <div>
                {rowData.status === ENTITY_STATUS.readyForDelivery && (
                  <UnlinkSim
                    sim={sim}
                    sat={rowData}
                    labels={labels}
                    onUnlink={unlinkSatSim}
                  />
                )}
                {order && <View fields={getViewOrderFields(order, labels)} />}
                <DeviceLabelList
                  id={`device-${rowData.uuid}`}
                  items={[
                    {
                      sn: rowData.sn,
                      imei: rowData.imei,
                      phone: rowData.tel
                    }
                  ]}
                />
                <Button
                  label={labels.get("ristampaEtichetta")}
                  onClick={() => printLabel(`device-${rowData.uuid}`)}
                  icon="fas fa-print"
                />
              </div>
            )}
          </EntityView>
        )}
      </div>
    );
  }

  return (
    <Card title={labels.get("devices")}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerTitle: labels.get("elencoDispositivi"),
          expandedRows: expandedRows,
          onRowToggle: e => setExpandedRows(e.data),
          rowExpansionTemplate: rowExpansionTemplate
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column expander={true} style={{ width: "3em" }} />
        <Column
          field="imei"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("imei")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="sn"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("serialNumber")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="supplier"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("supplier")}
          sortable
          filter
          filterElement={
            <DropdownTableColumnFilter
              field="supplier"
              options={domainData.suppliers}
              onChange={(e: any) => dtable.filter(e.value, e.field, "match")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["supplier"]
                  ? options.esoptions.filters["supplier"].value
                  : ""
              }
            />
          }
          filterMatchMode="match"
        />
        <Column
          field="tel"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("tel")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="type"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("prodotto")}
          sortable
          filter
          filterMatchMode="match"
          filterElement={
            <DropdownTableColumnFilter
              field="type"
              options={domainData.devicesType}
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
          field="model"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("modello")}
          sortable
          filter
          filterMatchMode="contains"
        />
        <Column
          field="status"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("stato")}
          sortable
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
          field="notes"
          style={{ maxWidth: "150px", wordWrap: "break-word" }}
          header={labels.get("note")}
        />
        <Column
          field="insertionDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dataInserimento")}
          body={getGridDateTemplate}
          filterElement={
            <CalendarTableColumnFilter
              field="insertionDate"
              onChange={(e: any) => dtable.filter(e.value, e.field, "range")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["insertionDate"]
                  ? options.esoptions.filters["insertionDate"].value
                  : ""
              }
            />
          }
          sortable
          filter
          filterMatchMode="match"
        />
        <Column
          field="actions"
          body={editColumnTemplate}
          style={{ width: "4em" }}
        />
      </PiramisTable>
    </Card>
  );
}
