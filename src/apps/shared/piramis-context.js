// @flow
import * as React from 'react';

export const PiramisContext: React.Context<any> = React.createContext();

export class PiramisProvider extends React.Component<PiramisContextData & { children: any }> {
  render() {
    return (
      <PiramisContext.Provider value={{ ...this.props, children: undefined }}>
        {this.props.children}
      </PiramisContext.Provider>
    );
  }
}

export const withContext = (WrappedComponent: any) => {
  return class extends React.Component<any> {
    getwrappedInstance() {
      return WrappedComponent;
    }
    render() {
      return (
        <PiramisContext.Consumer>
          {(piramisContext: PiramisContextData) => (
            <WrappedComponent context={piramisContext} {...this.props} />
          )}
        </PiramisContext.Consumer>
      );
    }
  };
};
