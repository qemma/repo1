// @flow
import * as React from "react";
import Pages from "./pages";
import { Customers, Vehicles, MarketingList } from "../_components";
import { CATEGORY_ICON, ITEM_CATEGORY } from "../shared/const";

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  return [
    {
      route: `/${root}/dashboard`,
      component: () => <div>Dealer dashboard</div>,
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
        return <Customers {...props} />;
      },
      label: labels.get("clienti"),
      icon: "fas fa-users",
      url: `#/${root}/customers/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("clienti") }
      ]
    },
    {
      route: `/${root}/tagliandi/:group`,
      component: (props: any) => {
        return <Pages.GroupTagliandi {...props} />;
      },
      label: labels.get("tagliandi"),
      icon: "fas fa-wrench",
      url: `#/${root}/tagliandi/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("tagliandi") }
      ]
    },
    {
      route: `/${root}/richiami/:group`,
      component: (props: any) => {
        return <Pages.GroupRecalls {...props} />;
      },
      label: labels.get("elencoRichiami"),
      icon: "fas fa-tools",
      url: `#/${root}/richiami/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("richiami") }
      ]
    },
    {
      route: `/${root}/vehicles/:group`,
      component: (props: any) => {
        return <Vehicles {...props} />;
      },
      label: labels.get("veicoli"),
      icon: "fas fa-car",
      url: `#/${root}/vehicles/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("veicoli") }
      ]
    },
    {
      route: `/${root}/group`,
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
      route: `/${root}/storage`,
      label: labels.get("storage"),
      icon: "fas fa-warehouse",
      url: `#/${root}/storage`,
      component: Pages.GroupStorage,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("magazzino") }
      ]
    },
    {
      route: `/${root}/grouporders/:groupId`,
      component: Pages.GroupOrders,
      label: labels.get("ordini"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.ordine],
      url: `#/${root}/grouporders/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("ordini") }
      ]
    },
    {
      route: `/${root}/groupsales/:groupId`,
      component: Pages.GroupSales,
      label: labels.get("vendite"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.vendita],
      url: `#/${root}/groupsales/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("vendite") }
      ]
    },
    {
      route: `/${root}/entitystorage/:filialeId`,
      component: Pages.FilialeStorage,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("magazzino") }
      ]
    },
    {
      route: `/${root}/agentsales/:groupId/:parentId`,
      component: Pages.EntitySales,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("vendite") }
      ]
    },
    {
      route: `/${root}/marketing/:group`,
      component: (props: any) => {
        const updtProps = {
          ...props,
          group: props.routingParams.group
        };
        return <MarketingList {...updtProps} />;
      },
      label: labels.get("marketing"),
      icon: "fas fa-mail-bulk",
      url: `#/${root}/marketing/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("marketing") }
      ]
    }
  ];
};
