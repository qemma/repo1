// @flow
import * as React from 'react';
import { inject } from 'mobx-react';
import { reaction } from 'mobx';
import { Growl } from 'primereact/growl';

class Growls extends React.Component<{ store: any, position: string }> {
  reactionDisposer;
  growl: HTMLElement & { show: Function, clear: Function };
  constructor(props) {
    super(props);
    this.reactionDisposer = reaction(
      () => this.props.store.growls.activeGrowl,
      growl => {
        this.growl.clear();
        this.growl.show({
          severity: growl.severity,
          summary: growl.summary,
          detail: growl.detail,
          closable: true,
          life: 5000
        });
      }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

  render() {
    return (
      <Growl
        ref={(el: any) => (this.growl = el)}
        position={this.props.position || 'topright'}
        baseZIndex={50000}
      />
    );
  }
}

export default inject('store')(Growls);
