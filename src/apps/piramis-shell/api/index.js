// @flow
import { Auth } from 'aws-amplify';
import AuthService from './auth';
import HubService from './hub';
import EntityService from './entity';
import LogService from './log';
import UserService from './users';
import DangerZoneService from './danger-zone';
// import { PIRAMIS_ENTITY_CHANGE_HEADER, HUB_EVENTS } from '../../shared/const';
// import axios from 'axios';

const services = {
  AuthService,
  HubService,
  EntityService,
  UserService,
  LogService,
  DangerZoneService,
  TokenProvider: {
    //used by sendBeacon or request that needs token in querystring
    getToken: async () => {
      const session = await Auth.currentSession();
      return session.idToken.jwtToken;
    }
  }
};

export default services;
