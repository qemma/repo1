//@flow
import { action, decorate, observable, flow } from 'mobx';

class EntityImportStore {
  entityImportService: EntityService;
  hub: PiramisHub;
  loading: boolean;
  result: any;
  existing: any;
  rowsToImport: any;
  constructor(entityImportService: EntityService, hubService: PiramisHub) {
    this.entityImportService = entityImportService;
    this.loading = false;
    this.hub = hubService;
    this.result = undefined;
    this.existing = undefined;
    this.rowsToImport = undefined;
  }

  reset = (initialData, dataAdapter) => {
    this.loading = false;
    this.rowsToImport =
      initialData && dataAdapter ? dataAdapter(initialData) : initialData || undefined;
    this.result = undefined;
    this.existing = undefined;
  };

  import = flow(
    function*(data) {
      this.loading = true;
      this.hub.loading(true);
      this.result = undefined;
      try {
        this.result = yield this.entityImportService.put(data.filter(el => !el.existing));
      } finally {
        this.hub.loading(false);
        this.loading = false;
      }
    }.bind(this)
  );

  updateRowsToImport = flow(
    function*(data, dataAdapter, chekExisting) {
      try {
        this.loading = true;
        let records = data && dataAdapter ? dataAdapter(data) : data || [];
        if (chekExisting) {
          const existingResults = yield this.entityImportService.search({
            from: 0,
            size: records.length,
            type: 'terms',
            field: 'uuid',
            value: records.map(el => el.uuid)
          });
          this.existing = existingResults.items;
        }

        records = records.map(item => {
          const exist = (this.existing || []).find(el => el.uuid === item.uuid);
          return exist ? { ...exist, existing: true } : item;
        });

        this.rowsToImport = records;
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );
}

export default decorate(EntityImportStore, {
  loading: observable,
  result: observable,
  rowsToImport: observable,
  updateRowsToImport: action,
  import: action,
  reset: action
});
