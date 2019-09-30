// @flow
import * as React from 'react';
import { Router } from 'director/build/director';
import { observer } from 'mobx-react';
import { observable, action, decorate } from 'mobx';
import { BreadCrumb } from 'primereact/breadcrumb';
import ErrorBoundary from '../errorBoundary';

type Props = {
  labels: Localizer,
  hub: PiramisHub
};
class PiramisRouter extends React.Component<Props> {
  paramRegex: RegExp;
  routingTable: { [string]: () => void };
  router: Router;

  constructor(props) {
    super(props);
    // eslint-disable-next-line
    this.paramRegex = /\/(:([^\/?]*)\??)/g;
    this.routingTable = this.getRoutingTable(props);
    this.router = new Router(this.getRoutingTable(props));
    this.router.configure({
      notfound: this.routingTable.notfound,
      html5history: false
    });
  }

  Component = null;

  changeRoute = async (route, ...params) => {
    await this.props.hub.checkCurrentSession('router-change-route');
    const routingParams = this.getParamsObject(params, this.paramRegex, route.route);
    const Component = route.component;
    this.Component = (
      <div>
        <div className="breadcrumbs-container" key="breadcrumb">
          <BreadCrumb
            model={route.breadcrumbs ? route.breadcrumbs(this.props.labels) : []}
            home={{ icon: 'pi pi-home', url: '#/' }}
          />
        </div>
        <div className="breadcrumbs-container" key="routerContainer">
          <Component routingParams={routingParams} key={window.location.hash || route.route} />
        </div>
      </div>
    );
    route.event && this.props.hub.dispatch(route.event, { route, routingParams }, 'navigation');
  };

  getParamsObject = (paramsArray, paramRegex, route) => {
    const params = [];
    this.getRegexMatches(
      route,
      paramRegex,
      // eslint-disable-next-line
      ([fullMatch, paramKey, paramKeyWithoutColon]) => {
        params.push(paramKeyWithoutColon);
      }
    );

    const result = paramsArray.reduce((obj, paramValue, index) => {
      obj[params[index]] = paramValue;
      return obj;
    }, {});

    return result;
  };

  getRegexMatches = (string, paramRegex, callback: Function) => {
    let match;
    while ((match = paramRegex.exec(string)) !== null) {
      callback(match);
    }
  };

  getRoutingTable = (props): { [string]: () => void } => {
    return props.routingTable.reduce((acc, next) => {
      return {
        ...acc,
        [next.route]: (...params) => {
          this.changeRoute(next, ...params);
        }
      };
    }, {});
  };

  componentDidMount() {
    this.router.init('/');
  }

  render() {
    return (
      <ErrorBoundary
        name="routerErrorHandler"
        message={this.props.labels.get(`pagina momentaneamente non disponibile`)}
      >
        {this.Component}
      </ErrorBoundary>
    );
  }
}

export default observer(
  decorate(PiramisRouter, {
    Component: observable,
    changeRoute: action
  })
);
