// @flow
import AuthStore from './auth';
import LayoutStore from './layout';
import LogsStore from './logger';
import LocalizationStore from './localization';
import { PIRAMIS_ENTITY_CHANGE_HEADER, HUB_EVENTS } from '../../shared/const';
import { decorate, action, configure, observable } from 'mobx';
import GrowlStore from './growls';
import axios from 'axios';

configure({ enforceActions: 'always', isolateGlobalState: true });

class ShellStore {
  loading: boolean;
  auth: any;
  layout: any;
  growls: any;
  logger: any;
  dangerZone: any;
  hub: PiramisHub;
  culture: string;
  labels: Localizer;
  entityService: EntityService;
  usersService: UserService;
  tokenProvider: { getToken: () => string };

  constructor(
    hub,
    logService,
    authService,
    entityService,
    usersService,
    tokenProvider,
    dangerZoneService,
    culture
  ) {
    this.culture = culture;
    this.loading = false;
    this.hub = hub;
    this.entityService = entityService;
    this.usersService = usersService;
    this.tokenProvider = tokenProvider;
    this.hub.listen(HUB_EVENTS.ISLOADING, this, 'ISLOADING');
    this.dangerZone = dangerZoneService;

    // cross cutting concern stores
    this.auth = new AuthStore(authService, this.hub, this.entityService, culture);
    this.layout = new LayoutStore();
    this.growls = new GrowlStore(this.hub);
    this.logger = new LogsStore(logService, this.hub);
    this.labels = new LocalizationStore(culture);
    this.setupApiResponses();
  }

  onHubCapsule(capsule) {
    const { channel, payload } = capsule;
    if (channel === HUB_EVENTS.ISLOADING) {
      this.setLoading(payload.isLoading);
    }
  }

  setLoading = isLoading => {
    this.loading = isLoading;
  };

  fullReindex = async () => {
    try {
      this.hub.loading(true);
      await this.dangerZone.fullReindex();
    } finally {
      this.hub.loading(false);
    }
  };

  setupApiResponses = () => {
    // Add latest auth access token to every http request
    axios.interceptors.request.use(async config => {
      try {
        const token = await this.tokenProvider.getToken();
        (config.headers: any).Authorization = token;
        return config;
      } catch (error) {
        this.hub.dispatch(HUB_EVENTS.AUTHCHANNELL, { unauthorized: true }, 'getJwtToken');
        return config;
      }
    });

    axios.interceptors.response.use(
      response => {
        if (response.data && response.data.errors) {
          this.hub.growl(
            'error',
            this.labels.get('apiCallError'),
            this.labels.get('apiErrorTitle'),
            'apicall'
          );
        } else if ((response.config.headers: any)[PIRAMIS_ENTITY_CHANGE_HEADER]) {
          //if this header is present it means that a service call changed the data so we'll notify of
          //the success of the operation
          this.hub.growl(
            'success',
            this.labels.get('successAction'),
            this.labels.get('apiSuccessTitle'),
            'apicall'
          );
        }
        return Promise.resolve(response);
      },
      error => {
        if ((error.config: any).path.indexOf('logs') >= 0) {
          return;
        }
        if (error.response && error.response.status === '401') {
          this.hub.dispatch(HUB_EVENTS.AUTHCHANNELL, { unauthorized: true }, 'getJwtToken');
        }

        this.hub.log(
          {
            message: error.message,
            stack: error.stack,
            response: error.response
          },
          'apiCallError'
        );

        if (error.response && error.response.data && error.response.data.statusCode === 400) {
          this.hub.growl('warn', error.response.data.message, error.response.data.code, 'apicall');
        } else {
          this.hub.growl(
            'error',
            this.labels.get('apiCallError'),
            this.labels.get('apiErrorTitle'),
            'apicall'
          );
        }
        return Promise.reject(error.response && error.response.data ? error.response.data : error);
      }
    );
  };
}

export default decorate(ShellStore, {
  loading: observable,
  setLoading: action
});
