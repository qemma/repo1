// @flow
import * as React from 'react';
import { Hierarchy } from '../../_components';

export default function GroupPage(props: { routingParams: { group: string, rootId: string } }) {
  return <Hierarchy groupId={props.routingParams.group} isAdmin />;
}
