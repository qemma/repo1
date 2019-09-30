// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'primereact/button';
import ReactToPrint from 'react-to-print';
import { AppLoading } from '../../_components';

export default inject('store')(
  observer((props: { title: string, store: any, printingArea: any }) => (
    <div className="layout-topbar clearfix">
      <AppLoading loading={props.store.loading} />
      <h1>{props.title}</h1>
      <ReactToPrint
        trigger={() => (
          <Button
            style={{ position: 'absolute', right: '10px' }}
            tooltip="print"
            className="p-button p-component p-button-secondary p-button-icon-only"
            icon="fas fa-print"
          />
        )}
        content={() => props.printingArea}
      />
    </div>
  ))
);
