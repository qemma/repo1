// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '../_components';
import { PiramisProvider } from '../shared/piramis-context';
import { AppMenu } from '../_components';

class AppContainer extends React.Component<
  PiramisAppContext & { routes: Array<any>, name: string },
  { crashed: boolean }
> {
  state = { crashed: false };
  componentDidCatch(error: any, info: any) {
    this.setState({ crashed: true });
    this.props.hub.log({ error, info }, `APPCRASH-${this.props.name.toUpperCase()}`);
  }

  getMenu = () => {
    return ReactDOM.createPortal(
      <AppMenu model={this.props.routes} />,
      (document.getElementById(this.props.menuPlaceholder): any)
    );
  };

  render() {
    return (
      <div>
        {this.getMenu()}
        <PiramisProvider {...this.props}>
          <Router
            routingTable={this.props.routes}
            labels={this.props.labels}
            hub={this.props.hub}
          />
        </PiramisProvider>
      </div>
    );
  }
}

export default AppContainer;
