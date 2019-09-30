export const PIRAMIS_ROLES = {
  dealer: "dealer",
  marketing: "marketing",
  venditore: "venditore",
  "centrale operativa": "centrale operativa",
  admin: "admin",
  collaudo: "collaudo",
  superadmin: "superadmin",
  logistica: "logistica",
  agente: "agente",
  service: "service"
};
export const ITEM_CATEGORY = {
  device: "device",
  sim: "sim",
  ordine: "ordine",
  domains: "domaindata",
  dealer: "dealer",
  marketing: "marketing",
  utente: "utente",
  storico: "storico",
  vendita: "vendita",
  "cliente-azienda": "cliente-azienda",
  "cliente-privato": "cliente-privato",
  veicolo: "veicolo",
  collaudo: "collaudo",
  tagliando: "tagliando",
  richiamo: "richiamo",
  ticket: "ticket"
};

export const CATEGORY_ICON = {
  device: "fas fa-broadcast-tower",
  sim: "fas fa-mobile-alt",
  dealer: "fas fa-globe",
  filiale: "fas fa-landmark",
  utente: "fas fa-users",
  storico: "fas fa-history",
  ordine: "fas fa-truck",
  venditore: "fas fa-hand-holding-usd",
  vendita: "fas fa-dollar-sign",
  "cliente-azienda": "fas fa-building",
  "cliente-privato": "fas fa-address-book",
  veicolo: "fas fa-car",
  domaindata: "fas fa-list-ul"
};

export const HUB_EVENTS = {
  GROWL: "GROWL",
  LOG: "LOG",
  ISLOADING: "ISLOADING",
  AUTHCHANNELL: "AUTHCHANNELL",
  GISPOSITION: "POSITION",
  GISRESULT: "RESULT"
};

export const ENTITY_STATUS = {
  all: "all",
  unavailable: "Unavailable",
  inserted: "Inserito",
  closed: "Chiuso",
  installed: "Installato",
  readyForDelivery: "Spedibile",
  inDelivery: "Spedito",
  delivered: "Consegnato",
  inPreparation: "In Lavorazione",
  paired: "Abbinato",
  expired: "Scaduto",
  active: "Attivo"
};

export const ENTITY_STATUS_DOMAIN = Object.keys(ENTITY_STATUS)
  .filter(key => !["all", "unavailable"].includes(key))
  .map(key => ({
    label: ENTITY_STATUS[key],
    value: ENTITY_STATUS[key]
  }));

export const PIRAMIS_DOMAINS_ID = "PIRAMIS_DOMAINS_ID";

export const PIRAMIS_ENTITY_CHANGE_HEADER = "x-piramis-entity";

export const DEFAULT_GRID_OPTIONS = {
  size: 20,
  from: 0,
  sort: [{ field: "updateDate", order: -1 }]
};
