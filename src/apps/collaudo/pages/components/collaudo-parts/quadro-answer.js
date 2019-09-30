// @flow
import * as React from 'react';
import { PiramisContext } from '../../../../shared/piramis-context';
import { Button } from 'primereact/button';
import { Alert } from '../../../../_components';
import { ProgressBar } from 'primereact/progressbar';

export default function QuadroTestAnswer(props: {
  trigger: string,
  verify: 'on' | 'off',
  triggerNextStep: Function,
  deviceId: number,
  step: any
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, gisApi } = context;

  const [loading: any, setLoading] = React.useState(false);
  const completed = props.step.value && props.step.value.completed;
  const error = props.step.value && props.step.value.error;

  const checkValidState = position => {
    const on = position.attributes.di1 ? true : false;
    return props.verify === 'on' ? on : !on;
  };

  async function executeTest() {
    setLoading(true);
    const position = await gisApi.getLastPosition(props.deviceId);
    setLoading(false);
    if (!position) {
      return {
        ok: false,
        error: `impossibile rilevare dati dal dispositivo. Si prega di riprovare.`
      };
    } else if (!checkValidState(position)) {
      return {
        ok: false,
        error: `quadro rilevato come ${
          props.verify === 'on' ? labels.get('spento') : labels.get('acceso')
        }. Attendere qualche istante e riprovare. Se il problema persiste verificare l’installazione (positivo sotto chiave +15) per poi ripetere il test.`
      };
    } else {
      return { ok: true, position };
    }
  }

  return (
    <div>
      <Alert
        color={error ? 'red' : completed ? 'green' : 'blue'}
        title={labels.get(
          `Test verifica quadro rilevato in stato ${
            props.verify === 'on' ? labels.get('acceso') : labels.get('spento')
          } ?`
        )}
        content={
          <div>
            {loading && (
              <div>
                <div>{labels.get('rilevamento dati in corso...')}</div>
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
              </div>
            )}
            {error && <div className="text-red mb-4">{error}</div>}
            {completed && (
              <div className="text-green mb-4">
                {labels.get(
                  `quadro correttamente rilevato come ${
                    props.verify === 'on' ? labels.get('acceso') : labels.get('spento')
                  }`
                )}
              </div>
            )}
            {!error && !completed && (
              <Button
                disabled={loading}
                label={labels.get(
                  `Confermo che il quadro auto e' ${
                    props.verify === 'on' ? labels.get('acceso') : labels.get('spento')
                  }`
                )}
                icon="pi pi-check"
                onClick={async () => {
                  const testResult = await executeTest();
                  if (testResult.ok) {
                    props.triggerNextStep({
                      trigger: props.trigger,
                      value: { completed: true, position: testResult.position }
                    });
                  } else {
                    props.triggerNextStep({
                      trigger: props.step.id,
                      value: {
                        error: testResult.error
                      }
                    });
                  }
                }}
                className="p-button-success p-button-rounded"
              />
            )}
          </div>
        }
      />
    </div>
  );
}
