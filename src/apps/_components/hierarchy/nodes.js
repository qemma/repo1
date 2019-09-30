// @flow
import * as React from "react";
import {
  ITEM_CATEGORY,
  CATEGORY_ICON,
  PIRAMIS_ROLES
} from "../../shared/const";
import HistoryButton from "../state-link-button";
import Editors from "../editors";

type NodeProps = {
  node: any,
  parent: any,
  onAdd: Function,
  onEdit: Function,
  onDelete: Function,
  root: string,
  hasChildren: boolean,
  canEdit: boolean,
  canViewDetails: boolean,
  labels: Localizer
};

const NodeField = (props: {
  field: { icon: string, value: any, tooltip: string }
}) => (
  <div className="flex mt-1 w-full flex-wrap">
    <div
      title={props.field.tooltip}
      className="w-full md:w-1/6 bg-grey-light font-bold p-1 text-center text-grey-darker"
    >
      <i className={props.field.icon} />
    </div>
    <div className="w-full  md:w-5/6 bg-grey-darker p-1 text-center font-bold text-grey-lighter">
      {props.field.value}
    </div>
  </div>
);

export const NodeView = (props: {
  title?: any,
  fields: Array<{ icon: string, value: any, tooltip: string }>,
  children?: any,
  color: string
}) => (
  <div
    className={`font-sans rounded border px-2 py-1 max-w-md bg-${props.color} text-left`}
  >
    {props.title && <div className="mb-2 font-bold ">{props.title}</div>}
    {props.fields.map((field, i) => (
      <NodeField key={i} field={field} />
    ))}
    {props.children && <div className="mt-1">{props.children}</div>}
  </div>
);

const Dealer = (props: NodeProps) => (
  <NodeView
    title={props.labels.get("dealer")}
    fields={[
      {
        icon: CATEGORY_ICON[ITEM_CATEGORY.dealer],
        tooltip: props.labels.get("nome"),
        value: props.node.name
      },
      {
        icon: "fas fa-map-marker",
        tooltip: props.labels.get("indirizzo"),
        value: props.node.address.formatted_address
      },
      {
        icon: "fas fa-phone",
        tooltip: props.labels.get("tel"),
        value: props.node.phone
      },
      {
        icon: "fas fa-at",
        tooltip: props.labels.get("pec"),
        value: props.node.pec
      },
      {
        icon: "fas fa-barcode",
        tooltip: props.labels.get("codiceFiscaleIva"),
        value: props.node.taxCode || props.node.vatCode
      }
    ]}
    color={
      props.node.group === props.node.parentId ? "blue-dark" : "grey-light"
    }
  >
    <div>
      {props.canEdit && (
        <React.Fragment>
          <Editors.DealerEditor
            dealer={props.node}
            header={props.labels.get("modificaDealerSelez")}
            onConfirm={props.onEdit}
            buttonSettings={{
              style: { marginRight: "5px", marginTop: "2px" },
              icon: "fas fa-pencil-alt",
              tooltip: props.labels.get("modificaDealer")
            }}
          />
          <Editors.DealerEditor
            parent={props.node}
            header={props.labels.get("aggiungiFiliale")}
            onConfirm={props.onAdd}
            buttonSettings={{
              style: { marginRight: "5px", marginTop: "2px" },
              icon: CATEGORY_ICON["filiale"],
              tooltip: props.labels.get("aggiungiFiliale")
            }}
          />
          <Editors.UserEditor
            onConfirm={props.onAdd}
            user={{
              parentId: props.node.uuid,
              group: props.node.group,
              entityId: props.node.uuid,
              roles: PIRAMIS_ROLES.venditore
            }}
            parent={props.node}
            disable={["roles", "entityId"]}
            buttonSettings={{
              style: { marginRight: "5px", marginTop: "2px" },
              icon: CATEGORY_ICON[PIRAMIS_ROLES.venditore],
              tooltip: props.labels.get("aggiungiVenditore")
            }}
          />
        </React.Fragment>
      )}

      <HistoryButton
        style={{ marginRight: "5px", marginTop: "2px" }}
        tooltip={props.labels.get("visualizzaClienti")}
        icon="fas fa-users"
        url={`${props.root}/customers/${props.node.uuid}`}
        data={props.node}
      />

      <HistoryButton
        style={{ marginRight: "5px", marginTop: "2px" }}
        tooltip={props.labels.get("visualizzaVeicoli")}
        icon="fas fa-car"
        url={`${props.root}/vehicles/${props.node.uuid}`}
        data={props.node}
      />

      {props.canViewDetails && (
        <React.Fragment>
          <HistoryButton
            style={{ marginRight: "5px", marginTop: "2px" }}
            tooltip={props.labels.get("visualizzaVendite")}
            icon={CATEGORY_ICON[ITEM_CATEGORY.vendita]}
            url={`${props.root}/groupsales/${props.node.uuid}`}
            data={props.node}
          />

          <HistoryButton
            style={{ marginRight: "5px", marginTop: "2px" }}
            tooltip={props.labels.get("visualizzaOrdini")}
            icon={CATEGORY_ICON[ITEM_CATEGORY.ordine]}
            url={`${props.root}/grouporders/${props.node.uuid}`}
            data={props.node}
          />

          <HistoryButton
            style={{ marginRight: "5px", marginTop: "2px" }}
            tooltip={props.labels.get("visualizzaMagazzino")}
            icon="fas fa-warehouse"
            url={`${props.root}/entitystorage/${props.node.uuid}`}
            data={props.node}
          />

          <HistoryButton
            style={{ marginRight: "5px", marginTop: "2px" }}
            tooltip={props.labels.get("visualizzaModelliTagliando")}
            icon="fas fa-wrench"
            url={`${props.root}/tagliandi/${props.node.uuid}`}
            data={props.node}
          />

          <HistoryButton
            style={{ marginRight: "5px", marginTop: "2px" }}
            tooltip={props.labels.get("visualizzaRichiami")}
            icon="fas fa-tools"
            url={`${props.root}/richiami/${props.node.uuid}`}
            data={props.node}
          />

          <HistoryButton
            style={{ marginRight: "5px", marginTop: "2px" }}
            tooltip={props.labels.get("visualizzaMarketing")}
            icon="fas fa-mail-bulk"
            url={`${props.root}/marketing/${props.node.uuid}`}
            data={props.node}
          />
        </React.Fragment>
      )}
    </div>
  </NodeView>
);

const Seller = (props: NodeProps) => (
  <NodeView
    title={props.labels.get("venditore")}
    fields={[
      {
        icon: CATEGORY_ICON[PIRAMIS_ROLES.venditore],
        tooltip: props.labels.get("nome"),
        value: props.node.name
      },
      {
        icon: "fas fa-map-marker",
        tooltip: props.labels.get("indirizzo"),
        value: props.node.address.formatted_address
      },
      {
        icon: "fas fa-barcode",
        tooltip: props.labels.get("codiceFiscaleIva"),
        value: props.node.taxCode || props.node.vatCode
      },
      {
        icon: "fas fa-at",
        tooltip: props.labels.get("mail"),
        value: props.node.pec || props.node.mail
      }
    ]}
    color="indigo-lighter"
  >
    <div>
      {props.canEdit && (
        <React.Fragment>
          <Editors.UserEditor
            onConfirm={props.onEdit}
            user={props.node}
            disable={["roles", "entityId", "username"]}
            buttonSettings={{
              style: { marginRight: "5px", marginTop: "2px" },
              icon: "fas fa-pencil-alt",
              tooltip: props.labels.get("modificaVenditoreSelez")
            }}
          />
        </React.Fragment>
      )}
      {props.canViewDetails && (
        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={props.labels.get("visualizzaVendite")}
          icon={CATEGORY_ICON[ITEM_CATEGORY.vendita]}
          url={`${props.root}/agentsales/${
            props.node.group
          }/${encodeURIComponent(props.node.uuid)}`}
          data={props.node}
        />
      )}
    </div>
  </NodeView>
);

const Agente = (props: NodeProps) => (
  <NodeView
    title={props.labels.get("Agente")}
    fields={[
      {
        icon: CATEGORY_ICON[PIRAMIS_ROLES.venditore],
        tooltip: props.labels.get("nome"),
        value: props.node.name
      },
      {
        icon: "fas fa-map-marker",
        tooltip: props.labels.get("indirizzo"),
        value: props.node.address.formatted_address
      },
      {
        icon: "fas fa-barcode",
        tooltip: props.labels.get("codiveFiscaleIva"),
        value: props.node.taxCode || props.node.vatCode
      },
      {
        icon: "fas fa-at",
        tooltip: props.labels.get("mail"),
        value: props.node.pec || props.node.mail
      }
    ]}
    color="yellow-dark"
  >
    <div>
      {props.canEdit && (
        <React.Fragment>
          <Editors.UserEditor
            onConfirm={props.onEdit}
            user={props.node}
            disable={["roles", "entityId", "username"]}
            buttonSettings={{
              style: { marginRight: "5px", marginTop: "2px" },
              icon: "fas fa-pencil-alt",
              tooltip: props.labels.get("modificaAgenteSelezionato")
            }}
          />
        </React.Fragment>
      )}
      {props.canViewDetails && (
        <HistoryButton
          style={{ marginRight: "5px", marginTop: "2px" }}
          tooltip={props.labels.get("visualizzaVendite")}
          icon={CATEGORY_ICON[ITEM_CATEGORY.vendita]}
          url={`${props.root}/agentsales/${
            props.node.group
          }/${encodeURIComponent(props.node.uuid)}`}
          data={props.node}
        />
      )}
    </div>
  </NodeView>
);

const mapNodes = {
  [ITEM_CATEGORY.dealer]: Dealer,
  [PIRAMIS_ROLES.venditore]: Seller,
  [PIRAMIS_ROLES.agente]: Agente
};
const getNode = (category: string) => mapNodes[category];

export default getNode;
