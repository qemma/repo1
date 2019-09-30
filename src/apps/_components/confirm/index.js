// @flow
import * as React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const ConfirmDialog = (props: {
  show: boolean,
  proceed: Function,
  dismiss: Function,
  cancel: Function,
  labels: Localizer,
  confirmation: any,
  options: any,
  reasonProps: any
}) => {
  const [reason: any, setReason] = React.useState();
  return (
    <Dialog
      onHide={() => props.cancel('user cancelled')}
      visible={props.show}
      baseZIndex={9000}
      header={props.labels.get('Richiesta conferma')}
      {...props.options}
    >
      <div>
        <div className="p-messages p-component p-messages-info p-messages-enter-done">
          <div className="p-messages-wrapper">
            <span className="p-messages-icon pi  pi-info-circle" />
            <ul>
              {!props.reasonProps.disableConfirm && (
                <li>
                  <span className="p-messages-summary">{props.labels.get('Attenzione!')}</span>
                  <span className="p-messages-detail">{props.confirmation}</span>
                </li>
              )}
              {props.reasonProps.disableConfirm && (
                <li>
                  <div className="w-full">
                    <span className="p-float-label">
                      <div className="p-inputgroup">
                        <InputText
                          {...props.reasonProps.input || {}}
                          id="confirmationText"
                          className="w-full"
                          onChange={e => setReason(e.target.value)}
                        />
                        <span className="p-inputgroup-addon">
                          <i className={props.reasonProps.icon || 'fas fa-text'} />
                        </span>
                        <label htmlFor="confirmationText">{props.reasonProps.label || ''}</label>
                      </div>
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="text-right flex flex-row-reverse mt-4 w-full">
        <div className="text-center">
          <Button
            onClick={() => props.proceed(reason)}
            icon="pi pi-check"
            disabled={props.reasonProps && props.reasonProps.input && !reason}
            className="p-button-success  "
            label={
              props.reasonProps.disableConfirm ? props.labels.get('ok') : props.labels.get('si')
            }
          />
        </div>
        <div className="text-center px-2">
          {!props.reasonProps.disableConfirm && (
            <Button
              onClick={() => props.cancel('user cancelled')}
              icon="pi pi-times"
              className="p-button-danger"
              label={props.labels.get('no')}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
};

const confirm = createConfirmation(confirmable(ConfirmDialog));

export default function(
  confirmation: any,
  labels: Localizer,
  options: any = {},
  reasonProps: any = {}
) {
  return confirm({ confirmation, labels, options, reasonProps });
}
