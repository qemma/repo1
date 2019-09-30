// @flow
import * as React from 'react';
import { SimImport } from '../../_components';
import { Card } from 'primereact/card';
import { PiramisContext } from '../../shared/piramis-context';

export default function ImportDevices() {
  const context: PiramisContextData = React.useContext(PiramisContext);
  return (
    <Card title={context.labels.get('simCards')}>
      <SimImport />
    </Card>
  );
}
