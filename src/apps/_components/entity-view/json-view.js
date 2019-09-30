// @flow
import * as React from 'react';
import { Button } from 'primereact/button';
import ModalContainer from '../modals';
import { JsonEditor as Editor } from 'jsoneditor-react';
// $FlowIgnore: require ace
import ace from 'brace';
// $FlowIgnore: require json
import 'brace/mode/json';
// $FlowIgnore: require theme
import 'brace/theme/github';

type Props = {
  style?: any,
  header: any,
  onOpen?: Function,
  tooltip: string,
  icon?: string,
  entity: any
};

// TODO: CONVERT TO FUNCTIONAL
class EntityJSONView extends React.Component<Props, { opened: boolean }> {
  static defaultProps: {
    style?: any,
    header: any,
    onOpen?: Function
  };

  state = { opened: false };

  onOpenDetails = () => {
    this.setState({ opened: true });
    this.props.onOpen && this.props.onOpen();
  };

  closeDetails = () => {
    this.setState({ opened: false });
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
          {this.props.entity && (
            <Editor
              mode="view"
              ace={ace}
              theme="ace/theme/github"
              navigationBar={false}
              allowedModes={['view']}
              value={this.props.entity}
            />
          )}
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

export default EntityJSONView;
