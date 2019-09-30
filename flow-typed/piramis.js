declare interface IEntity {
  updateDate: string;
  parentId: string;
  updatedBy: string;
  creationDate: string;
  isActive: boolean;
  uuid: string;
  status: string;
  itemId: string;
  hierarchyId: string;
  isDeleted: boolean;
  category: string;
  group: any;
  createdBy?: string;
  roles?: string;
}

declare type PiramisHub = {
  loading: (isLoading: boolean, source?: string) => void,
  growl: (
    severity: 'error' | 'warn' | 'info' | 'success',
    detail: string,
    summary: string,
    source?: string
  ) => void,
  listen: Function,
  remove: (channel: string, listener: Object, listenerName: string) => void,
  log: (payload: any, source: string) => void,
  dispatch: (channell: string, capsule: any, source?: string) => void,
  checkCurrentSession: (?string) => void
};

declare interface IGisApi {
  login: () => Object | false;

  getDevice: (imei: string) => Object | false;

  getLastPosition: (id: number) => Object | false;

  setDevice: (number: string, timeout: number) => Promise<boolean>;
  smsCommand: (deviceNumber: string, command: string) => Promise<boolean>;

  createDevice: (imei: string, phone: string, name: string, category: string) => Object | false;

  sendComand: (
    deviceId: number,
    data: string,
    description: string,
    textChannel: boolean
  ) => Object | false;

  getMakes: () => Promise<any>;
  getModels: (input: { CodiceMarca: string, Alimentazione: string }) => Promise<any>;
  getPreparations: (input: { CodiceModello: string }) => Promise<any>;
  getFromPlate: (plate: string) => Promise<any>;
  getPlateAnagrafica: (codInfocarAM: string) => Promise<any>;
}

declare type Options = {
  sort?: Array<any>,
  filters?: any,
  size?: number,
  from?: number
};

declare type Result = {
  items: Array<IEntity>,
  children: Array<IEntity>,
  related: Array<IEntity>,
  groups: Array<IEntity>,
  parents: Array<IEntity>,
  total: number,
  childrenBag: any,
  parentsBag: any
};

declare type EntityService = {
  search: (options: Options) => Promise<Result>,
  put: (entities: Array<IEntity>) => Promise<Array<any>>,
  getGroup: string => Promise<Array<IEntity>>,
  esProxy: (options: Options) => any,
  deleteEntity: (IEntity: any) => void,
  upload: (blob: Blob, key: string, onUpload?: Function) => any,
  download: (key: string) => any,
  delFile: (key: string) => any,
  putRecall: (model: any, vehicle: any, recall: any) => any,
  closeRecall: (closeData: any, vehicle: any, recall: any) => any,
  getMatchingVehicles: (criteria: any, hierarchy: string) => any
};

declare type Localizer = {
  get: (id: string) => string
};

declare type DomainItem = {
  label: string,
  value: string
};

declare type Domaindata = {
  devicesType: Array<DomainItem>,
  suppliers: Array<DomainItem>,
  carriers: Array<DomainItem>,
  simTypes: Array<DomainItem>,
  vehicleTypes: Array<DomainItem>,
  alimentazione: Array<DomainItem>,
  appSettings: {
    gisUrl: string,
    gisToken: string,
    gisWs: string,
    satLimit: number,
    fullPositionDetails?: boolean,
    lastPositionInterval: number,
    infocarUser: string,
    infocarPassword: string
  },
  regioni: Array<{ nome: string, province: Array<string> }>
};

declare type UserService = {
  create: (user: any) => any,
  action: (user: any, action: string) => any
};

declare type PiramisContextData = {
  hub: PiramisHub,
  entityService: EntityService,
  labels: Localizer,
  user: any,
  domainData: Domaindata,
  usersService: UserService,
  root: string,
  menuPlaceholder: string,
  fullReindex?: Function,
  gisApi: IGisApi
};

declare type PiramisAppContext = PiramisContextData & {
  mountParcel: Function,
  singleSpa: Object
};

declare type GridAction = 'init' | 'paging' | 'sort' | 'filter' | 'refresh' | 'edit';

declare module 'react-to-print' {
  declare module.exports: any;
}
