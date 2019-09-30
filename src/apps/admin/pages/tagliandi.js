// @flow
import * as React from 'react';
import TagliandiList from '../../_components/tagliandi';
import { ITEM_CATEGORY } from '../../shared/const';

export const Tagliandi = (props: any) => {
  const group = props.routingParams.group;
  return (
    <TagliandiList
      parentId={group}
      group={group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: true,
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.tagliando,
        filters: {
          group: { matchMode: 'match', value: group }
        }
      }}
    />
  );
};
