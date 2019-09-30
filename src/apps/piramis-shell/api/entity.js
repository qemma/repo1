// @flow
import { API, Storage } from 'aws-amplify';
import { PIRAMIS_ENTITY_CHANGE_HEADER } from '../../shared/const';
import { wait } from '../../_components/utils';
import mime from 'mime-types';

export default class EntityService {
  put = async (data: Object) => {
    const result = await API.put('piramisApi', `/entities`, {
      body: data,
      headers: { [PIRAMIS_ENTITY_CHANGE_HEADER]: 'true' }
    });
    await wait(1500);
    return result;
  };

  search = async (options: any) => {
    return await API.post('piramisApi', `/search`, {
      body: options
    });
  };

  getGroup = async (group: string) => {
    return await API.get('piramisApi', `/group/${group}`);
  };

  deleteEntity = async (entity: any) => {
    const result = await API.del('piramisApi', `/entities/${entity.uuid}`);
    await wait(1500);
    return result;
  };

  esProxy = async (options: any) => {
    return await API.post('piramisApi', `/esProxy`, { body: options });
  };

  putRecall = async (model: any, vehicle: any, recall: any) => {
    const result = await API.post('piramisApi', `/customRecall`, {
      body: { model, vehicle, recall },
      headers: { [PIRAMIS_ENTITY_CHANGE_HEADER]: 'true' }
    });

    await wait(1500);
    return result;
  };

  closeRecall = async (closeData: any, vehicle: any, recall: any) => {
    const result = await API.post('piramisApi', `/closeRecall`, {
      body: { closeData, vehicle, recall },
      headers: { [PIRAMIS_ENTITY_CHANGE_HEADER]: 'true' }
    });

    await wait(1500);
    return result;
  };

  upload = async (blob: Blob, key: string, onUpload?: Function) => {
    return await Storage.put(key, blob, {
      contentType: mime.lookup(key),
      progressCallback(progress) {
        onUpload && onUpload(progress.loaded, progress.total);
      }
    });
  };

  getMatchingVehicles = async (criteria: any, hierarchyId: string) => {
    const result = await API.post('piramisApi', `/marketing/matches`, {
      body: { criteria, hierarchyId }
    });

    return result;
  };

  download = async (key: string) => {
    return await Storage.get(key);
  };

  delFile = async (key: string) => {
    return await Storage.remove(key);
  };
}
