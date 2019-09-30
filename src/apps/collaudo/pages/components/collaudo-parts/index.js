import * as React from 'react';
import { PiramisContext } from '../../../../shared/piramis-context';
import { Button } from 'primereact/button';
import { Alert } from '../../../../_components';
import CollaudoBot from './collaudo-bot';

function YesNoQuestion(props: any) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const labels = context.labels;
  const yes = props.step.value && props.step.value.result;
  const completed = props.step.value && props.step.value.completed;

  return (
    <div>
      <Alert
        color={!completed ? 'blue' : yes ? 'green' : 'red'}
        title={labels.get(props.question)}
        content={
          <div>
            {completed && <div>{yes ? labels.get(props.yesLabel) : labels.get(props.noLabel)}</div>}
            {!completed && (
              <div>
                <Button
                  label={labels.get(props.yesLabel)}
                  icon="pi pi-check"
                  style={{ marginRight: '5px' }}
                  onClick={() => {
                    props.triggerNextStep({
                      trigger: props.yesTrigger,
                      value: {
                        question: props.question,
                        result: true,
                        completed: true
                      }
                    });
                  }}
                  className="p-button-success p-button-rounded"
                />

                <Button
                  label={labels.get(props.noLabel)}
                  icon="pi pi-times"
                  style={{ marginRight: '5px' }}
                  onClick={() => {
                    props.triggerNextStep({
                      trigger: props.noTrigger,
                      value: {
                        question: props.question,
                        result: false,
                        completed: true
                      }
                    });
                  }}
                  className="p-button-danger p-button-rounded"
                />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

export { CollaudoBot, YesNoQuestion };
