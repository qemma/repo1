// @flow
import * as React from 'react';
import SalesList from '../../_components/sales';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

const Sales = () => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const parent = context.user.roleEntity;
  return (
    <SalesList
      parentId={parent.uuid}
      group={parent.group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: [parent.uuid],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.vendita,
        filters: {
          parentId: { matchMode: 'match', value: parent.uuid },
          group: { matchMode: 'match', value: parent.group }
        }
      }}
    />
  );
};

export default Sales;
