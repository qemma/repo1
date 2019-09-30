// TODO convert to functional
// @flow
import * as React from "react";
import { observer } from "mobx-react";
import { observable, decorate, action, flow, computed } from "mobx";
import ModalContainer from "../modals";
import { debounce } from "lodash";
import { getMessage } from "../utils";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { uniq } from "lodash";
import {
  ITEM_CATEGORY,
  ENTITY_STATUS,
  CATEGORY_ICON
} from "../../shared/const";
import { View } from "../entity-view";
import { createHistory, getObjectLookup } from "../utils";
import { withContext } from "../../shared/piramis-context";
import moment from "moment";

type Props = {
  onCreateDelivery: Function,
  buttonSettings: any,
  context: PiramisContextData,
  order: {
    quantity: number,
    model: string,
    description: string,
    reference1: string,
    uuid: string,
    code: string,
    group: string,
    endDate: string
  },
  entity: any
};

class CreateDelivery extends React.Component<Props> {
  static defaultProps = {
    buttonSettings: {
      tooltip: "crea spedizione",
      icon: CATEGORY_ICON[ITEM_CATEGORY.ordine]
    }
  };
  activeStep: number;
  loading: boolean;
  dialogVisible: boolean;
  scanInput: { element: HTMLInputElement };
  debounceOnScanComplete: Function;
  steps: Array<{ label: string, value: number }>;
  scans: Array<string> = [];
  devices: { items: Array<any> } = { items: [] };
  constructor(props) {
    super(props);
    this.activeStep = 0;
    this.loading = false;
    this.dialogVisible = false;
    this.debounceOnScanComplete = debounce(this.onScanComplete, 300);
    this.steps = [
      {
        label: props.context.labels.get("scansiona seriale dispositivo"),
        value: 0
      },
      {
        label: props.context.labels.get("verifica validita' e conferma"),
        value: 1
      }
    ];
    this.scans = [];
    this.devices = { items: [] };
  }

  componentDidUpdate() {
    this.setFocus();
  }

  selectStep = (newStep: number) => {
    this.activeStep = newStep;
  };

  setFocus = () => {
    this.activeStep === 0 && this.scanInput && this.scanInput.element.focus();
  };

  removeScan = el => {
    this.scans = this.scans.filter(item => item !== el);
  };

  onScanEntry = e => {
    if (e.key === "Enter") {
      this.debounceOnScanComplete(e.target.value);
    }
  };

  closeEditor = () => {
    this.dialogVisible = false;
  };

  openEditor = () => {
    this.dialogVisible = true;
  };

  onScanComplete = value => {
    this.scanInput.element.value = "";
    this.setFocus();
    this.scans = uniq(this.scans.concat(value));
    if (this.scans.length === Number(this.props.order.quantity)) {
      this.verifyDevices();
    }
  };

  get summary() {
    if (
      !this.devices ||
      !this.devices.items.length ||
      !this.devices.items.length
    )
      return [];
    const items = this.devices.items;
    return this.scans.map(sn => {
      const sat = items.find(el => el.sn === sn || el.imei === sn);

      return {
        sn,
        sat: sat || {},
        validationError:
          (!sat && "missingSat") ||
          (sat &&
            sat.status !== ENTITY_STATUS.readyForDelivery &&
            `stato diverso da ${ENTITY_STATUS.readyForDelivery}`)
      };
    });
  }

  get isValidDelivery() {
    if (
      !this.summary ||
      !this.summary.length ||
      this.summary.length !== Number(this.props.order.quantity)
    )
      return false;

    return this.summary.filter(el => el.validationError).length === 0;
  }

  verifyDevices = flow(
    function*() {
      this.loading = true;
      try {
        this.devices = yield this.props.context.entityService.search({
          from: 0,
          size: this.scans.length,
          category: ITEM_CATEGORY.device,
          filters: {
            imei: {
              or: true,
              matchMode: "terms",
              value: this.scans
            },
            sn: {
              or: true,
              matchMode: "terms",
              value: this.scans
            }
          }
        });
        this.selectStep(1);
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  reset = () => {
    this.activeStep = 0;
    this.scans = [];
    this.devices = {
      items: []
    };
  };

  onSaveData = flow(
    function*() {
      this.loading = true;
      try {
        const order: any = {
          ...this.props.order,
          status: ENTITY_STATUS.inDelivery,
          putInDeliveryDate: moment.utc().toISOString()
        };

        const sats = this.summary.map(el => ({
          ...el.sat,
          status: ENTITY_STATUS.inDelivery,
          putInDeliveryDate: moment.utc().toISOString(),
          group: order.group,
          parentId: order.uuid,
          reference1: this.props.entity.uuid,
          name: this.props.entity.name,
          hierarchyId: `${order.hierarchyId}*${el.sat.uuid}`,
          lookup: getObjectLookup(this.props.entity)
        }));

        const history = sats.map((el: any) =>
          createHistory(
            el,
            `spedito con ordine ${order.code} presso ${order.name} indirizzo ${this.props.entity.address.formatted_address}`,
            ""
          )
        );

        const entities = sats.concat(order).concat(history);
        yield this.props.onCreateDelivery(entities);
        this.closeEditor();
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  getSelectionSummary = (labels, items) => {
    const okclass = this.activeStep === 0 ? "info" : "success";
    const koclass = this.activeStep === 0 ? "warn" : "error";
    if (!items || !items.length) return null;
    const selectionItems = items.map((serialNumber, i) => {
      const summaryItem: any = this.summary.find(el => el.sn === serialNumber);
      const isValid = !summaryItem || !summaryItem.validationError;
      return (
        <div
          key={`selected-${i}`}
          aria-live="polite"
          style={{ marginRight: "1rem", marginTop: "1rem" }}
          className={`p-message p-component p-message-${
            serialNumber && isValid ? okclass : koclass
          }`}
        >
          {this.activeStep !== 2 && (
            <span
              className={
                this.loading
                  ? "fas fa-circle-notch fa-spin"
                  : "p-message-icon pi pi-fw pi-times"
              }
              style={{ cursor: "pointer" }}
              onClick={e => {
                this.removeScan(serialNumber);
              }}
            />
          )}
          <span className="p-message-text">
            <span>
              <strong>{labels.get("SN")}: </strong>
              {serialNumber}
            </span>
            {!isValid && (
              <div>
                <strong>{labels.get("errore")}: </strong>
                {labels.get(summaryItem.validationError)}
              </div>
            )}
          </span>
        </div>
      );
    });
    return (
      <div style={{ marginBottom: "2em" }}>
        <h2>
          {labels.get(
            this.activeStep === 2
              ? "Dispositivi in spedizione"
              : "Dispositivi proposti per la spedizione"
          )}
        </h2>
        {selectionItems}
      </div>
    );
  };

  getScannerInput = (labels, quantity) => {
    return (
      <div className="p-fluid">
        <div>
          <p>
            {labels.get("numero di dispositivi richiesti")}
            <strong className="ml-2">{quantity}</strong>
          </p>
        </div>
        <div className="p-inputgroup" style={{ marginTop: "1em" }}>
          <InputText
            disabled={this.scans.length === quantity}
            ref={(el: any) => (this.scanInput = el)}
            placeholder={labels.get(`scansiona codice o immetti e premi invio`)}
            onKeyPress={this.onScanEntry}
          />
          <span className="p-inputgroup-addon">
            <i className="fas fa-barcode" />
          </span>
        </div>
      </div>
    );
  };

  verifyDelivery = labels => {
    const message = this.isValidDelivery
      ? "di seguito trovi il riepilogo dei dati proposti nel dettaglio. Premi conferma per creare la spedizione"
      : "ci sono degli errori relativi ai dispositivi inseriti. Rimuovi i dispositivi non validi e ripeti l'operazione";
    return (
      <div>
        <h2>{labels.get("Dettaglio dispositivi")}</h2>
        {getMessage(
          "",
          <p>{labels.get(message)}</p>,
          this.isValidDelivery ? "success" : "error"
        )}
        <div style={{ textAlign: "right", marginBottom: "2em" }}>
          {this.isValidDelivery && (
            <Button
              disabled={this.loading}
              tooltip={labels.get("crea la spedizione")}
              className="p-button-success"
              style={{ marginRight: "1rem" }}
              label={labels.get("conferma")}
              icon={this.loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
              onClick={this.onSaveData}
            />
          )}

          <Button
            disabled={this.loading}
            tooltip={labels.get("torna allo step 1")}
            className="p-button-info"
            style={{ marginRight: "1rem" }}
            label={labels.get("torna alla scansione")}
            icon={this.loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
            onClick={() => this.selectStep(0)}
          />
          <Button
            tooltip={labels.get("annulla e ricomincia")}
            className="p-button-warning"
            disabled={this.loading}
            label={labels.get("annulla")}
            icon="pi pi-times"
            onClick={this.reset}
          />
        </div>
        <div>
          <DataTable
            value={this.summary}
            rowClassName={rowData => ({
              "p-satsim-success-row": !rowData.validationError,
              "p-satsim-error-row": rowData.validationError
            })}
          >
            <Column field="sat.sn" header={labels.get("serialNumber")} />
            <Column field="sat.imei" header={labels.get("imei")} />
            <Column field="sat.type" header={labels.get("tipoDispositivo")} />
            {/* <Column field="sat.model" header={labels.get('modello')} /> */}
            <Column
              field="sat.status"
              header={labels.get("statoDispositivo")}
            />
            <Column field="sat.tel" header={labels.get("tel")} />
            <Column
              field="validationError"
              body={data => {
                return data.validationError
                  ? labels.get(data.validationError)
                  : "";
              }}
              header={labels.get("errori")}
            />
          </DataTable>
        </div>
      </div>
    );
  };

  getEntityFields = (entity: any, labels: any) => {
    return [
      {
        label: labels.get("nome"),
        value: entity.name
      },
      {
        label: labels.get("indirizzo"),
        value: entity.address.formatted_address
      },
      {
        label: labels.get("tel"),
        value: entity.phone
      },
      {
        label: labels.get("pec"),
        value: entity.pec
      },
      {
        label: labels.get("codiceFiscaleIva"),
        value: entity.taxCode || entity.vatCode
      }
    ];
  };

  getOpener = (buttonSettings: any) => (
    <Button {...(buttonSettings || {})} onClick={this.openEditor} />
  );

  render() {
    const { order, buttonSettings, entity } = this.props;
    const labels = this.props.context.labels;
    if (!this.dialogVisible) return this.getOpener(buttonSettings);

    return (
      <React.Fragment>
        <ModalContainer
          onClose={this.closeEditor}
          visible={this.dialogVisible}
          height="100%"
          header={`${labels.get("Crea la spedizione per l'ordine numero ")} ${
            this.props.order.code
          }`}
          width="100%"
        >
          <Card
            title={`${labels.get("Crea la spedizione per l'ordine numero ")} ${
              this.props.order.code
            }`}
          >
            <h2>{labels.get("Destinatario")}</h2>
            <View fields={this.getEntityFields(entity, labels)} />
            <Fieldset
              legend={labels.get(
                `Scansiona il numero seriale o il codice IMEI dei dispositivi da spedire`
              )}
            >
              <Steps model={this.steps} activeIndex={this.activeStep} />
              {this.getSelectionSummary(labels, this.scans)}
              {this.activeStep === 0 && (
                <div>{this.getScannerInput(labels, order.quantity)}</div>
              )}
              {this.activeStep === 1 && (
                <div>{this.verifyDelivery(labels)}</div>
              )}
            </Fieldset>
          </Card>
        </ModalContainer>
        {this.getOpener(buttonSettings)}
      </React.Fragment>
    );
  }
}

export default withContext(
  observer(
    decorate(CreateDelivery, {
      activeStep: observable,
      scans: observable,
      loading: observable,
      devices: observable,
      verifyDevices: action,
      removeScan: action,
      selectStep: action,
      isValidDelivery: computed,
      onSaveData: action,
      reset: action,
      summary: computed,
      dialogVisible: observable,
      closeEditor: action,
      openEditor: action
    })
  )
);
