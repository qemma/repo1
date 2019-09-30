// @flow
import * as React from 'react';
import { PiramisContext } from '../../../../shared/piramis-context';
import { Button } from 'primereact/button';
import { Alert } from '../../../../_components';
import { ProgressBar } from 'primereact/progressbar';
import { resolveAddress } from '../../../../_components/utils';

export default function PositionTestAnswer(props: {
  trigger: string,
  triggerNextStep: Function,
  deviceId: number,
  step: any
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, gisApi, domainData } = context;

  const [loading: any, setLoading] = React.useState(false);
  const [
    positionResult: { position: any, address: any },
    setPositionResult: ({ position: any, address: any }) => void
  ] = React.useState(props.step.value && props.step.value.completed ? props.step.value : undefined);
  const completed = props.step.value && props.step.value.completed;
  const error = props.step.value && props.step.value.error;

  const checkValidState = position => {
    return Number(position.attributes.sat) >= domainData.appSettings.satLimit;
  };

  async function getPosition() {
    let ret;
    setLoading(true);
    const position: any = await gisApi.getLastPosition(props.deviceId);

    if (!position) {
      ret = {
        ok: false,
        error: `impossibile rilevare la posizione. Si prega di riprovare.`
      };
    } else if (!checkValidState(position)) {
      ret = {
        ok: false,
        error: `il numero di satelliti rilevato ${
          position.attributes.sat
        } risulta inferiore alla soglia inia stabilita di ${domainData.appSettings.satLimit}`
      };
    } else {
      let address: any;
      try {
        address = await resolveAddress(position);
      } catch (error) {
        // unable to resolve address but we keep going
        console.log(error);
      }
      ret = { ok: true, position, address };
      const posRes: any = { position, address };
      setPositionResult(posRes);
    }
    setLoading(false);
    return ret;
  }

  return (
    <div>
      <Alert
        color={error ? 'red' : completed ? 'green' : 'blue'}
        title={labels.get('Verifica della posizione')}
        content={
          <div>
            {loading && (
              <div>
                <div>{labels.get('rilevamento della posizione in corso...')}</div>
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
              </div>
            )}
            {error && <div>{error}</div>}
            {positionResult && (
              <div>
                {labels.get(
                  `posizione rilevata: satelliti ${
                    positionResult.position.attributes.sat
                  }, indirizzo: ${positionResult.address}`
                )}
              </div>
            )}
            {!error && !completed && positionResult && (
              <div>
                <div className="mb-2">{labels.get(`La posizione e' corretta?`)}</div>
                <Button
                  disabled={loading}
                  label={labels.get(`SI`)}
                  icon="pi pi-check"
                  style={{ marginRight: '5px' }}
                  onClick={() => {
                    props.triggerNextStep({
                      trigger: props.trigger,
                      value: {
                        position: positionResult.position,
                        address: positionResult.address,
                        completed: true
                      }
                    });
                  }}
                  className="p-button-success p-button-rounded"
                />

                <Button
                  disabled={loading}
                  label={labels.get(`NO`)}
                  icon="pi pi-times"
                  style={{ marginRight: '5px' }}
                  onClick={() => {
                    props.triggerNextStep({
                      trigger: props.step.id,
                      value: {
                        error: `posizione rifiutata da operatore`
                      }
                    });
                  }}
                  className="p-button-danger p-button-rounded"
                />
              </div>
            )}
            {!error && !completed && !positionResult && (
              <Button
                disabled={loading}
                label={labels.get(`Rileva la posizione`)}
                icon="pi pi-check"
                onClick={async () => {
                  const positionReq = await getPosition();
                  if (!positionReq.ok) {
                    props.triggerNextStep({
                      trigger: props.step.id,
                      value: {
                        error: positionReq.error
                      }
                    });
                  }
                }}
                className="p-button-info p-button-rounded"
              />
            )}
          </div>
        }
      />
    </div>
  );
}
