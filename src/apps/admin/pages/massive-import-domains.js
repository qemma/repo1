// @flow
import * as React from 'react';
import { DomainImport } from '../../_components';
import { Card } from 'primereact/card';
import { PiramisContext } from '../../shared/piramis-context';

export default function DomainData() {
  const context: PiramisContextData = React.useContext(PiramisContext);
  return (
    <Card title={context.labels.get('domainData')}>
      <DomainImport
        onNotify={() => window.location.reload()}
        initialForm={{ domainData: context.domainData }}
      />
    </Card>
  );
}
