//TODO use flow and convert to function
import React, { Component } from "react";
import ImportContainer from "./import-container";
import { JsonEditor as Editor } from "jsoneditor-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import * as Const from "../../shared/const";
// $FlowIgnore: require ace
import ace from "brace";
// $FlowIgnore: require json
import "brace/mode/json";
// $FlowIgnore: require theme
import "brace/theme/github";
const sample = require("./domainDataSample.json");

export default class ImportDomainData extends Component {
  state = { visible: false };
  handleChange = (e, onFieldChange) => {
    onFieldChange({ domainData: e, error: false });
  };

  adapt = formData => {
    return [
      {
        uuid: `${Const.PIRAMIS_DOMAINS_ID}-${formData.culture || "it"}`,
        category: Const.ITEM_CATEGORY.domains,
        description: JSON.stringify(formData.domainData)
      }
    ];
  };

  validate = formData => {
    const errors = {};
    if (!formData.domainData) {
      errors.domainData =
        "Inserire i dati di dominio in un valido formato JSON";
    }

    if (formData.error) {
      errors.error = formData.error;
    }
    return errors;
  };

  render() {
    return (
      <ImportContainer
        adapter={this.adapt}
        hideSummaryTable
        validate={this.validate}
        onNotify={this.props.onNotify}
        initialForm={this.props.initialForm}
      >
        {(formData, errors, onFieldChange, domainData, labels) => {
          return (
            <div className="p-grid p-fluid">
              <div className="p-col-12">
                <h3>
                  {labels.get("presentDomainData")}{" "}
                  <Button
                    type="button"
                    icon="pi pi-external-link"
                    label={labels.get("sampleDomainData")}
                    onClick={e => this.setState({ visible: true })}
                  />
                </h3>

                <Editor
                  mode="tree"
                  navigationBar={false}
                  history
                  ace={ace}
                  theme="ace/theme/github"
                  allowedModes={["tree", "code"]}
                  value={formData.domainData || {}}
                  onChange={e => this.handleChange(e, onFieldChange)}
                />
              </div>

              <Dialog
                header={labels.get("sampleDomainData")}
                visible={this.state.visible}
                onHide={e => this.setState({ visible: false })}
                modal={true}
                style={{ width: "80%" }}
              >
                <Editor
                  mode="code"
                  ace={ace}
                  theme="ace/theme/github"
                  navigationBar={false}
                  allowedModes={["view", "code"]}
                  value={sample}
                />
              </Dialog>
            </div>
          );
        }}
      </ImportContainer>
    );
  }
}
