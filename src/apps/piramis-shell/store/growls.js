// @flow
import { observable, decorate } from 'mobx';
import { queueProcessor } from 'mobx-utils';
import uniqueId from 'uniqid';
import { HUB_EVENTS } from '../../shared/const';

class GrowlStore {
  hub: any;
  growls: any;
  activeGrowl: { id: string };
  stop: any;
  hub: any;
  constructor(hub) {
    this.hub = hub;
    this.growls = observable([]);
    this.activeGrowl = { id: '0000' };
    this.stop = queueProcessor(this.growls, growl => {
      this.activeGrowl = { ...growl, id: uniqueId() };
    });
    this.hub.listen(HUB_EVENTS.GROWL, this, 'GROWLListener');
  }

  growl = (severity, detailKey, summaryKey) => {
    this.growls.push({ severity, detail: detailKey, summary: summaryKey });
  };

  onHubCapsule(capsule) {
    const { channel, payload } = capsule;
    if (channel === HUB_EVENTS.GROWL) {
      this.growls.push(payload);
    }
  }
}

export default decorate(GrowlStore, {
  activeGrowl: observable
});
