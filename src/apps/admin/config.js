// @flow
import * as React from "react";
import * as Pages from "./pages";
import { Customers, Vehicles, MarketingList } from "../_components";
import { CATEGORY_ICON, ITEM_CATEGORY, PIRAMIS_ROLES } from "../shared/const";

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  const role = Array.isArray(user.roles) ? user.roles[0] : user.roles;

  const baseRoutes = [
    {
      route: `/${root}/domain-import`,
      label: labels.get("gestioneDomini"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.domains],
      url: `#/${root}/domain-import`,
      component: Pages.DomainImport,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("gestioneDomini") }
      ]
    },
    {
      route: `/${root}/device-import`,
      label: labels.get("importazioneDispositivi"),
      icon: "fas fa-upload",
      url: `#/${root}/device-import`,
      component: Pages.DevicesImport,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("importazioneDispositivi") }
      ]
    },
    {
      route: `/${root}/devices`,
      label: labels.get("statoDispositivi"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.device],
      url: `#/${root}/devices`,
      component: Pages.DevicesList,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("statoDispositivi") }
      ]
    },
    {
      route: `/${root}/sim-import`,
      label: labels.get("importazioneSim"),
      icon: "fas fa-upload",
      url: `#/${root}/sim-import`,
      component: Pages.SimImport,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("importazioneSim") }
      ]
    },
    {
      route: `/${root}/simcards`,
      label: labels.get("statoSimCards"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.sim],
      url: `#/${root}/simcards`,
      component: Pages.SimList,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("statoSimCards") }
      ]
    },
    {
      route: `/${root}/device-sat-pair`,
      label: labels.get("associaDispositiviSim"),
      icon: "fas fa-link",
      url: `#/${root}/device-sat-pair`,
      component: Pages.DeviceSimPair,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("associa dispositivi/sim") }
      ]
    },
    {
      route: `/${root}/orders`,
      component: Pages.Orders,
      label: labels.get("ordini"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.ordine],
      url: `#/${root}/orders`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("ordini") }
      ]
    },
    {
      route: `/all-tests`,
      component: Pages.Tests,
      label: labels.get("collaudi"),
      icon: "fas fa-list",
      url: `#/all-tests`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("collaudi") }
      ]
    }
  ];
  const logisticaRoutes = baseRoutes.concat([
    {
      route: `/${root}`,
      component: () => <div>dashboard logistica</div>,
      label: labels.get("dashboard"),
      icon: "fas fa-home",
      url: `#/${root}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dashboard") }
      ]
    }
  ]);
  const adminRoutes = baseRoutes.concat([
    {
      route: `/${root}`,
      component: () => <div>Admin Dashboard</div>,
      label: labels.get("dashboard"),
      icon: "fas fa-home",
      url: `#/${root}`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dashboard") }
      ]
    },
    {
      route: `/${root}/users`,
      component: Pages.UsersList,
      label: labels.get("users"),
      icon: "fas fa-users-cog",
      url: `#/${root}/users`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("users") }
      ]
    },

    {
      route: `/${root}/dealers`,
      label: labels.get("dealers"),
      icon: CATEGORY_ICON[ITEM_CATEGORY.dealer],
      url: `#/${root}/dealers`,
      component: Pages.AllDealers,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dealers") }
      ]
    },
    {
      route: `/${root}/agents`,
      label: labels.get("agenti"),
      icon: "fas fa-hands-helping",
      url: `#/${root}/agents`,
      component: Pages.Agents,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("elencoAgenti") }
      ]
    },
    {
      route: `/${root}/agentDealers/:agentId`,
      component: Pages.AgentDealers,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dealers") }
      ]
    },
    {
      route: `/${root}/agentOrders/:agentId`,
      component: Pages.AgentOrders,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("ordiniAgente") }
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
      route: `/${root}/tagliandi/:group`,
      component: Pages.Tagliandi,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("tagliandi") }
      ]
    },
    {
      route: `/${root}/richiami/:group`,
      component: Pages.Richiami,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("richiami") }
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
    // {
    //   route: `/${root}/entityorders/:group/:parentId`,
    //   component: Pages.Orders,
    //   breadcrumbs: (labels: Localizer) => [
    //     { label: labels.get(root) },
    //     { label: labels.get('ordini') }
    //   ]
    // },
    {
      route: `/${root}/grouporders/:group`,
      component: Pages.Orders,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("ordini") }
      ]
    },
    {
      route: `/${root}/agentsales/:group/:parentId`,
      component: Pages.Sales,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("vendite") }
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
      route: `/${root}/marketing/:group`,
      component: (props: any) => {
        const updtProps = {
          ...props,
          group: props.routingParams.group
        };
        return <MarketingList {...updtProps} />;
      },
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("marketing") }
      ]
    }
  ]);
  const superAdminRoutes = adminRoutes.concat({
    route: `/superadmin/dangerzone`,
    component:
      root === "superadmin"
        ? Pages.SuperAdmin
        : () => <div>{labels.get("sezioneDisponibile1")}</div>,
    breadcrumbs: (labels: Localizer) => [
      { label: labels.get(root) },
      { label: labels.get("danger") }
    ]
  });

  const routeRoleMap = {
    [PIRAMIS_ROLES.superadmin]: superAdminRoutes,
    [PIRAMIS_ROLES.admin]: adminRoutes,
    [PIRAMIS_ROLES.logistica]: logisticaRoutes
  };

  return routeRoleMap[role];
};
