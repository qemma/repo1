// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'primereact/button';
import ReactToPrint from 'react-to-print';

type Props = {
  visible: boolean,
  onClose: Function | null,
  width?: string,
  height?: string,
  children: any,
  header: any,
  closeOnOutside?: boolean,
  hidePrint?: boolean
};

const ModalContainer = (props: Props & { onClickOutside: Function }) => {
  let componentRef: any;
  const { visible, onClose, children, width, height, onClickOutside, header } = props;
  if (!visible) return null;
  return (
    <div
      className="fixed pin-t pin-r pin-b pin-l z-xxl bg-modal-bg"
      id="modalContainer"
      role="presentation"
      onClick={onClickOutside}
    >
      <div
        id="modal-content"
        className="fixed flex z-xxl p-4 border-solid border border-grey bg-white"
        style={{
          top: '50%',
          left: '50%',
          width: width || '80%',
          height: height || '80%',
          maxHeight: '100%',
          maxWidth: '100%',
          minHeight: '20%',
          minWhidth: '50%',
          transform: ' translate(-50%, -50%)'
        }}
      >
        <div className="flex flex-col bg-modal-bg w-full relative">
          <div className="w-full p-4 flex text-white bg-modal-bg font-bold">
            <div style={{ flex: 1 }}>{header}</div>
            <div>
              {!props.hidePrint && (
                <ReactToPrint
                  trigger={() => (
                    <Button
                      tooltip="print"
                      style={{ position: 'absolute', top: '8px', right: '50px' }}
                      className="p-button p-component p-button-secondary p-button-icon-only"
                      icon="fas fa-print"
                    />
                  )}
                  content={() => componentRef}
                />
              )}
              <i className="far fa-times-circle close-modal" onClick={onClose} />
            </div>
          </div>
          <div className="flex flex-1 bg-white p-4 overflow-y-auto" ref={el => (componentRef = el)}>
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalContainer.defaultProps = {
  width: '80%',
  height: '80%',
  header: ''
};

export default class ModalPortal extends React.Component<Props> {
  static defaultProps = {
    width: '80%',
    height: '80%',
    header: ''
  };

  static displayName = 'advanon modal';

  constructor(props: Props) {
    super(props);
    this.rootSelector = document.getElementsByTagName('body')[0];
    this.container = document.createElement('div');
  }

  componentDidMount() {
    if (this.rootSelector && this.container) {
      this.rootSelector.appendChild(this.container);
    }
  }

  componentWillUnmount() {
    if (this.rootSelector && this.container) {
      this.rootSelector.removeChild(this.container);
    }
  }

  onClickOutside = (e: any) => {
    e.persist();
    if (e.target.id === 'modalContainer' && this.props.onClose && this.props.closeOnOutside) {
      this.props.onClose(e);
    }
  };

  rootSelector: HTMLElement | null;
  container: HTMLElement | null;

  render() {
    if (!this.container) return null;
    return ReactDOM.createPortal(
      <ModalContainer {...this.props} onClickOutside={this.onClickOutside} />,
      this.container
    );
  }
}
