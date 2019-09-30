// @flow
import * as React from 'react';
import { getRoutes } from './config';
import AppContainer from '../shared/app-container';
import { Alert } from '../_components';

export default class Agente extends React.Component<PiramisAppContext, { hasError: boolean }> {
  routes = getRoutes(this.props.root, this.props.labels, this.props.user);
  state = { hasError: false };

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) {
      return (
        <Alert
          color="red"
          title={this.props.labels.get('error')}
          content={
            <p>
              {this.props.labels.get(
                "si e' verificato un errore inaspettato. Si prega di riprovare e segnalare il problema"
              )}
            </p>
          }
        />
      );
    }
    return <AppContainer {...this.props} routes={this.routes} name="agente" />;
  }
}
