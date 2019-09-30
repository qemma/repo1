// @flow
import * as React from "react";
import Tickets from "./pages/tickets-list";
import NewTicket from "./pages/new-ticket";
import EditTicket from "./pages/edit-ticket";

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  return [
    {
      route: `/${encodeURIComponent(root)}/dashboard`,
      component: Tickets,
      label: labels.get("dashboard"),
      icon: "fas fa-home",
      url: `#/${encodeURIComponent(root)}/dashboard`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("centrale operativa") }
      ]
    },
    {
      route: `/${encodeURIComponent(root)}/new-ticket`,
      component: NewTicket,
      label: labels.get("nuovoTicket"),
      icon: "fas fa-map-marked-alt",
      url: `#/${encodeURIComponent(root)}/new-ticket`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("lavora ticket") }
      ]
    },
    {
      route: `/${encodeURIComponent(root)}/edit-ticket/:ticketId`,
      component: (props: any) => <EditTicket {...props} />,
      label: labels.get("lavoraTicket"),
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("lavora ticket") }
      ]
    }
  ];
};
