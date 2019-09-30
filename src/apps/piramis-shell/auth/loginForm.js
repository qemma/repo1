// @flow
import * as React from 'react';
import { decorate, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Alert } from '../../_components';

class LoginForm extends React.Component<any> {
  username = '';
  password = '';
  errors = {
    username: false,
    password: false
  };

  changePassword = password => {
    this.password = password;
    this.errors = {
      ...this.errors,
      password: !password
    };
  };

  changeUsername = username => {
    this.username = username;
    this.errors = {
      ...this.errors,
      username: !username
    };
  };

  keypress = e => {
    e.key === 'Enter' && this.onSignIn();
  };

  onSignIn = () => {
    if (this.username && this.password) {
      this.errors = {
        username: false,
        password: false
      };
      this.props.onSignIn && this.props.onSignIn(this.username, this.password);
    } else {
      this.errors = {
        username: !this.username,
        password: !this.password
      };
    }
  };

  onForgotPassword = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onForgotPassword && this.props.onForgotPassword();
  };

  getErrors = (error, labels) => {
    return (
      <div>
        {error && (
          <Alert color="red" title={labels.get('error')} content={labels.get(error.message)} />
        )}

        {(this.errors.username || this.errors.password) && (
          <Alert
            color="red"
            title={labels.get('error')}
            content={labels.get('loginValidationMessage')}
          />
        )}
      </div>
    );
  };

  render() {
    const { labels, error, loading } = this.props;

    return (
      <div className="piramis-login-form">
        <Card title={labels.get('loginTitle')} footer={this.getErrors(error, labels)}>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user" />
            </span>
            <InputText
              placeholder={labels.get('username')}
              value={this.username}
              onKeyPress={this.keypress}
              className={this.errors.username ? 'p-error' : ''}
              onChange={e => this.changeUsername(e.target.value)}
            />
          </div>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock" />
            </span>
            <Password
              autoComplete="new-password"
              feedback={false}
              onKeyPress={this.keypress}
              placeholder={labels.get('password')}
              value={this.password}
              className={this.errors.password ? 'p-error' : ''}
              onChange={e => this.changePassword(e.target.value)}
            />
          </div>
          <div className="p-inputgroup">
            <Button
              disabled={loading}
              label={loading ? undefined : labels.get('login')}
              className="p-button-rounded"
              icon={loading ? 'pi pi-spin pi-spinner' : undefined}
              onClick={this.onSignIn}
            />
          </div>
          <div className="p-inputgroup">
            <a className="active-menuitem" href="#sendcode" onClick={this.onForgotPassword}>
              {labels.get('forgotPassword')}
            </a>
          </div>
        </Card>
      </div>
    );
  }
}

export default observer(
  decorate(LoginForm, {
    username: observable,
    password: observable,
    errors: observable,
    changeUsername: action,
    changePassword: action
  })
);
