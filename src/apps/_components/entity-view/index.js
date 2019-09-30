// @flow
import * as React from 'react';
import { Button } from 'primereact/button';
import ModalContainer from '../modals';

const ViewField = (props: { field: { label: string, value: any } }) => (
  <div className="flex mt-1 w-full">
    <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
      {props.field.label}
    </div>
    <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
      {props.field.value}
    </div>
  </div>
);

export const View = (props: { fields: Array<{ label: string, value: any }> }) => (
  <div>
    {props.fields.map((field, i) => (
      <ViewField key={i} field={field} />
    ))}
  </div>
);

type Props = {
  style?: any,
  header: any,
  onOpen?: Function,
  tooltip: string,
  icon?: string,
  fields: Array<{ label: string, value: any }>,
  children?: (entity: any, closeDetails: Function) => React.Node
};

// TODO: CONVERT TO FUNCTIONAL
class EntityView extends React.Component<Props, { opened: boolean }> {
  static defaultProps: {
    style?: any,
    header: any,
    onOpen?: Function,
    children?: (closeDetails: Function) => React.Node
  };

  state = { opened: false };

  onOpenDetails = () => {
    this.setState({ opened: true });
    this.props.onOpen && this.props.onOpen();
  };

  closeDetails = () => {
    this.setState({ opened: false });
  };

  renderView = (opened: boolean) => {
    if (!opened) return null;
    return (
      <div>
        <View fields={this.props.fields} />
        {this.props.children && this.props.children(this.closeDetails)}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <ModalContainer
          onClose={this.closeDetails}
          visible={this.state.opened}
          height="auto"
          header={this.props.header}
          width="90%"
        >
          {this.renderView(this.state.opened)}
        </ModalContainer>
        <Button
          style={this.props.style}
          tooltip={this.props.tooltip}
          className="p-button p-component p-button-secondary p-button-icon-only"
          icon={this.props.icon || 'fas fa-eye'}
          onClick={this.onOpenDetails}
        />
      </React.Fragment>
    );
  }
}

export default EntityView;
