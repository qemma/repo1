// @flow
import * as React from 'react';
import OrdersList from '../../_components/orders';
import { ITEM_CATEGORY } from '../../shared/const';

const Orders = (props: { routingParams: { parentId?: string, group: string } }) => {
  return (
    <OrdersList
      canAdd={false}
      canEdit={false}
      inNameOf="*"
      canCreateDelivery
      query={{
        includeChildren: true,
        includeParents: true,
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.ordine,
        filters: {
          parentId: props.routingParams.parentId
            ? { matchMode: 'match', value: props.routingParams.parentId }
            : undefined,
          group: props.routingParams.group
            ? { matchMode: 'match', value: props.routingParams.group }
            : undefined
        }
      }}
    />
  );
};

export default Orders;
