// @flow
import * as React from 'react';
import { S3Files } from '../../../_components';
import { Button } from 'primereact/button';
import { PiramisContext } from '../../../shared/piramis-context';

export default function CollectDocs(props: {
  onProceed: Function,
  dockey: string,
  onNewDoc: Function,
  docs: Array<any>
}) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels } = context;
  return (
    <div className="p-grid w-full">
      <div className="p-col-12">
        <h4>
          {labels.get('Aggiungi Documenti')}
          <Button
            onClick={props.onProceed}
            label={labels.get('stampa e firma')}
            style={{
              marginLeft: '5px'
            }}
            icon="fas fa-signature"
            className="button p-button-success"
          />
        </h4>
        <div className="App">
          <S3Files docs={props.docs} dockey={props.dockey} onNewDoc={props.onNewDoc} />
        </div>
      </div>
    </div>
  );
}
