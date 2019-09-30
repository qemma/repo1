// @flow
import * as React from 'react';
import TagliandiList from '../../_components/tagliandi';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

export const GroupTagliandi = () => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const service = context.user.roleEntity;

  return (
    <TagliandiList
      parentId={service.group}
      group={service.group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: [service.group],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.tagliando,
        filters: {
          group: { matchMode: 'match', value: service.group }
        }
      }}
    />
  );
};
