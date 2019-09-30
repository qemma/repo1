// @flow
import * as React from 'react';
import CollaudoList from '../../_components/collaudi';
import { ITEM_CATEGORY } from '../../shared/const';
import { PiramisContext } from '../../shared/piramis-context';

const Collaudi = () => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const currentUsername = context.user.username;
  return (
    <CollaudoList
      personal
      query={{
        includeRelated: 'carId',
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.collaudo,
        filters: {
          createdBy: { matchMode: 'match', value: currentUsername }
        }
      }}
    />
  );
};

export default Collaudi;
