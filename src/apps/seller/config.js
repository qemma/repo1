// @flow
import * as React from "react";
import Pages from "./pages";
import { Customers, Vehicles } from "../_components";
import { CATEGORY_ICON, ITEM_CATEGORY } from "../shared/const";

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  return [
    {
      route: `/${root}/dashboard`,
      component: () => <div>Seller dashboard</div>,
      label: labels.get("dashboard"),
      icon: "fas fa-home",
      url: `#/${root}/dashboard`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dashboard") }
      ]
    },
    {
      route: `/${root}/customers/:group`,
      component: (props: any) => {
        if (props.routingParams.group !== user.roleEntity.group) return null;
        return <Customers {...props} />;
      },
      label: labels.get("clienti"),
      icon: "fas fa-users",
      url: `#/${root}/customers/${user.roleEntity.group}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("clienti") }
      ]
    },
    {
      route: `/${root}/vehicles/:group`,
      component: (props: any) => {
        if (props.routingParams.group !== user.roleEntity.group) return null;
        return <Vehicles {...props} />;
      },
      label: labels.get("veicoli"),
      icon: "fas fa-car",
      url: `#/${root}/vehicles/${user.roleEntity.group}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("veicoli") }
      ]
    },
    {
      // eslint-disable-next-line no-useless-escape
      route: `/${root}/group/?((\w|.)*)`,
      label: labels.get("gruppo"),
      icon: "fas fa-sitemap",
      url: `#/${root}/group`,
      component: Pages.Group,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("gruppo") }
      ]
    },
    {
      // eslint-disable-next-line no-useless-escape
      route: `/${root}/entitysales/?((\w|.)*)`,
      label: labels.get("vendite"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.vendita],
      url: `#/${root}/entitysales`,
      component: Pages.Sales,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("vendite") }
      ]
    }
  ];
};
