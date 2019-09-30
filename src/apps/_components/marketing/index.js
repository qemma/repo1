// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import {
  Editors,
  PiramisTable,
  HistoryTitle,
  CalendarTableColumnFilter
} from "../../_components";
import { ITEM_CATEGORY, ENTITY_STATUS } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import useEntitiesList from "../../shared/entities-hook";
import JSONView from "../entity-view/json-view";

import { getGridDateTemplate } from "../../_components/utils";
import { isEmpty } from "lodash";
import moment from "moment";
import MatchedVehicles from "./matched-vehicles";
import PossibleMatchingVehicles from "./possible-matches";

export default function MarketingList(props: { group: string }) {
  const groupId = props.group;

  let dtable: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [
    result: Result,
    options: Options,
    loading: boolean,
    onLoadResults: (newOptions: Options, action: GridAction) => void
  ] = useEntitiesList(
    {
      type: "match",
      field: "category",
      includeChildren: true,
      includeParents: [context.user.parentId],
      value: ITEM_CATEGORY.marketing,
      filters: {
        group: { matchMode: "match", value: groupId }
      }
    },
    entityService,
    hub
  );

  const viewCriteria = (c: any) => {
    return {
      "tipo cliente": c.customerType,
      imei: c.imeiCondition
        ? c.imeiCondition === "all"
          ? "qualsiasi"
          : c.imeiCondition === "imai"
          ? "imei presente"
          : "imai non presente"
        : undefined,
      "km da": c.kmFrom,
      "km a": c.kmTo,
      regioni: c.regions,
      province: c.provinces,
      alimentazione: c.supplier,
      "tipo veicolo": c.type,
      marca: c.make,
      modello: c.model,
      allestimento: c.preparation,
      "immatricolato da": c.registrationDateFrom
        ? moment(c.registrationDateFrom).format("DD/MM/YYYY")
        : undefined,
      "immatricolato a": c.registrationDateTo
        ? moment(c.registrationDateTo).format("DD/MM/YYYY")
        : undefined
    };
  };

  async function onPutCampaign(camp) {
    await entityService.put([camp]);
    onLoadResults(options, "refresh");
  }

  function getEditColumnTemplate(rowData, column) {
    const parent: any = result.parentsBag[rowData.parentId]
      ? result.parentsBag[rowData.parentId][0]
      : null;

    return (
      <div style={{ textAlign: "center" }} key={rowData.uuid}>
        {rowData.status === ENTITY_STATUS.inserted && (
          <React.Fragment>
            <Editors.Marketing
              parent={parent}
              entity={rowData}
              onConfirm={onPutCampaign}
              buttonSettings={{
                style: { marginRight: "5px", marginTop: "2px" },
                icon: "fas fa-pencil-alt",
                tooltip: labels.get("modificaCampagna")
              }}
            />
            <PossibleMatchingVehicles
              style={{ marginRight: "5px", marginTop: "2px" }}
              tooltip={labels.get("veicoliCoinvolti")}
              criteria={rowData.criteria}
              hierarchyId={parent.hierarchyId}
            />
          </React.Fragment>
        )}
        {[ENTITY_STATUS.closed, ENTITY_STATUS.active].includes(
          rowData.status
        ) && (
          <MatchedVehicles
            options={{
              from: 0,
              size: rowData.vehicles ? rowData.vehicles.length : 5,
              category: ITEM_CATEGORY.veicolo,
              filters: {
                uuid: {
                  matchMode: "terms",
                  value: rowData.vehicles || []
                }
              }
            }}
            style={{ marginRight: "5px", marginTop: "2px" }}
            tooltip={labels.get("veicoliCoinvolti")}
          />
        )}
        <JSONView
          entity={viewCriteria(rowData.criteria)}
          tooltip="visualizza criteri applicati"
        />
      </div>
    );
  }

  const parent = result.parentsBag[groupId]
    ? result.parentsBag[groupId][0]
    : {};

  return (
    <Card title={HistoryTitle(labels.get("campagneMarketing"))}>
      <PiramisTable
        options={options.esoptions}
        onSetDtRef={dt => (dtable = dt)}
        table={{
          loading: loading,
          headerTitle: labels.get("elencoCampagneMarketing"),
          headerLeft: !isEmpty(parent) && (
            <Editors.Marketing
              parent={parent}
              entity={{
                status: ENTITY_STATUS.inserted
              }}
              onConfirm={onPutCampaign}
              buttonSettings={{
                style: { marginRight: "5px" },
                icon: "fas fa-plus",
                tooltip: labels.get("creaCampagna")
              }}
            />
          )
        }}
        onLoadResults={onLoadResults}
        result={result}
      >
        <Column
          field="status"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("stato")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="name"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("nomeCampagna")}
          sortable
          filter
          filterMatchMode="contains"
        />

        <Column
          field="description"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("descrizione")}
          sortable
          filter
        />

        <Column
          field="startDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dataInizio")}
          body={getGridDateTemplate}
          filterElement={
            <CalendarTableColumnFilter
              field="startDate"
              onChange={(e: any) => dtable.filter(e.value, e.field, "range")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["startDate"]
                  ? options.esoptions.filters["startDate"].value
                  : ""
              }
            />
          }
          sortable
          filter
          filterMatchMode="match"
        />

        <Column
          field="endDate"
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
          header={labels.get("dataFine")}
          body={getGridDateTemplate}
          filterElement={
            <CalendarTableColumnFilter
              field="endDate"
              onChange={(e: any) => dtable.filter(e.value, e.field, "range")}
              value={
                options.esoptions.filters &&
                options.esoptions.filters["endDate"]
                  ? options.esoptions.filters["endDate"].value
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
          body={getEditColumnTemplate}
          style={{ maxWidth: "100px", wordWrap: "break-word" }}
        />
      </PiramisTable>
    </Card>
  );
}
