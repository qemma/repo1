// @flow
import * as React from 'react';
import Storage from '../../_components/storage';
import { ITEM_CATEGORY } from '../../shared/const';

const EntityStorage = (props: { routingParams: { entityId: string } }) => {
  const entityId = props.routingParams.entityId;
  return (
    <Storage
      parentId={entityId}
      query={{
        includeChildren: true,
        includeParents: [entityId],
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.device,
        filters: {
          reference1: { matchMode: 'match', value: entityId }
        }
      }}
    />
  );
};

export default EntityStorage;
