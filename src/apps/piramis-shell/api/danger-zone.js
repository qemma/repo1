import { API } from 'aws-amplify';

export default class DangerZoneService {
  fullReindex = async () => {
    return await API.post('piramisApi', `/index/all`);
  };
}
