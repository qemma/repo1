// @flow
import * as React from 'react';
import RichiamiList from '../../_components/richiami';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

export const GroupRecalls = (props: { routingParams: { group: string } }) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const service = context.user.roleEntity;
  const group = props.routingParams.group;

  return (
    <RichiamiList
      parentId={service.uuid}
      group={group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: [service.uuid],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.richiamo,
        filters: {
          group: { matchMode: 'match', value: group }
        }
      }}
    />
  );
};
