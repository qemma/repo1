// @flow
import * as React from 'react';
import SalesList from '../../_components/sales';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

export const GroupSales = (props: { routingParams: { groupId: string } }) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const group = props.routingParams.groupId;
  const parent = context.user.roleEntity;
  return (
    <SalesList
      parentId={parent.uuid}
      group={group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: [parent.uuid],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.vendita,
        filters: {
          group: { matchMode: 'match', value: group }
        }
      }}
    />
  );
};

export const EntitySales = (props: { routingParams: { parentId: string } }) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const parent = context.user.roleEntity;
  const parentId = decodeURIComponent(props.routingParams.parentId);

  return (
    <SalesList
      parentId={parentId}
      group={parent.uuid}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: [parentId],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.vendita,
        filters: {
          parentId: { matchMode: 'match', value: parentId },
          group: { matchMode: 'match', value: parent.uuid }
        }
      }}
    />
  );
};
