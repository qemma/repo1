// @flow
import * as React from 'react';
import { Hierarchy } from '../../_components';
import { PiramisContext } from '../../shared/piramis-context';

export default function GroupPage(props: { routingParams: { group: string, rootId: string } }) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const referenced = context.user.referenced;
  if (!(referenced || []).includes(props.routingParams.group)) return null;
  return (
    <Hierarchy
      groupId={props.routingParams.group}
      isAdmin={false}
      entityId={props.routingParams.group}
    />
  );
}
