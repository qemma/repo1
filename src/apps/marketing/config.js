// @flow
import * as React from 'react';
import { MarketingList, Customers } from '../_components';

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  return [
    {
      route: `/${root}/dashboard`,
      component: (props: any) => {
        const updtProps = {
          ...props,
          group: user.roleEntity.group,
          parentId: user.roleEntity.parentId
        };
        return <MarketingList {...updtProps} />;
      },
      label: labels.get('dashboard'),
      icon: 'fas fa-home',
      url: `#/${root}/dashboard`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get('dashboard') }
      ]
    },
    {
      route: `/${root}/customers/:group`,
      component: (props: any) => {
        if (props.routingParams.group !== user.roleEntity.uuid) return null;
        return <Customers {...props} preventUpdateVehicle />;
      },
      label: labels.get('clienti'),
      icon: 'fas fa-users',
      url: `#/${root}/customers/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get('clienti') }
      ]
    }
    // {
    //   route: `/${root}/campagne/:group`,
    //   component: props => {
    //     const updtProps = {
    //       ...props,
    //       group: user.roleEntity.group,
    //       parentId: user.roleEntity.parentId
    //     };
    //     return <MarketingList {...updtProps} />;
    //   },
    //   label: labels.get('dashboard'),
    //   icon: 'fas fa-home',
    //   url: `#/${root}/campagne/${user.roleEntity.uuid}`,
    //   breadcrumbs: (labels: Localizer) => [
    //     { label: labels.get(root) },
    //     { label: labels.get('dashboard') }
    //   ]
    // }
  ];
};
