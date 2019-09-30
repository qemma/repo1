// @flow
import * as React from 'react';
import SalesList from '../../_components/sales';
import { ITEM_CATEGORY } from '../../shared/const';
import { PiramisContext } from '../../shared/piramis-context';

const Sales = (props: { routingParams: { parentId: string, group: string } }) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const referenced = context.user.referenced;
  if (!(referenced || []).includes(props.routingParams.group)) return null;
  return (
    <SalesList
      canAdd={false}
      canEdit={false}
      parentId={props.routingParams.parentId}
      group={props.routingParams.group}
      query={{
        includeChildren: true,
        includeParents: true,
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.vendita,
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

export default Sales;
