// @flow
import { Confirm } from "../_components";
import Pages from "./pages";

export const getRoutes = (root: string, labels: Localizer, user: any) => {
  return [
    {
      route: `/`,
      component: Pages.Dashboard,
      label: labels.get("datiUtente"),
      icon: "fas fa-user",
      url: `#/`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("dati utente") }
      ]
    },
    {
      route: `/my-tests`,
      component: Pages.List,
      label: labels.get("mieiCollaudi"),
      icon: "fas fa-list",
      url: `#/my-tests`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("i miei collaudi") }
      ]
    },
    {
      route: `/new-test`,
      component: Pages.NewTest,
      command: () => {
        if (localStorage.getItem("activeCollaudo")) {
          Confirm(
            labels.get(
              `Tutti i dati del collaudo in corso verranno persi. Sicuro di voler proseguire? `
            ),
            labels
          )
            .then(() => {
              //ok called
              localStorage.removeItem("activeCollaudo");
              localStorage.removeItem("bot_collaudo");
              if (window.location.hash.includes("new-test")) {
                window.location.hash = "/";
                window.location.hash = "/new-test";
              }
            })
            .catch(() => {
              //nothing
            });
        }
        // localStorage.removeItem('activeCollaudo');
      },
      label: labels.get("nuovoCollaudo"),
      icon: "fas fa-map-marked-alt",
      url: `#/new-test`,
      breadcrumbs: (labels: Localizer) => [
        { label: labels.get(root) },
        { label: labels.get("nuovo collaudo") }
      ]
    }
  ];
};
