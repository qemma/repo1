// @flow
import * as React from "react";
import { Formik } from "formik";
import { Button } from "primereact/button";
import type { FormikProps } from "formik";
import { isEmpty } from "lodash";
import ModalContainer from "../modals";
import {
  getParentId,
  getGroup,
  getHierarchyId,
  getObjectLookup
} from "../utils";
import Alert from "../alert";
import uniqueId from "uniqid";

type Props = {
  labels: Localizer,
  onConfirm: (entity: any) => Promise<any>,
  onCancel?: () => any,
  onOpen?: () => void,
  category: string,
  schema: any,
  entity?: any,
  opened?: boolean,
  buttonSettings?: any,
  parent?: any,
  header: any,
  ownGroup?: boolean,
  children: (props: FormikProps) => React.Node
};

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

const EditorButtons = (props: {
  loading: boolean,
  inline?: boolean,
  onConfirm: Function,
  onCancel: Function
}) => (
  <div>
    <div style={{ height: "35px" }} />
    <div
      className="text-right flex flex-row-reverse fixed"
      style={!props.inline && { right: "35px", bottom: "20px", height: "35px" }}
    >
      <div className="text-center">
        <Button
          disabled={props.loading}
          className="p-button-success p-button-icon-only"
          type="button"
          icon={props.loading ? "fas fa-circle-notch fa-spin" : "pi pi-check"}
          onClick={props.onConfirm}
        />
      </div>
      <div className="text-center  px-2 ">
        <Button
          disabled={props.loading}
          className="p-button-warning p-button-icon-only"
          icon="pi pi-times"
          onClick={props.onCancel}
        />
      </div>
    </div>
  </div>
);

class ModalEditor extends React.Component<Props, { dialogVisible: boolean }> {
  state = { dialogVisible: this.props.opened || false };
  static defaultProps = {
    buttonSettings: {}
  };

  closeEditor = () => {
    this.setState({ dialogVisible: false });
  };

  openEditor = () => {
    this.setState({ dialogVisible: true });
    this.props.onOpen && this.props.onOpen();
  };

  onConfirm = async (modified: any, actions: FormikProps) => {
    actions.setSubmitting(true);
    const entity = {
      ...modified,
      uuid: modified.uuid || uniqueId()
    };

    try {
      const completedEntity = {
        ...entity,
        group: this.props.ownGroup
          ? entity.uuid
          : getGroup(entity, this.props.parent),
        hierarchyId: getHierarchyId(entity, this.props.parent),
        category: entity.category || this.props.category,
        parentId: getParentId(entity, this.props.parent),
        lookup: getObjectLookup(entity),
        entityId:
          entity.entityId && entity.entityId.uuid
            ? entity.entityId.uuid
            : entity.entityId || undefined
      };
      await this.props.onConfirm(completedEntity);
      this.closeEditor();
    } catch (error) {
      console.error(error);
      actions.setStatus({
        msg: this.props.labels.get(
          "Errore durante il salvataggio. si prega di riprovare"
        )
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.opened !== this.props.opened) {
      this.setState({ dialogVisible: this.props.opened });
    }
  }

  render() {
    const { entity, buttonSettings, header, schema, children } = this.props;
    return (
      <React.Fragment>
        <ModalContainer
          onClose={() => {
            this.closeEditor();
            if (this.props.onCancel) {
              this.props.onCancel();
            }
          }}
          visible={this.state.dialogVisible}
          height="90%"
          header={header}
          width="90%"
        >
          <Formik
            initialValues={entity}
            validationSchema={schema}
            onSubmit={this.onConfirm}
            render={frmProps => (
              <div className="p-grid">
                <div className="p-col-12">
                  <ValidationSummary
                    errors={frmProps.errors}
                    labels={this.props.labels}
                  />
                </div>
                {children(frmProps)}
                {frmProps.status && (
                  <div className="p-col-12">
                    <Alert
                      color="red"
                      title={this.props.labels.get("error")}
                      content={frmProps.status.msg}
                    />
                  </div>
                )}
                <div className="p-col-12">
                  <ValidationSummary
                    errors={frmProps.errors}
                    labels={this.props.labels}
                  />
                </div>
                <EditorButtons
                  loading={frmProps.isSubmitting}
                  onConfirm={frmProps.handleSubmit}
                  onCancel={() => {
                    this.closeEditor();
                    if (this.props.onCancel) {
                      this.props.onCancel();
                    }
                  }}
                />
              </div>
            )}
          />
        </ModalContainer>
        <Button {...(buttonSettings || {})} onClick={this.openEditor} />
      </React.Fragment>
    );
  }
}

export default ModalEditor;
