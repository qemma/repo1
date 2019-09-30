// @flow
import * as React from "react";
import Pages from "./pages";
import { Customers, Vehicles } from "../_components";
// import { CATEGORY_ICON, ITEM_CATEGORY } from '../shared/const';

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  return [
    {
      route: `/${root}/dashboard`,
      component: () => <div>service dashboard</div>,
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
        if (props.routingParams.group !== user.roleEntity.uuid) return null;
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
        if (props.routingParams.group !== user.roleEntity.uuid) return null;
        return <Pages.GroupTagliandi />;
      },
      label: labels.get("modelliTagliando"),
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
        if (props.routingParams.group !== user.roleEntity.uuid) return null;
        return <Pages.GroupRecalls />;
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
        if (props.routingParams.group !== user.roleEntity.uuid) return null;
        return <Vehicles {...props} />;
      },
      label: labels.get("veicoli"),
      icon: "fas fa-car",
      url: `#/${root}/vehicles/${user.roleEntity.uuid}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("veicoli") }
      ]
    }
  ];
};
