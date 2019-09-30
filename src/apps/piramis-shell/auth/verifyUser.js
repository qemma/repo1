// @flow
import * as React from 'react';
import { decorate, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Alert } from '../../_components';

class VerifyUser extends React.Component<any> {
  code: ?string;
  constructor(props) {
    super(props);
    this.code = undefined;
  }

  changeCode = code => {
    this.code = code;
  };

  keypress = e => {
    e.key === 'Enter' && this.onVerify();
  };

  onVerify = () => {
    if (this.code) {
      this.props.onVerifyUser && this.props.onVerifyUser(this.props.username, this.code);
    }
  };

  resendCode = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onResendCode && this.props.onResendCode(this.props.username);
  };

  getErrors = (error, labels) => {
    return (
      <div>
        {error && (
          <Alert color="red" title={labels.get('error')} content={labels.get(error.message)} />
        )}
        {this.code === '' && (
          <Alert
            color="red"
            title={labels.get('error')}
            content={labels.get('verifyCodeValidationMessage')}
          />
        )}
      </div>
    );
  };

  render() {
    const { labels, error, loading } = this.props;
    return (
      <div className="piramis-login-form">
        <Card title={labels.get('verifyUser')} footer={this.getErrors(error, labels)}>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-unlock" />
            </span>
            <InputText
              onKeyPress={this.keypress}
              placeholder={labels.get('verificationCode')}
              value={this.code || ''}
              className={this.code === '' ? 'p-error' : ''}
              onChange={e => this.changeCode(e.target.value)}
            />
          </div>
          <div className="p-inputgroup">
            <Button
              disabled={loading}
              label={loading ? undefined : labels.get('confirm')}
              className="p-button-rounded"
              icon={loading ? 'pi pi-spin pi-spinner' : undefined}
              onClick={this.onVerify}
            />
          </div>
          <div className="p-inputgroup">
            <a className="active-menuitem" href="#sendcode" onClick={this.resendCode}>
              {labels.get('resendCode')}
            </a>
          </div>
        </Card>
      </div>
    );
  }
}

export default observer(
  decorate(VerifyUser, {
    code: observable,
    changeCode: action
  })
);
