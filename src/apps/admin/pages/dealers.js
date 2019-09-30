// @flow
import * as React from 'react';
import DealersList from '../../_components/dealers';

export const AllDealers = () => {
  return <DealersList canEdit={true} />;
};

export const AgentDealers = (props: { routingParams: { agentId: string } }) => {
  return (
    <DealersList
      canEdit={true}
      options={{
        filters: {
          reference1: { matchMode: 'match', value: decodeURIComponent(props.routingParams.agentId) }
        }
      }}
    />
  );
};
