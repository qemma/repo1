// @flow
import { action, decorate, observable, flow, computed } from 'mobx';
import { ENTITY_STATUS } from '../../shared/const';
import { createHistory, printLabels } from '../../_components/utils';

class SimSatPairStore {
  entityService: EntityService;
  hub: PiramisHub;
  loading: boolean;
  printOpened: boolean;
  modalWarning: boolean;
  scans: Array<any>;
  data: any;
  step: number;
  totalNumberOfItems: number;
  constructor(entityService: EntityService, hub: PiramisHub) {
    this.entityService = entityService;
    this.reset();
    this.hub = hub;
  }

  reset = () => {
    this.loading = false;
    this.printOpened = false;
    this.scans = [];
    this.data = {};
    this.step = 0;
    this.modalWarning = false;
    this.totalNumberOfItems = 0;
  };

  onChangeTotDevices = e => {
    const newTot = Number(e.target.value);
    if (newTot >= this.scans.length) {
      this.totalNumberOfItems = newTot;
    }
  };

  toggleModalWarning = (opened: boolean) => {
    this.modalWarning = opened;
  };

  onScan = (value: string) => {
    if (this.scans.length < this.totalNumberOfItems) {
      this.scans = this.scans
        .filter(el => el.sn !== value)
        .concat({
          sn: value
        });
    } else if (!value.startsWith('8939')) {
      this.toggleModalWarning(true);
    } else {
      const alreadyPresent = this.scans.find(el => el.iccid === value);
      if (!alreadyPresent) {
        const missingIccIdIndex = this.scans.findIndex(el => !el.iccid);
        this.scans = this.scans.map((el, i) => {
          return i === missingIccIdIndex
            ? {
                ...el,
                iccid: value
              }
            : el;
        });
        if ([-1, this.scans.length - 1].includes(missingIccIdIndex)) {
          this.loadPairingData();
        }
      }
    }
  };

  removeScan = el => {
    if (this.loading) return;
    this.scans = this.scans.filter(item => item.sn !== el.sn);
    this.scans.length === 0 && this.selectStep(0);
  };

  selectStep = newStep => {
    this.step = newStep;
  };

  printLabels = (id, small = false) => {
    this.printOpened = true;
    printLabels(id, small);
  };

  loadPairingData = flow(
    function*() {
      this.loading = true;
      this.hub.loading(true);
      try {
        this.data = yield this.entityService.search({
          from: 0,
          size: 2 * this.scans.length,
          filters: {
            iccid: {
              or: true,
              matchMode: 'terms',
              value: this.scans.map(el => el.iccid)
            },
            sn: {
              or: true,
              matchMode: 'terms',
              value: this.scans.map(el => el.sn)
            }
          }
        });
        this.selectStep(1);
      } finally {
        this.hub.loading(false);
        this.loading = false;
      }
    }.bind(this)
  );

  onSaveData = flow(
    function*() {
      try {
        this.loading = true;
        this.hub.loading(true);
        const entities: any = this.summary.reduce((acc, current) => {
          const history = createHistory(
            current.sat,
            `Pronto per la spedizione: abbinato a sim ${current.sim.uuid}`,
            ''
          );

          const pairedSat = {
            ...current.sat,
            tel: current.sim.tel,
            iccid: current.sim.iccid,
            status: ENTITY_STATUS.readyForDelivery
          };

          const pairedSim = {
            ...current.sim,
            parentId: current.sat.uuid,
            imei: pairedSat.imei,
            status: ENTITY_STATUS.paired
          };

          return acc.concat([history, pairedSat, pairedSim]);
        }, []);

        const result = yield this.entityService.put(entities);
        !result.errors && this.selectStep(2);
      } finally {
        this.loading = false;
        this.hub.loading(false);
      }
    }.bind(this)
  );

  get summary() {
    if (!this.data || !this.data.items) return [];
    const items = this.data.items;
    return this.scans.map(entry => {
      const sim = items.find(el => String(el.iccid) === String(entry.iccid));
      const sat = items.find(el => String(el.sn) === String(entry.sn));
      return {
        ...entry,
        sat: sat || {},
        sim: sim || {},
        validationError:
          (!sat && !sim && 'missingSatSim') ||
          (!sat && 'missingSat') ||
          (!sim && 'missingSim') ||
          (sat.status !== ENTITY_STATUS.inserted &&
            sim.status !== ENTITY_STATUS.inserted &&
            'wrongSatSimStatus') ||
          (sat.status !== ENTITY_STATUS.inserted && 'wrongSatStatus') ||
          (sim.status !== ENTITY_STATUS.inserted && 'wrongSimStatus')
      };
    });
  }

  get isValid() {
    if (!this.summary || !this.summary.length) return false;
    return this.summary.filter(el => el.validationError).length === 0;
  }
}

export default decorate(SimSatPairStore, {
  data: observable,
  scans: observable,
  printOpened: observable,
  modalWarning: observable,
  loading: observable,
  totalNumberOfItems: observable,
  step: observable,
  removeScan: action,
  selectStep: action,
  toggleModalWarning: action,
  reset: action,
  pairSatWithSim: action,
  loadPairingData: action,
  summary: computed,
  isValid: computed
});
