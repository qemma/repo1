// @flow
import { action, decorate, observable, computed, flow } from "mobx";
import { HUB_EVENTS, PIRAMIS_ROLES } from "../../shared/const";
import { promisedComputed } from "computed-async-mobx";

export const AuthStatuses = {
  NotSet: "NotSet",
  NotAuthenticated: "NotAuthenticated",
  Authenticated: "Authenticated",
  ResetPassword: "ResetPassword",
  ForgotPassword: "ForgotPassword",
  ForgotPasswordSubmit: "ForgotPasswordSubmit",
  UserNotConfirmed: "UserNotConfirmed",
  LoggingOut: "LoggingOut"
};

class AuthStore {
  authService: any;
  entityService: EntityService;
  user: any;
  newPasswordChallengeUser: any;
  authState: any;
  loading: boolean;
  error: any;
  hub: PiramisHub;
  activeCulture: string;
  newSignIn: boolean;
  selfAssociatedRoles = [
    PIRAMIS_ROLES.agente,
    PIRAMIS_ROLES.venditore,
    PIRAMIS_ROLES.admin,
    PIRAMIS_ROLES.collaudo,
    PIRAMIS_ROLES.logistica,
    PIRAMIS_ROLES.superadmin
  ];
  constructor(authService, hub, entityService, activeCulture) {
    this.authService = authService;
    this.entityService = entityService;
    this.user = undefined;
    this.newPasswordChallengeUser = undefined;
    this.authState = AuthStatuses.NotSet;
    this.loading = false;
    this.error = undefined;
    this.hub = hub;
    this.activeCulture = activeCulture;
    this.hub.listen(HUB_EVENTS.AUTHCHANNELL, this, "AUTHCHANNELL");
  }

  async onHubCapsule(capsule) {
    const { channel, payload } = capsule;
    if (channel === HUB_EVENTS.AUTHCHANNELL) {
      if (payload.unauthorized) {
        this.logOut();
      } else if (payload.checkSession) {
        await this.checkCurrentSession();
      }
    }
  }

  checkCurrentSession = flow(
    function*() {
      try {
        this.user = yield this.authService.getCurrentUser();
        this.setAuthState(AuthStatuses.Authenticated);
      } catch {
        this.setAuthState(AuthStatuses.NotAuthenticated);
      }
    }.bind(this)
  );

  verifyUser = flow(
    function*(username, verCode) {
      try {
        this.loading = true;
        yield this.authService.verifyUser(username, verCode);
        yield this.signIn(username, this.user.attributes.password);
        this.error = undefined;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  forgotPassword = flow(
    function*(username) {
      try {
        this.loading = true;
        yield this.authService.forgotPassword(username);
        this.authState = AuthStatuses.ForgotPasswordSubmit;
        this.error = undefined;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  completeNewPassword = flow(
    function*(newPasswordChallengeUser, password, username) {
      try {
        this.loading = true;
        yield this.authService.completeNewPassword(
          newPasswordChallengeUser,
          password
        );
        yield this.signIn(username, password);
        this.error = undefined;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  forgotPasswordSubmit = flow(
    function*(username, code, password) {
      try {
        this.loading = true;
        yield this.authService.forgotPasswordSubmit(username, code, password);
        yield this.signIn(username, password);
        this.error = undefined;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  resendUserVerificationCode = flow(
    function*(username) {
      try {
        this.loading = true;
        yield this.authService.resendUserVerificationCode(username);
        this.error = undefined;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  signIn = flow(
    function*(username, password) {
      try {
        this.loading = true;
        this.newPasswordChallengeUser = undefined;
        this.user = {
          attributes: { email: username, password: password }
        };
        const result = yield this.authService.signIn(username, password);
        this.error = undefined;
        if (
          result.challengeName &&
          result.challengeName === "NEW_PASSWORD_REQUIRED"
        ) {
          this.newPasswordChallengeUser = result;
          this.setAuthState(AuthStatuses.ResetPassword);
        } else {
          this.newSignIn = true;
          yield this.checkCurrentSession(true);
        }
      } catch (error) {
        if (error.code === "UserNotConfirmedException") {
          this.setAuthState(AuthStatuses.UserNotConfirmed);
        } else if (error.code === "PasswordResetRequiredException") {
          this.setAuthState(AuthStatuses.ForgotPasswordSubmit);
        } else {
          this.error = error;
        }
      } finally {
        this.loading = false;
      }
    }.bind(this)
  );

  isInRole = role => {
    if (!role) return false;
    return this.role === role;
  };

  logOut = async () => {
    this.setAuthState(AuthStatuses.LoggingOut);
    this.user = undefined;
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error(error);
    }
    localStorage.clear();
    window.location.href = "/";
  };

  setAuthState = (state, cleanError = false) => {
    this.authState = state;
    if (cleanError) {
      this.error = undefined;
    }
  };

  userFullDetails = promisedComputed(null, async () => {
    if (this.authState !== AuthStatuses.Authenticated) return null;
    const response = await this.authService.refreshUserDetails(
      this.username,
      this.newSignIn,
      this.activeCulture
    );
    let roleEntity = {};
    if (response.entityId) {
      console.log(this.role);
      console.log(this.selfAssociatedRoles);
      if (this.selfAssociatedRoles.includes(this.role)) {
        roleEntity = response;
      } else {
        const entResult = await this.entityService.search({
          type: "match",
          field: "uuid",
          value: response.entityId
        });
        roleEntity = entResult.items[0];
      }
    }
    return { ...response, roleEntity };
  });

  get userDetails() {
    return this.userFullDetails.get();
  }

  get username() {
    return this.user ? this.user.attributes.email : "";
  }

  get role() {
    return this.user && this.user.attributes.profile;
  }
}

export default decorate(AuthStore, {
  user: observable,
  loading: observable,
  error: observable,
  authState: observable,
  username: computed,
  userDetails: computed,
  signIn: action,
  checkCurrentSession: action,
  logout: action,
  resendUserVerificationCode: action,
  verifyUser: action,
  setAuthState: action,
  forgotPassword: action,
  forgotPasswordSubmit: action
});
