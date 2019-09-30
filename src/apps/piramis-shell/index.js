// @flow
import React from "react";
import Amplify from "aws-amplify";
import { AwsConfig } from "../../config/awsConfig";

import { Provider } from "mobx-react";
import Services from "./api";
import ShellStore from "./store";
import App from "./app";

Amplify.configure(AwsConfig);
const store = new ShellStore(
  new Services.HubService(),
  new Services.LogService(),
  Services.AuthService,
  new Services.EntityService(),
  Services.UserService,

  Services.TokenProvider,
  new Services.DangerZoneService(),
  "it"
);

const PiramisShell = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default PiramisShell;
