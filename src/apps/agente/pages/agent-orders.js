// @flow
import * as React from 'react';
import { PiramisContext } from '../../shared/piramis-context';
import AgentOrders from '../../_components/orders/agent-orders';

const AllAgentOrders = () => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const agentId = context.user.uuid;
  return <AgentOrders routingParams={{ agentId }} />;
};

export default AllAgentOrders;
