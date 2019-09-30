// @flow
import * as React from 'react';
import OrdersList from '../../_components/orders';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

export const GroupOrders = (props: { routingParams: { groupId: string } }) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const parent = context.user.roleEntity;
  const group = props.routingParams.groupId;
  return (
    <OrdersList
      parentId={parent.uuid}
      group={group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: [parent.uuid],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.ordine,
        filters: {
          group: { matchMode: 'match', value: group }
        }
      }}
    />
  );
};

// export const EntityOrders = (props: { routingParams: { parentId: string } }) => {
//   const context: PiramisContextData = React.useContext(PiramisContext);
//   const parent = context.user.roleEntity;
//   return (
//     <OrdersList
//       parentId={props.routingParams.parentId}
//       group={parent.uuid}
//       canAdd={true}
//       canEdit={true}
//       query={{
//         includeChildren: true,
//         includeParents: [props.routingParams.parentId],
//         type: 'match',
//         field: 'category',
//         value: ITEM_CATEGORY.ordine,
//         filters: {
//           parentId: { matchMode: 'match', value: props.routingParams.parentId },
//           group: { matchMode: 'match', value: parent.uuid }
//         }
//       }}
//     />
//   );
// };
