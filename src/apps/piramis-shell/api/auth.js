// @flow
import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import * as Const from '../../shared/const';
import moment from 'moment';

const AuthService = {
  signIn: async (username: string, password: string) => {
    return await Auth.signIn(username, password);
  },
  signOut: async () => {
    return await Auth.signOut({ global: true });
  },
  getCurrentSession: async () => {
    return await Auth.currentSession();
  },

  getCurrentUser: async () => {
    return await Auth.currentAuthenticatedUser();
  },

  verifyUser: async (username: string, code: string) => {
    return await Auth.confirmSignUp(username, code);
  },

  forgotPassword: async (username: string) => {
    return await Auth.forgotPassword(username);
  },

  resendUserVerificationCode: async (username: string) => {
    return await Auth.resendSignUp(username);
  },

  forgotPasswordSubmit: async (username: string, code: string, password: string) => {
    return await Auth.forgotPasswordSubmit(username, code, password);
  },

  completeNewPassword: async (username: string, password: string) => {
    return await Auth.completeNewPassword(username, password);
  },

  refreshUserDetails: async (username: string, updateUserLogin: boolean, culture: string) => {
    const userData = {
      uuid: username,
      category: Const.ITEM_CATEGORY.utente,
      username,
      domainsId: `${Const.PIRAMIS_DOMAINS_ID}-${culture}`,
      lastLoginDate: updateUserLogin
        ? moment()
            .utc()
            .toISOString()
        : undefined
    };
    const result = await API.put('piramisApi', `/admin/users/refreshuser`, {
      body: userData
    });
    return result;
  }
};
export default AuthService;
