// @flow
import * as React from 'react';
import Storage from '../../_components/storage';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

export const GroupStorage = () => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const parent = context.user.roleEntity;
  return (
    <Storage
      parentId={parent.uuid}
      group={parent.uuid}
      query={{
        includeChildren: true,
        includeParents: [parent.uuid],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.device,
        filters: {
          group: { matchMode: 'match', value: parent.uuid }
        }
      }}
    />
  );
};

export const FilialeStorage = (props: { routingParams: { filialeId: string } }) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const dealer = context.user.roleEntity;
  const filialeId = props.routingParams.filialeId;
  return (
    <Storage
      parentId={dealer.uuid}
      group={filialeId}
      query={{
        includeChildren: true,
        includeParents: [dealer.uuid],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.device,
        filters: {
          reference1: { matchMode: 'match', value: filialeId },
          group: { matchMode: 'match', value: filialeId }
        }
      }}
    />
  );
};
