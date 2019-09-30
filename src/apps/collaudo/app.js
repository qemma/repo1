// @flow
import * as React from "react";
import { getRoutes } from "./config";
import AppContainer from "../shared/app-container";
import { Alert } from "../_components";

// const displayNotifications = result => {
//   if ("Notification" in window) {
//     if (Notification.permission === "granted") {
//       const notification = new Notification(`Risultato comando: ${result}`);
//       //setTimeout(notification.close.bind(notification), 4 * 1000);
//     } else if (Notification.permission !== "denied") {
//       Notification.requestPermission(permission => {
//         if (permission === "granted") {
//           displayNotifications(result);
//         }
//       });
//     }
//   }
// };

export default class Collaudo extends React.Component<
  PiramisAppContext,
  { hasError: boolean }
> {
  routes = getRoutes(this.props.root, this.props.labels, this.props.user);
  state = { hasError: false };

  // componentDidMount() {
  //   this.gisLogin();
  // }

  // async gisLogin() {
  //   const gisLoginReq = await fetch(
  //     "https://gis.piramisprogettispeciali.com/api/session?token=mVfTg5SGPgakPqk8ApIDsmEqZ061D63i",
  //     {
  //       credentials: "include"
  //     }
  //   );
  //   const auth = await gisLoginReq.json();
  // }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) {
      return (
        <Alert
          color="red"
          title={this.props.labels.get("error")}
          content={
            <p>
              {this.props.labels.get(
                "si e' verificato un errore inaspettato. Si prega di riprovare e segnalare il problema"
              )}
            </p>
          }
        />
      );
    }
    return (
      <AppContainer {...this.props} routes={this.routes} name="Collaudo" />
    );
  }
}
