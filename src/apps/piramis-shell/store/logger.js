// @flow
import { observable } from 'mobx';
import { chunkProcessor } from 'mobx-utils';
import { onError } from 'mobx-react';
import { HUB_EVENTS } from '../../shared/const';

export default class LogsStore {
  hub: any;
  logs: any;
  stop: any;
  logService: any;
  constructor(logService: any, hub: any) {
    this.hub = hub;
    const pendingLogs = this.getPendingLogs();

    this.logs = observable(pendingLogs);

    this.stop = chunkProcessor(
      this.logs,
      chunkOfMax10Items => {
        this.sendLogs(chunkOfMax10Items);
      },
      10000,
      10
    );
    this.logService = logService;
    this.hub.listen(HUB_EVENTS.LOG, this, 'LogListener');
    //mobx-react related errors
    onError(error => {
      this.hub.log({ data: error }, 'MobxErrorHandler');
    });

    window.addEventListener('error', event => {
      this.hub.log(
        { data: { message: event.error.message, stack: event.error.stack } },
        'GlobalErrorHandler'
      );
    });

    window.addEventListener('unload', event => {
      this.stop();
    });
  }

  getPendingLogs = () => {
    try {
      const pendingLogs = localStorage.getItem('pendingLogs');
      localStorage.removeItem('pendingLogs');
      return pendingLogs ? JSON.parse(pendingLogs) : [];
    } catch (error) {
      return [];
    }
  };

  log = (payload: any, source: string) => {
    this.hub.log({ data: payload }, source);
  };

  sendLogs = (logs: any) => {
    this.logService.sendLogs(logs);
  };

  onHubCapsule(capsule: { channel: string, payload: any }) {
    const { channel, payload } = capsule;
    if (channel === HUB_EVENTS.LOG) {
      const log = { channel, payload };
      this.logs.push(log);
    }
  }
}
