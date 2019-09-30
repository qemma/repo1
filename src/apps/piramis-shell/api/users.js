// @flow
import { API } from 'aws-amplify';
import { PIRAMIS_ENTITY_CHANGE_HEADER } from '../../shared/const';
import { wait } from '../../_components/utils';

const UsersService = {
  create: async (user: any) => {
    const result = await API.post('piramisApi', `/admin/users`, {
      body: user,
      headers: { [PIRAMIS_ENTITY_CHANGE_HEADER]: 'true' }
    });
    await wait(1500);
    return result;
  },

  action: async (user: any, action: string) => {
    const result = await API.put('piramisApi', `/admin/users/${action}`, {
      body: user,
      headers: { [PIRAMIS_ENTITY_CHANGE_HEADER]: 'true' }
    });

    await wait(1500);
    return result;
  }
};

export default UsersService;
