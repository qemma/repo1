// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import LoginForm from './loginForm';
import VerifyUser from './verifyUser';
import ForgotPassword from './forgotPassword';
import RequireNewPassword from './requireNewPassword';
import { AuthStatuses } from '../store/auth';
import SplashScreen from './splash-screen';

const withAuthenticator = (WrappedComponent: any) => {
  const loginComponent = class extends React.Component<any> {
    componentDidMount() {
      this.props.store.auth.checkCurrentSession();
    }

    onForgotPassword = () => {
      this.props.store.auth.setAuthState(AuthStatuses.ForgotPassword, true);
    };

    onResetAuthState = () => {
      this.props.store.auth.setAuthState(AuthStatuses.NotAuthenticated, true);
    };

    render() {
      const { auth, labels } = this.props.store;
      switch (auth.authState) {
        case AuthStatuses.Authenticated:
          return <WrappedComponent {...this.props} />;
        case AuthStatuses.NotAuthenticated:
          return (
            <LoginForm
              loading={auth.loading}
              labels={labels}
              error={auth.error}
              onForgotPassword={this.onForgotPassword}
              onSignIn={auth.signIn}
            />
          );
        case AuthStatuses.LoggingOut:
          return <div>See you soon!.....</div>;
        case AuthStatuses.UserNotConfirmed:
          return (
            <VerifyUser
              labels={labels}
              loading={auth.loading}
              username={auth.username}
              error={auth.error}
              onVerifyUser={auth.verifyUser}
              onResendCode={auth.resendUserVerificationCode}
            />
          );
        case AuthStatuses.ResetPassword:
          return (
            <RequireNewPassword
              loading={auth.loading}
              labels={labels}
              username={auth.username}
              newPasswordChallengeUser={auth.newPasswordChallengeUser}
              error={auth.error}
              completeNewPassword={auth.completeNewPassword}
            />
          );
        case AuthStatuses.ForgotPassword:
        case AuthStatuses.ForgotPasswordSubmit:
          return (
            <ForgotPassword
              labels={labels}
              loading={auth.loading}
              submit={auth.authState === AuthStatuses.ForgotPasswordSubmit}
              error={auth.error}
              username={auth.username}
              onSubmitNewPassword={auth.forgotPasswordSubmit}
              onResetPassword={auth.forgotPassword}
              onCancel={this.onResetAuthState}
            />
          );
        case AuthStatuses.NotSet:
          return <SplashScreen loading />;
        default:
          return null;
      }
    }
  };

  return inject('store')(observer(loginComponent));
};

export default withAuthenticator;
