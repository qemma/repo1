// @flow
import * as React from "react";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Formik } from "formik";
import { Button } from "primereact/button";
import { Alert, Editors, Confirm } from "../../_components";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import uniqueId from "uniqid";
import { ITEM_CATEGORY, ENTITY_STATUS } from "../../shared/const";
import { PiramisContext } from "../../shared/piramis-context";
import { wait } from "../../_components/utils";

const schema = Yup.object({
  plate: Yup.string().required("targa obbligatoria"),
  imei: Yup.string()
    .required("ultime 5 cifre codice imei obbligatorio")
    .test(
      "len",
      "inserire le ultime 5 cifre del codice imei",
      val => val && val.length === 5
    )
});
export default function NewTicket(props: any) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [vehicles, setVehicles] = React.useState(undefined);
  const [loading, setLoading] = React.useState(false);

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

  async function onSearch(data, actions) {
    actions.setSubmitting(true);
    hub.loading(true);
    setLoading(true);
    try {
      const result = await entityService.search({
        type: "match",
        field: "category",
        value: ITEM_CATEGORY.veicolo,
        filters: {
          imei: { matchMode: "regexp", value: `.*${data.imei}` },
          plate: { matchMode: "match", value: data.plate }
        }
      });
      setVehicles(result.items);
    } catch (error) {
      actions.setStatus({
        msg: labels.get("errore durante la ricerca. si prega di riprovare")
      });
    } finally {
      actions.setSubmitting(false);
      hub.loading(false);
      setLoading(false);
    }
  }

  async function onPutTicket(vehicle) {
    hub.loading(true);
    setLoading(true);
    try {
      const notes = await Confirm(
        labels.get("note"),
        labels,
        {},
        {
          input: { placeholder: labels.get("note") },
          icon: "fas fa-text",
          disableConfirm: true
        }
      );
      const uuid = uniqueId();
      const ticket: any = {
        uuid,
        group: vehicle.group,
        notes,
        status: ENTITY_STATUS.active,
        parentId: vehicle.uuid,
        hierarchyId: `${vehicle.hierarchyId}*${uuid}`,
        category: ITEM_CATEGORY.ticket,
        reference1: vehicle.parentId,
        reference2: vehicle.uuid,
        plate: vehicle.plate,
        imei: vehicle.imei,
        name: vehicle.name,
        mail: vehicle.name,
        phone: vehicle.phone
      };
      await entityService.put([ticket]);
      const url = `${encodeURIComponent(context.root)}/edit-ticket/${uuid}`;
      await wait(1500);
      window.location.hash = url;
    } finally {
      hub.loading(false);
      setLoading(false);
    }
  }

  return (
    <Card title={labels.get("Centrale Operativa")}>
      <div className="bg-white w-full p-4">
        <Formik
          validationSchema={schema}
          onSubmit={onSearch}
          render={frmProps => (
            <div className="p-grid">
              <Editors.Fields.InputField
                onChange={frmProps.handleChange}
                id="plate"
                label={labels.get("targa")}
                icon="fas fa-newspaper"
                value={frmProps.values["plate"]}
                errors={frmProps.errors}
              />
              <Editors.Fields.InputField
                onChange={frmProps.handleChange}
                id="imei"
                input={{ keyfilter: "pint" }}
                label={labels.get("ultime 5 cifre codice imei")}
                icon="far fa-address-card"
                value={frmProps.values["imei"]}
                errors={frmProps.errors}
              />

              {frmProps.status && (
                <div className="p-col-12">
                  <Alert
                    color="red"
                    title={labels.get("error")}
                    content={frmProps.status.msg}
                  />
                </div>
              )}
              <div className="p-col-12">
                <ValidationSummary errors={frmProps.errors} labels={labels} />
              </div>

              <div className="text-right flex flex-row-reverse w-full">
                <div className="text-center">
                  <Button
                    disabled={frmProps.isSubmitting || loading}
                    className="p-button-success p-button-icon-only"
                    type="button"
                    icon={
                      frmProps.isSubmitting
                        ? "fas fa-circle-notch fa-spin"
                        : "fab fa-searchengin"
                    }
                    onClick={frmProps.handleSubmit}
                  />
                </div>
              </div>
              {vehicles && (
                <DataTable
                  header={
                    <div
                      className="p-clearfix"
                      style={{ lineHeight: "1.87em" }}
                    >
                      {labels.get("Risultati ricerca")}
                    </div>
                  }
                  value={vehicles}
                  style={{ marginTop: "10px" }}
                  loading={loading}
                  paginator={true}
                  rowsPerPageOptions={[5, 10, 20]}
                  rows={5}
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
                    header={labels.get("proprietario")}
                    sortable
                    filter
                    filterMatchMode="contains"
                  />
                  <Column
                    field="type"
                    style={{ maxWidth: "100px", wordWrap: "break-word" }}
                    header={labels.get("tipo")}
                    sortable
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
                    style={{ maxWidth: "100px", wordWrap: "break-word" }}
                    field="preparation"
                    header={labels.get("allestimento")}
                    sortable
                    filter
                    filterMatchMode="contains"
                  />
                  <Column
                    style={{ maxWidth: "100px", wordWrap: "break-word" }}
                    field="km"
                    header={labels.get("km")}
                    sortable
                    filter
                    filterMatchMode="contains"
                  />
                  <Column
                    field="actions"
                    style={{
                      maxWidth: "100px",
                      wordWrap: "break-word"
                    }}
                    body={vehicle => (
                      <Button
                        disabled={loading}
                        className="p-button-success"
                        type="button"
                        label={labels.get("crea ticket")}
                        tooltip={labels.get("crea ticket")}
                        icon={
                          frmProps.isSubmitting
                            ? "fas fa-circle-notch fa-spin"
                            : "fas fa-save"
                        }
                        onClick={() => onPutTicket(vehicle)}
                      />
                    )}
                  />
                </DataTable>
              )}
            </div>
          )}
        />
      </div>
    </Card>
  );
}
