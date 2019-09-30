// @flow
import * as React from 'react';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Alert } from '..';
import { PiramisContext } from '../../shared/piramis-context';

export default function PositionView(props: { display: boolean, onRefresh: Function }) {
  if (!props.display) return null;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels } = context;
  return (
    <div className="p-grid w-full">
      <div className="p-col-12">
        <Alert
          color="blue"
          title={labels.get('In attesa di rilevare il dispositivo...')}
          content={
            <div>
              <div>
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
              </div>
              <p>
                {labels.get(
                  'Accendere il veicolo ed attendere. In caso di attesa prolungata premere il bottone Aggiorna'
                )}
              </p>
              <div>
                <Button
                  className=" p-button"
                  type="button"
                  label={labels.get('Aggiorna')}
                  onClick={props.onRefresh}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
