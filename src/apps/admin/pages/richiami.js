// @flow
import * as React from 'react';
import RichiamiList from '../../_components/richiami';
import { ITEM_CATEGORY } from '../../shared/const';

export const Richiami = (props: any) => {
  const group = props.routingParams.group;

  return (
    <RichiamiList
      parentId={group}
      group={group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: true,
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
