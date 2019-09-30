// @flow
import * as React from 'react';
import { PiramisContext } from '../../../../shared/piramis-context';
import { Button } from 'primereact/button';
import { Alert } from '../../../../_components';
import { ProgressBar } from 'primereact/progressbar';
import { HUB_EVENTS } from '../../../../shared/const';
import moment from 'moment';

const LOCKRESULT = 'DOUT1:1';
const UNLOCKRESULT = 'DOUT1:0';

export function LockTestCommand(props: {
  command: 'lock' | 'unlock',
  deviceId: number,
  trigger: string,
  step: any,
  triggerNextStep: Function
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [loading: any, setLoading] = React.useState(false);
  const { labels, gisApi } = context;

  const label = props.command === 'lock' ? labels.get('BLOCCA') : labels.get('SBLOCCA');
  const title = props.command === 'lock' ? labels.get('blocco') : labels.get('sblocco');
  const icon = props.command === 'lock' ? 'fas fa-lock' : 'fas fa-unlock-alt';
  const commandData = props.command === 'lock' ? 'setdigout 1' : 'setdigout 0';
  const completed = props.step.value && props.step.value.completed;
  const error = props.step.value && props.step.value.error;

  async function execCommand() {
    setLoading(true);
    const commandTime = moment().toJSON();

    const result = await gisApi.sendComand(
      props.deviceId,
      commandData,
      `test collaudo ${commandData}`,
      false
    );
    setLoading(false);
    if (result) {
      props.triggerNextStep({
        trigger: props.trigger,
        value: { completed: true, command: result, timestamp: commandTime }
      });
    } else {
      props.triggerNextStep({
        trigger: props.step.id,
        value: {
          error: labels.get(
            `Errore invio comando (probabile errore di rete). Si prega di riprovare.`
          )
        }
      });
    }
  }

  return (
    <div>
      <Alert
        color={error ? 'red' : completed ? 'green' : 'blue'}
        title={labels.get(`Esecuzione comando di ${title}`)}
        content={
          <div>
            {loading && (
              <div>
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
              </div>
            )}
            <div className="mb-2">
              {labels.get(
                error ||
                  (completed
                    ? 'Comando eseguito correttamente.'
                    : 'Premere per eseguire il comando.')
              )}
            </div>
            {!completed && !error && (
              <div>
                <Button
                  disabled={loading}
                  label={label}
                  icon={icon}
                  onClick={execCommand}
                  className={`p-button-info p-button-rounded`}
                />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

export function LockTestCommandVerify(props: {
  verify: 'lock' | 'unlock',
  deviceId: number,
  trigger: string,
  step: any,
  previousStep: any,
  triggerNextStep: Function
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [loading: any, setLoading] = React.useState(true);
  const { labels, hub } = context;

  const title = props.verify === 'lock' ? labels.get('blocco') : labels.get('sblocco');
  const completed = props.step.value && props.step.value.completed;
  const error = props.step.value && props.step.value.error;
  const timestamp = props.previousStep.value && props.previousStep.value.timestamp;

  function verifyCommand(comandResult: any) {
    const shouldStartWith = props.verify === 'lock' ? LOCKRESULT : UNLOCKRESULT;
    if (comandResult.attributes.result.startsWith(shouldStartWith)) {
      props.triggerNextStep({
        trigger: props.trigger,
        value: { completed: true, result: comandResult }
      });
    } else {
      props.triggerNextStep({
        trigger: props.previousStep.id,
        value: {
          error: labels.get(
            `Test fallito. Rilevato: ${
              comandResult.attributes.result.startsWith(LOCKRESULT)
                ? labels.get('blocco')
                : labels.get('sblocco')
            }, atteso: ${props.verify === 'lock' ? labels.get('blocco') : labels.get('sblocco')}`
          )
        }
      });
    }
  }

  React.useEffect(() => {
    if (completed || error) return;

    const CommandResultListener = {
      onHubCapsule: function onHubCapsule(capsule) {
        const { channel, payload } = capsule;
        const commandTimestamp = moment(timestamp);
        const deviceTime = moment(payload.position.deviceTime);

        if (
          channel === HUB_EVENTS.GISRESULT &&
          payload.position.attributes.result.startsWith('DOUT1') &&
          commandTimestamp.isBefore(deviceTime)
        ) {
          verifyCommand(payload.position);
          hub.remove(HUB_EVENTS.GISRESULT, CommandResultListener, `${props.verify}-VERIFIER`);
          setLoading(false);
        }
      }
    };

    hub.listen(HUB_EVENTS.GISRESULT, CommandResultListener, `${props.verify}-VERIFIER`);

    return function cleanup() {
      hub.remove(HUB_EVENTS.GISRESULT, CommandResultListener, `${props.verify}-VERIFIER`);
    };
  }, []);

  return (
    <div>
      <Alert
        color={error ? 'red' : completed ? 'green' : 'blue'}
        title={labels.get(`Verifica stato di ${title}`)}
        content={
          <div>
            {loading && !error && !completed && (
              <div>
                <div className="mb-2">
                  {labels.get(
                    `Si prega di attendere. La verifica potrebbe richiedere alcuni secondi.`
                  )}
                </div>
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
              </div>
            )}
            {error && <div>{labels.get(error)}</div>}
            {completed && <div>{labels.get(`Stato di ${title} verificato correttamente`)}</div>}
          </div>
        }
      />
    </div>
  );
}
