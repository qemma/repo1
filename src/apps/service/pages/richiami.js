// @flow
import * as React from 'react';
import RichiamiList from '../../_components/richiami';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

export const GroupRecalls = () => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const service = context.user.roleEntity;

  return (
    <RichiamiList
      parentId={service.group}
      group={service.group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: true,
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.richiamo,
        filters: {
          group: { matchMode: 'match', value: service.group }
        }
      }}
    />
  );
};
