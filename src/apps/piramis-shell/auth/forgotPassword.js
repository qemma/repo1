// @flow
import React from 'react';
import { decorate, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Alert } from '../../_components';

class ForgotPassword extends React.Component<any> {
  email: string;
  code: ?string;
  password: ?string;
  constructor(props) {
    super(props);
    this.email = props.username;
    this.code = undefined;
    this.password = undefined;
  }

  changeEmail = email => {
    this.email = email;
  };

  forgotPswKeypress = e => {
    e.key === 'Enter' && this.onResetPassword();
  };

  onResetPassword = () => {
    if (this.email) {
      this.props.onResetPassword && this.props.onResetPassword(this.email);
    }
  };

  changePassword = password => {
    this.password = password;
  };

  changeCode = code => {
    this.code = code;
  };

  submitPswKeypress = e => {
    e.key === 'Enter' && this.submitNewPassword();
  };

  submitNewPassword = () => {
    this.props.onSubmitNewPassword &&
      this.props.onSubmitNewPassword(this.email, this.code, this.password);
  };

  getErrors = (error, labels) => {
    return (
      <div>
        {error && (
          <Alert color="red" title={labels.get('error')} content={labels.get(error.message)} />
        )}
        {((this.email === '' && !this.props.submit) ||
          ((this.code === '' || this.password === '') && this.props.submit)) && (
          <Alert color="red" title={labels.get('error')} content={labels.get('emailMandatory')} />
        )}
      </div>
    );
  };

  renderForgotPassword = () => {
    const { labels, error, loading, onCancel } = this.props;
    return (
      <Card title={labels.get('forgotPasswordTitle')} footer={this.getErrors(error, labels)}>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user" />
          </span>
          <InputText
            placeholder={labels.get('email')}
            value={this.email || ''}
            onKeyPress={this.forgotPswKeypress}
            className={this.email === '' ? 'p-error' : ''}
            onChange={e => this.changeEmail(e.target.value)}
          />
        </div>
        <div className="p-grid p-inputgroup">
          <div className="p-col-6">
            <Button
              disabled={loading}
              label={loading ? undefined : labels.get('confirm')}
              className="p-button-rounded"
              icon={loading ? 'pi pi-spin pi-spinner' : undefined}
              onClick={this.onResetPassword}
            />
          </div>
          <div className="p-col-6">
            <Button
              disabled={loading}
              label={labels.get('cancel')}
              className="p-button-rounded"
              onClick={onCancel}
            />
          </div>
        </div>
      </Card>
    );
  };

  renderSubmitPassword = () => {
    const { labels, error, loading } = this.props;
    return (
      <Card
        title={labels.get('submitPasswordTitle')}
        subTitle={labels.get('submitPasswordSubTitle')}
        footer={this.getErrors(error, labels)}
      >
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-unlock" />
          </span>
          <InputText
            placeholder={labels.get('verificationCode')}
            value={this.code || ''}
            onKeyPress={this.submitPswKeypress}
            className={this.code === '' ? 'p-error' : ''}
            onChange={e => this.changeCode(e.target.value)}
          />
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock" />
          </span>
          <Password
            autoComplete="new-password"
            feedback={false}
            onKeyPress={this.submitPswKeypress}
            placeholder={labels.get('password')}
            value={this.password || ''}
            className={this.password === '' ? 'p-error' : ''}
            onChange={e => this.changePassword(e.target.value)}
          />
        </div>

        <div className="p-grid p-inputgroup">
          <Button
            disabled={loading}
            label={loading ? undefined : labels.get('confirm')}
            className="p-button-rounded"
            icon={loading ? 'pi pi-spin pi-spinner' : undefined}
            onClick={this.submitNewPassword}
          />
        </div>
      </Card>
    );
  };

  render() {
    return (
      <div className="piramis-login-form">
        {this.props.submit ? this.renderSubmitPassword() : this.renderForgotPassword()}
      </div>
    );
  }
}

export default observer(
  decorate(ForgotPassword, {
    email: observable,
    code: observable,
    password: observable,
    changeCode: action,
    changePassword: action,
    changeEmail: action
  })
);
