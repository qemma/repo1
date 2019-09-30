// @flow
import * as React from "react";
import Pages from "./pages";
import { Customers, Vehicles } from "../_components";
import { CATEGORY_ICON, ITEM_CATEGORY } from "../shared/const";

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  return [
    {
      route: `/${root}`,
      component: () => <div>Dashboard agente</div>,
      label: labels.get("dashboard"),
      icon: "fas fa-home",
      url: `#/${root}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dashboard") }
      ]
    },
    {
      route: `/${root}/dealers`,
      label: labels.get("dealers"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.dealer],
      url: `#/${root}/dealers`,
      component: Pages.Dealers,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dealers") }
      ]
    },
    {
      route: `/${root}/orders`,
      label: labels.get("ordini"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.ordine],
      url: `#/${root}/orders`,
      component: Pages.AgentOrders,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("ordini agente") }
      ]
    },
    {
      route: `/${root}/group/:group`,
      component: Pages.Group,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("gruppo") }
      ]
    },
    {
      route: `/${root}/grouporders/:group`,
      component: Pages.Orders,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("ordini") }
      ]
    },
    {
      route: `/${root}/entityorders/:group/:parentId`,
      component: Pages.Orders,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("ordini") }
      ]
    },
    {
      route: `/${root}/entitysales/:group/:parentId`,
      component: Pages.Sales,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("vendite") }
      ]
    },
    {
      route: `/${root}/customers/:group`,
      component: Customers,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("clienti") }
      ]
    },
    {
      route: `/${root}/vehicles/:group`,
      component: Vehicles,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("veicoli") }
      ]
    },
    {
      route: `/${root}/groupsales/:group`,
      component: Pages.Sales,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("vendite") }
      ]
    },
    {
      route: `/${root}/entitystorage/:entityId`,
      component: Pages.EntityStorage,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("magazzino") }
      ]
    },
    {
      // eslint-disable-next-line no-useless-escape
      route: `/${root}/assellergroup/?((\w|.)*)`,
      label: labels.get("venditorePer"),
      icon: "fas fa-sitemap",
      url: `#/${root}/assellergroup`,
      component: Pages.AsSellerGroup,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("venditorePer") }
      ]
    },
    {
      // eslint-disable-next-line no-useless-escape
      route: `/${root}/agentsales/?((\w|.)*)`,
      label: labels.get("venditeFatte"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.vendita],
      url: `#/${root}/agentsales`,
      component: Pages.AsSeller,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("venditeFatte") }
      ]
    }
  ];
};
