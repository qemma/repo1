//TODO use flow and convert to function

import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import readXlsxFile from "read-excel-file";
import ImportContainer from "./import-container";
import { drop } from "lodash";
import * as Const from "../../shared/const";

export default class ImportDevices extends Component {
  handleFileChange = async (e, onFieldChange) => {
    const files = e.target.files;
    const toImport = await readXlsxFile(files[0]);
    const rows = drop(toImport, 2);
    onFieldChange({ file: files[0], rows }, true);
  };

  supplierChange = (e, onFieldChange) => {
    onFieldChange({ supplier: e.value });
  };

  productTypeChange = (e, onFieldChange) => {
    onFieldChange({ type: e.value });
  };

  changeImportDate = (e, onFieldChange) => {
    onFieldChange({ insertDate: e.value });
  };

  adapt = formData => {
    return (formData.rows || []).map(el => {
      return {
        uuid: `${el[2]}-${el[3]}`,
        sn: el[2],
        imei: el[3],
        insertionDate: formData.insertDate,
        status: Const.ENTITY_STATUS.inserted,
        type: formData.type,
        model: el[4],
        category: Const.ITEM_CATEGORY.device,
        supplier: formData.supplier
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
    if (!formData.supplier) errors.supplier = `il fornitore e' obbligatorio`;
    if (!formData.insertDate)
      errors.insertDate = `la data di inserimento e' obbligatoria`;
    if (!formData.type) errors.type = `selezionare il tipo di prodotto`;
    if (
      !formData.rows ||
      (formData.rows &&
        formData.rows.length &&
        formData.rows.filter(row => !row[2] || !row[3]).length)
    ) {
      errors.file = `il file selezionato non e' valido: per alcuni record non sono presenti IMEI e SN`;
    }

    return errors;
  };

  render() {
    return (
      <ImportContainer adapter={this.adapt} validate={this.validate}>
        {(formData, errors, onFieldChange, domainData, labels) => {
          const { suppliers, devicesType } = domainData;
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
                <h3>{labels.get("supplier")}</h3>
                <Dropdown
                  filter
                  filterBy="label"
                  className={errors.supplier ? "p-error" : ""}
                  showClear={true}
                  style={{ width: "100%" }}
                  value={formData.supplier || ""}
                  options={suppliers}
                  onChange={e => {
                    this.supplierChange(e, onFieldChange);
                  }}
                  placeholder={labels.get("supplier")}
                />
              </div>
              <div className="p-col-12 p-md-3">
                <h3>{labels.get("tipoProdotto")}</h3>
                <Dropdown
                  filter
                  filterBy="label"
                  className={errors.type ? "p-error" : ""}
                  showClear={true}
                  style={{ width: "100%" }}
                  value={formData.type || ""}
                  options={devicesType}
                  onChange={e => {
                    this.productTypeChange(e, onFieldChange);
                  }}
                  placeholder={labels.get("tipoProdotto")}
                />
              </div>
              <div className="p-col-12 p-md-3">
                <h3>{labels.get("insertDate")}</h3>
                <Calendar
                  monthNavigator={true}
                  yearNavigator={true}
                  showButtonBar={true}
                  maxDate={new Date()}
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
