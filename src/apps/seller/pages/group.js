// @flow
import * as React from 'react';
import { Hierarchy } from '../../_components';
import { PiramisContext } from '../../shared/piramis-context';

export default function GroupPage() {
  const context: PiramisContextData = React.useContext(PiramisContext);
  return (
    <Hierarchy
      groupId={context.user.roleEntity.group}
      parentId={context.user.roleEntity.uuid}
      isAdmin={false}
      entityId={context.user.roleEntity.uuid}
    />
  );
}
