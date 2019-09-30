// @flow
import React from 'react';
import { decorate, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Alert } from '../../_components';

class RequireNewPassword extends React.Component<any> {
  password: ?string;
  constructor(props) {
    super(props);
    this.password = undefined;
  }

  completeNewPassword = () => {
    this.props.completeNewPassword &&
      this.props.completeNewPassword(
        this.props.newPasswordChallengeUser,
        this.password,
        this.props.username
      );
  };

  keypress = e => {
    e.key === 'Enter' && this.completeNewPassword();
  };

  changePassword = password => {
    this.password = password;
  };

  getErrors = (error, labels) => {
    return (
      <div>
        {error && (
          <Alert color="red" title={labels.get('error')} content={labels.get(error.message)} />
        )}
        {this.password === '' && (
          <Alert
            color="red"
            title={labels.get('error')}
            content={labels.get('passwordMandatory')}
          />
        )}
      </div>
    );
  };

  render() {
    const { labels, error, loading } = this.props;
    return (
      <div className="piramis-login-form">
        <Card
          title={labels.get('submitPasswordTitle')}
          subTitle={labels.get('newPasswordRequest')}
          footer={this.getErrors(error, labels)}
        >
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock" />
            </span>
            <Password
              autoComplete="new-password"
              feedback={false}
              onKeyPress={this.keypress}
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
              onClick={this.completeNewPassword}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default observer(
  decorate(RequireNewPassword, {
    password: observable,
    changePassword: action
  })
);
