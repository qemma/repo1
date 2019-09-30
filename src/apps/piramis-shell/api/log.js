// @flow
import { API } from 'aws-amplify';

export default class LogService {
  sendLogs = async (data: any) => {
    if (!data.length) return;

    await API.post('piramisApi', `/logs`, {
      body: data
    });
  };
}
