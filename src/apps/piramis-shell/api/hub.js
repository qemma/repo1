// @flow
import { Hub } from 'aws-amplify';
import { HUB_EVENTS } from '../../shared/const';

export default class HubService {
  dispatch = (channell: string, capsule: any, source: string) => {
    Hub.dispatch(channell, capsule, source);
  };

  growl = (
    severity: 'error' | 'warning' | 'info' | 'success',
    detail: string,
    summary: string,
    source?: string = 'hubevent'
  ) => {
    Hub.dispatch(HUB_EVENTS.GROWL, { severity, detail, summary }, source);
  };

  loading = (isLoading: boolean, source?: string = 'hubevent') => {
    Hub.dispatch(HUB_EVENTS.ISLOADING, { isLoading }, source);
  };

  log = (payload: any, source: string) => {
    Hub.dispatch(HUB_EVENTS.LOG, payload, source);
  };

  listen = async (channell: string, listener: Object, listenerName: string) => {
    Hub.listen(channell, listener, listenerName);
  };

  checkCurrentSession = (source?: string = 'generic') => {
    Hub.dispatch(HUB_EVENTS.AUTHCHANNELL, { checkSession: true }, source);
  };

  remove = (channel: string, listener: Object, listenerName: string) => {
    Hub.remove(channel, listener, listenerName);
  };
}
