// @flow
import * as React from 'react';
type Props = {
  message?: string,
  name: string,
  children: any
};
export default class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      const message = this.props.message;
      return (
        <div className="alert alert-danger" role="alert">
          <strong>Error!</strong> {message || `app section ${this.props.name} not available`}
        </div>
      );
    }
    return this.props.children;
  }
}
