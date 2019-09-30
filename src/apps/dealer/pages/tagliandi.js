// @flow
import * as React from 'react';
import TagliandiList from '../../_components/tagliandi';
import { PiramisContext } from '../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../shared/const';

export const GroupTagliandi = (props: { routingParams: { group: string } }) => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const parent = context.user.roleEntity;
  const group = props.routingParams.group;
  return (
    <TagliandiList
      parentId={parent.uuid}
      group={group}
      canAdd={true}
      canEdit={true}
      query={{
        includeChildren: true,
        includeParents: [parent.uuid],
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
