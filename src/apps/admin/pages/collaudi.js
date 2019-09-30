// @flow
import * as React from 'react';
import CollaudoList from '../../_components/collaudi';
import { ITEM_CATEGORY } from '../../shared/const';

const Collaudi = () => {
  return (
    <CollaudoList
      query={{
        includeRelated: 'carId',
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.collaudo
      }}
    />
  );
};

export default Collaudi;
