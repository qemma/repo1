// @flow
import moment from 'moment';
import { API } from 'aws-amplify';
import { uniqBy } from 'lodash';

type GisSettings = {
  gisUrl: string,
  gisToken: string,
  gisWs: string,
  lastPositionInterval: number,
  infocarUser: string,
  infocarPassword: string
};
export default class GisApi implements IGisApi {
  appSettings: GisSettings;
  constructor(appSettings: GisSettings) {
    this.appSettings = appSettings || {
      gisUrl: 'https://gis.piramisprogettispeciali.com',
      gisWs: 'wss://gis.piramisprogettispeciali.com',
      gisToken: 'mVfTg5SGPgakPqk8ApIDsmEqZ061D63i',
      lastPositionInterval: 30,
      infocarUser: 'DAT-pieEBK',
      infocarPassword: 'HorseStaple1!'
    };
  }

  login = async () => {
    const authRequest = await fetch(
      `${this.appSettings.gisUrl}/api/session?token=${this.appSettings.gisToken}`,
      {
        credentials: 'include'
      }
    );

    if (authRequest.ok) {
      return await authRequest.json();
    } else {
      return false;
    }
  };

  getDevice = async (imei: string) => {
    const deviceRequest = await fetch(`${this.appSettings.gisUrl}/api/devices?uniqueId=${imei}`, {
      credentials: 'include'
    });

    if (deviceRequest.ok) {
      const devices = await deviceRequest.json();
      return devices.length ? devices[0] : false;
    } else {
      return false;
    }
  };

  getLastPosition = async (id: number) => {
    const to = moment().toJSON();
    const from = moment()
      .subtract(this.appSettings.lastPositionInterval, 'seconds')
      .toJSON();

    const positionsRequest = await fetch(
      `${this.appSettings.gisUrl}/api/positions?deviceId=${id}&from=${from}&to=${to}`,
      {
        credentials: 'include'
      }
    );

    if (positionsRequest.ok) {
      const positions = await positionsRequest.json();
      return positions.length ? positions[positions.length - 1] : false;
    } else {
      return false;
    }
  };

  createDevice = async (imei: string, phone: string, name: string, category: string) => {
    const data = {
      groupId: 0,
      name,
      uniqueId: imei,
      geofenceIds: [],
      phone,
      model: 'vehicle',
      contact: '',
      category,
      disabled: false
    };

    const createResp = await fetch(`${this.appSettings.gisUrl}/api/devices`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (createResp.ok) {
      return await createResp.json();
    } else {
      return false;
    }
  };

  sendComand = async (
    deviceId: number,
    data: string,
    description: string,
    textChannel: boolean = false
  ) => {
    const command = {
      attributes: {
        data
      },
      deviceId,
      type: 'custom',
      textChannel,
      description
    };

    const commandResp = await fetch(`${this.appSettings.gisUrl}/api/commands/send`, {
      method: 'post',
      body: JSON.stringify(command),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (commandResp.ok) {
      return await commandResp.json();
    } else {
      return false;
    }
  };

  setDevice = async (deviceNumber: string, timeout: number) => {
    try {
      await API.get('piramisApi', `/smsGateway/${deviceNumber}/h s getrecord`);
      await API.get('piramisApi', `/smsGateway/${deviceNumber}/h s setparam 1000:${timeout}`);
      return true;
    } catch {
      return false;
    }
  };

  smsCommand = async (deviceNumber: string, command: string) => {
    await API.get('piramisApi', `/smsGateway/${deviceNumber}/${command}`);
    return true;
  };

  getMakes = async () => {
    const makesResult = await API.post('piramisApi', `/infocar/GetMarche`, {
      body: {
        credenziali: {
          Login: this.appSettings.infocarUser,
          Password: this.appSettings.infocarPassword
        },
        parametro: {
          Auto: 'S',
          Fuoristrada: 'S',
          Microvetture: 'S',
          InVendita: 'S',
          VeicoliCommerciali: 'S'
        }
      }
    });

    return makesResult.Lista;
  };

  getModels = async (input: { CodiceMarca: string, Alimentazione: string }) => {
    const modelsResult = await API.post('piramisApi', `/infocar/GetModelli`, {
      body: {
        credenziali: {
          Login: this.appSettings.infocarUser,
          Password: this.appSettings.infocarPassword
        },
        parametro: {
          ...input
        }
      }
    });

    return modelsResult.Lista;
  };

  getPreparations = async (input: { CodiceModello: string }) => {
    const prepResult = await API.post('piramisApi', `/infocar/GetAllestimenti`, {
      body: {
        credenziali: {
          Login: this.appSettings.infocarUser,
          Password: this.appSettings.infocarPassword
        },
        parametro: {
          ...input
        }
      }
    });

    return uniqBy(prepResult.Lista, el => el.DescrizioneCompleta);
  };

  getFromPlate = async (plate: string) => {
    const result = await API.post('piramisApi', `/infocar/GetInfocarDaTarga`, {
      body: {
        credenziali: {
          Login: this.appSettings.infocarUser,
          Password: this.appSettings.infocarPassword
        },
        parametro: {
          Targa: plate
        }
      }
    });

    return result.InfocarDaTarga;
  };

  getPlateAnagrafica = async (codInfocarAm: string) => {
    const result = await API.post('piramisApi', `/infocar/GetAnagrafica`, {
      body: {
        credenziali: {
          Login: this.appSettings.infocarUser,
          Password: this.appSettings.infocarPassword
        },
        parametro: {
          CodiceInfocarAM: codInfocarAm
        }
      }
    });

    return result.Anagrafica;
  };
}
