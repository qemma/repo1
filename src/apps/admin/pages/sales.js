// @flow
import * as React from 'react';
import SalesList from '../../_components/sales';
import { ITEM_CATEGORY } from '../../shared/const';

const Sales = (props: { routingParams: { parentId: string, group: string } }) => {
  const parentId = props.routingParams.parentId
    ? decodeURIComponent(props.routingParams.parentId)
    : undefined;
  return (
    <SalesList
      canAdd={false}
      canEdit={false}
      parentId={parentId}
      group={props.routingParams.group}
      query={{
        includeChildren: true,
        includeParents: true,
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.vendita,
        filters: {
          parentId: parentId ? { matchMode: 'match', value: parentId } : undefined,
          group: props.routingParams.group
            ? { matchMode: 'match', value: props.routingParams.group }
            : undefined
        }
      }}
    />
  );
};

export default Sales;
