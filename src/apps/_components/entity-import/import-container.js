// @flow
//TODO use flow and convert to function
import * as React from "react";

import { observer } from "mobx-react";
import { observable, decorate, toJS } from "mobx";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { isEmpty } from "lodash";
import { DataTable } from "primereact/datatable";
import { getGridDateTemplate } from "../utils";
import { withContext } from "../../shared/piramis-context";
import { Column } from "primereact/column";
import Alert from "../alert";
import ImportStore from "./import-store";

const ValidationSummary = (props: { errors: any, labels: Localizer }) =>
  !isEmpty(props.errors) ? (
    <Alert
      color="red"
      title={props.labels.get("error")}
      content={Object.keys(props.errors).map((key, i) => (
        <p key={`val-${i}`}>{props.labels.get(props.errors[key])}</p>
      ))}
    />
  ) : null;

class ImportContainer extends React.Component<any> {
  form: any;
  errors: any;
  store: any;
  constructor(props) {
    super(props);
    this.form = props.initialForm || {};
    this.errors = {};
    this.store = new ImportStore(
      this.props.context.entityService,
      this.props.context.hub
    );
  }

  componentDidMount() {
    this.store.reset(this.props.initialForm, this.props.adapter);
  }

  onResetForm = () => {
    this.form = this.props.initialForm || {};
    this.errors = {};
    this.store.reset(this.props.initialForm, this.props.adapter);
  };

  onFieldChange = async (changedField, chekExisting) => {
    this.form = {
      ...this.form,
      ...changedField
    };
    this.errors = this.props.validate ? this.props.validate(this.form) : {};

    this.store.updateRowsToImport(this.form, this.props.adapter, chekExisting);
  };

  onImportData = async () => {
    this.errors = this.props.validate ? this.props.validate(this.form) : {};

    if (isEmpty(this.errors)) {
      await this.store.import(this.store.rowsToImport);
      this.props.onNotify && this.props.onNotify(toJS(this.store.rowsToImport));
    }
  };

  renderRowsToImport = rows => {
    const keys = Object.keys(rows[0]).filter(
      key =>
        [
          "uuid",
          "category",
          "opType",
          "itemId",
          "existing",
          "updateDate",
          "updatedBy"
        ].indexOf(key) < 0
    );
    return (
      <DataTable
        value={rows}
        rowClassName={rowData => {
          return { "p-highlight": rowData.existing };
        }}
      >
        {keys.map((key, i) => (
          <Column
            key={key}
            field={key}
            body={
              key.toLowerCase().indexOf("date") >= 0
                ? getGridDateTemplate
                : null
            }
            header={this.props.context.labels.get(key)}
            filter
            sortable
          />
        ))}
      </DataTable>
    );
  };

  getResultSummary = (result, labels) => {
    let errorfeedback = null;
    let successFeedback = null;
    if (result.errors) {
      errorfeedback = (
        <div className="p-messages p-component p-messages-error p-messages-enter-done">
          <div className="p-messages-wrapper">
            <div className="p-messages-detail">
              <h3>{labels.get("failureImport")}</h3>
              {result.errors.map((el, i) => (
                <div key={`err-${i}`}>{el.uuid}</div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (result.items) {
      successFeedback = (
        <div className="p-messages p-component p-messages-success p-messages-enter-done">
          <div className="p-messages-wrapper">
            <div className="p-messages-detail">
              <h3>
                {labels.get(
                  `${result.items.length} Record importati con successo`
                )}
              </h3>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {errorfeedback}
        {successFeedback}
      </div>
    );
  };

  render() {
    const { hideSummaryTable } = this.props;
    const { labels, domainData } = this.props.context;
    const { loading, result } = this.store;
    return (
      <div>
        <Fieldset
          legend={labels.get("massiveImport")}
          toggleable
          className={!isEmpty(this.errors) ? "p-error" : ""}
        >
          {this.props.children(
            this.form,
            this.errors,
            this.onFieldChange,
            domainData,
            labels
          )}

          <div className="p-grid p-fluid p-justify-end">
            <div className="p-col-3">
              <Button
                disabled={loading}
                className="p-button-success"
                label={labels.get("save")}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                onClick={this.onImportData}
              />
            </div>
            <div className="p-col-3">
              <Button
                className="p-button-warning"
                disabled={loading}
                label={labels.get("reset")}
                icon="pi pi-times"
                onClick={this.onResetForm}
              />
            </div>
            <div className="p-col-12">
              <ValidationSummary
                errors={this.errors}
                labels={this.props.context.labels}
              />
            </div>

            {result && (
              <div className="p-col-12">
                {this.getResultSummary(result, labels)}
              </div>
            )}
          </div>
        </Fieldset>
        {!hideSummaryTable &&
          this.store.rowsToImport &&
          this.store.rowsToImport.length && (
            <div>
              <h3>
                {labels.get(
                  "Record che verranno importati (quelli evidenziati in blu sono stati importati in precedenza e non verranno considerati)"
                )}
              </h3>
              {this.renderRowsToImport(this.store.rowsToImport)}
            </div>
          )}
      </div>
    );
  }
}

export default withContext(
  observer(
    decorate(ImportContainer, {
      form: observable,
      errors: observable
    })
  )
);
