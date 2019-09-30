// @flow
import * as React from 'react';
import { Button } from 'primereact/button';
import { PiramisContext } from '../../../../shared/piramis-context';
import { Confirm } from '../../../../_components';
import { Alert } from '../../../../_components';

export default function StartStep(props: any) {
  const positionComplete = props.steps[props.endPosition] ? true : false;
  const quadroComplete = props.steps[props.endQuadro] ? true : false;
  const bloccoComplete = props.steps[props.endBlocco] ? true : false;

  const collaudoCompleted = positionComplete && quadroComplete && bloccoComplete;

  function getType(completed) {
    return completed ? 'success' : 'secondary';
  }

  return (
    <div>
      {!collaudoCompleted && (
        <div>
          <Button
            className={`p-button-${getType(positionComplete)} p-button-rounded`}
            label={props.labels.get('TEST POSIZIONE')}
            icon="fas fa-crosshairs"
            disabled={positionComplete}
            onClick={() => props.triggerNextStep({ trigger: props.triggerPosition })}
            style={{ marginRight: '5px', marginTop: '5px' }}
          />
          <Button
            className={`p-button-${getType(quadroComplete)} p-button-rounded`}
            disabled={quadroComplete}
            label={props.labels.get('TEST QUADRO')}
            icon="fas fa-desktop"
            onClick={() => props.triggerNextStep({ trigger: props.triggerQuadro })}
            style={{ marginRight: '5px', marginTop: '5px' }}
          />
          <Button
            className={`p-button-${getType(bloccoComplete)} p-button-rounded`}
            disabled={bloccoComplete}
            label={props.labels.get('TEST BLOCCO AVVIAMENTO')}
            icon="fas fa-stop-circle"
            onClick={() => props.triggerNextStep({ trigger: props.triggerBlocco })}
            style={{ marginRight: '5px', marginTop: '5px' }}
          />
        </div>
      )}
      {collaudoCompleted && (
        <Alert
          color="green"
          title={props.labels.get('COLLAUDO COMPLETATO CORRETTAMENTE')}
          content={
            <div>
              <Button
                className={`p-button-success p-button-rounded`}
                label={props.labels.get('REGISTRA ESITO')}
                icon="fas fa-stop-circle"
                onClick={() => props.triggerNextStep({ trigger: props.finalBlock })}
              />
            </div>
          }
        />
      )}
    </div>
  );
}

function BackToStart(props: { backTrigger: string, cacheKey: string, triggerNextStep: Function }) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels } = context;
  return (
    <div>
      <Button
        className="p-button-warning p-button-rounded"
        label={labels.get('ABBANDONA TEST')}
        icon="fas fa-sign-out-alt"
        onClick={() => {
          Confirm(
            labels.get(
              `I dati relativi al test in corso verranno persi. Sicuro di voler proseguire?`
            ),
            labels
          )
            .then(() => {
              props.triggerNextStep({ trigger: props.backTrigger, value: { aborted: true } });
            })
            .catch(() => {
              //nothing
            });
        }}
        style={{ marginRight: '10px' }}
      />

      <Button
        className="p-button-danger p-button-rounded"
        label={labels.get('RICOMINCIA COLLAUDO')}
        icon="fas fa-redo-alt"
        onClick={() => {
          Confirm(
            labels.get(
              `Tutti i dati relativi ai test eseguiti verranno persi. Sicuro di voler proseguire?`
            ),
            labels
          )
            .then(() => {
              //ok called
              localStorage.removeItem(props.cacheKey);
              window.location.reload();
            })
            .catch(() => {
              //nothing
            });
        }}
      />
    </div>
  );
}

export function withReset(
  WrappedComponent: any,
  backTrigger: string,
  cacheKey: string,
  abortedMessage: string
) {
  return class extends React.Component<any, any> {
    render() {
      const aborted = this.props.step.value && this.props.step.value.aborted;
      const completed = this.props.step.value && this.props.step.value.completed;
      const error = this.props.step.value && this.props.step.value.error;
      return (
        <div>
          {aborted && (
            <div className="text-center">
              <i className="fas fa-ban text-5xl" />
              <div>{abortedMessage}</div>
            </div>
          )}
          {!aborted && <WrappedComponent {...this.props} />}
          {!aborted && !completed && !error && (
            <div className="mt-4">
              <BackToStart
                cacheKey={cacheKey}
                backTrigger={backTrigger}
                triggerNextStep={this.props.triggerNextStep}
              />
            </div>
          )}
        </div>
      );
    }
  };
}
