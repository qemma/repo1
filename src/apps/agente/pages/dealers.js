// @flow
import * as React from 'react';
import DealersList from '../../_components/dealers';
import { PiramisContext } from '../../shared/piramis-context';

const Dealers = () => {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const agent = context.user.uuid;
  return (
    <DealersList
      canEdit={false}
      options={{
        filters: {
          reference1: { matchMode: 'match', value: agent }
        }
      }}
    />
  );
};

export default Dealers;
