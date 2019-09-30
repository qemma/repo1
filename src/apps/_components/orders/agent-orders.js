// @flow
import * as React from 'react';
import OrdersList from './index';
import { ITEM_CATEGORY } from '../../shared/const';
import { PiramisContext } from '../../shared/piramis-context';

const AgentOrders = (props: { routingParams: { agentId: string } }) => {
  const agentId = decodeURIComponent(props.routingParams.agentId);
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [groups, setGroups] = React.useState();
  const { entityService, hub } = context;

  async function loadData() {
    hub.loading(true);
    try {
      const result = await entityService.search({
        category: ITEM_CATEGORY.dealer,
        filters: { reference1: { matchMode: 'match', value: agentId } }
      });
      setGroups(result.items.map(dealer => dealer.group));
    } finally {
      hub.loading(false);
    }
  }

  React.useEffect(() => {
    loadData();
  }, [agentId]);

  return groups ? (
    <OrdersList
      canAdd={false}
      canEdit={false}
      inNameOf={groups}
      canCreateDelivery
      query={{
        includeChildren: true,
        includeParents: true,
        type: 'match',
        field: 'category',
        value: ITEM_CATEGORY.ordine,
        filters: {
          group: { matchMode: 'terms', value: groups }
        }
      }}
    />
  ) : (
    <div className="text-center">
      <i className="fas fa-circle-notch fa-spin text-grey-light" style={{ fontSize: '20em' }} />
    </div>
  );
};

export default AgentOrders;
