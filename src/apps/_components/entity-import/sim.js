//TODO use flow and convert to function

import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import readXlsxFile from "read-excel-file";
import ImportContainer from "./import-container";
import { drop } from "lodash";
import * as Const from "../../shared/const";

export default class ImportSimCards extends Component {
  handleFileChange = async (e, onFieldChange) => {
    const files = e.target.files;
    const toImport = await readXlsxFile(files[0]);
    const rows = drop(toImport, 1);
    onFieldChange({ file: files[0], rows }, true);
  };

  simTypeChange = (e, onFieldChange) => {
    onFieldChange({ simType: e.value });
  };

  carrierChange = (e, onFieldChange) => {
    onFieldChange({ carrier: e.value });
  };

  changeImportDate = (e, onFieldChange) => {
    onFieldChange({ insertDate: e.value });
  };

  adapt = formData => {
    return (formData.rows || []).map(el => {
      return {
        uuid: `${el[1]}-${el[0]}`,
        iccid: el[0],
        tel: el[1],
        insertionDate: formData.insertDate,
        simType: formData.simType,
        category: Const.ITEM_CATEGORY.sim,
        carrier: formData.carrier,
        status: Const.ENTITY_STATUS.inserted
      };
    });
  };

  validate = formData => {
    const errors = {};
    if (
      !formData.file ||
      formData.file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      errors.file = "selezionare un file excel";
    if (!formData.carrier) errors.carrier = `l'operatore e' obbligatorio`;
    if (!formData.simType) errors.simType = `il tipo di sim e' obbligatorio`;
    if (!formData.insertDate)
      errors.insertDate = `la data di inserimento e' obbligatoria`;
    if (
      !formData.rows ||
      (formData.rows &&
        formData.rows.length &&
        formData.rows.filter(row => !row[1] || !row[0]).length)
    ) {
      errors.file = `Il file selezionato non e' valido: per alcuni record non sono presenti iccid o il numero di telefono`;
    }

    return errors;
  };

  render() {
    return (
      <ImportContainer adapter={this.adapt} validate={this.validate}>
        {(formData, errors, onFieldChange, domainData, labels) => {
          const { carriers, simTypes } = domainData;
          return (
            <div className="p-grid p-fluid">
              <div className="p-col-12 p-md-3">
                <h3>{labels.get("importFile")}</h3>
                <span
                  className={`p-button p-fileupload-choose p-component p-button-text-icon-left ${
                    errors.file ? "p-error" : ""
                  }`}
                >
                  <span className="p-button-icon-left pi pi-plus" />
                  <span className="p-button-text p-clickable">
                    {formData.file
                      ? formData.file.name
                      : labels.get("chooseFile")}
                  </span>
                  <input
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    style={{ display: "inline" }}
                    onChange={e => {
                      this.handleFileChange(e, onFieldChange);
                    }}
                  />
                </span>
              </div>
              <div className="p-col-12 p-md-3">
                <h3>{labels.get("carrier")}</h3>
                <Dropdown
                  filter
                  filterBy="label"
                  className={errors.carrier ? "p-error" : ""}
                  showClear={true}
                  style={{ width: "100%" }}
                  value={formData.carrier || ""}
                  options={carriers}
                  onChange={e => {
                    this.carrierChange(e, onFieldChange);
                  }}
                  placeholder={labels.get("carrier")}
                />
              </div>
              <div className="p-col-12 p-md-3">
                <h3>{labels.get("simType")}</h3>
                <Dropdown
                  filter
                  className={errors.simType ? "p-error" : ""}
                  filterBy="label"
                  showClear={true}
                  style={{ width: "100%" }}
                  value={formData.simType || ""}
                  options={simTypes}
                  onChange={e => {
                    this.simTypeChange(e, onFieldChange);
                  }}
                  placeholder={labels.get("simType")}
                />
              </div>
              <div className="p-col-12 p-md-3">
                <h3>{labels.get("insertDate")}</h3>
                <Calendar
                  monthNavigator={true}
                  yearNavigator={true}
                  maxDate={new Date()}
                  showButtonBar={true}
                  className={errors.model ? "p-error" : ""}
                  yearRange="2000:2099"
                  value={formData.insertDate || ""}
                  onChange={e => {
                    this.changeImportDate(e, onFieldChange);
                  }}
                  dateFormat="dd/mm/yy"
                  showIcon={true}
                />
              </div>
            </div>
          );
        }}
      </ImportContainer>
    );
  }
}
