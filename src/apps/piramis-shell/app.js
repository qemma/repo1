// @flow
import * as React from 'react';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';
import { inject, observer } from 'mobx-react';
import { TopBar, Profile, Growls } from './layout';
import { SplashScreen, withAuthenticator } from './auth';
import { registerApplication, start, getMountedApps } from 'single-spa';
import { PIRAMIS_ROLES } from '../shared/const';
import GisApi from './api/gis-api';

const registerModules = (context: PiramisContextData, root: string) => {
  const mounted = getMountedApps();

  if (mounted.length === 0) {
    registerApplication(
      // Name of our single-spa application
      root,
      // Our loading function
      () => loadApp(root),
      // Our activity function
      location => true,
      context
    );
    start();
  }
};

const loadApp = root => {
  switch (root) {
    case PIRAMIS_ROLES.admin:
    case PIRAMIS_ROLES.superadmin:
    case PIRAMIS_ROLES.logistica:
      return import('../admin/index.js');
    case PIRAMIS_ROLES.agente:
      return import('../agente/index.js');
    case PIRAMIS_ROLES.dealer:
      return import('../dealer/index.js');
    case PIRAMIS_ROLES.venditore:
      return import('../seller/index.js');
    case PIRAMIS_ROLES.collaudo:
      return import('../collaudo/index.js');
    case PIRAMIS_ROLES.service:
      return import('../service/index.js');
    case PIRAMIS_ROLES.marketing:
      return import('../marketing/index.js');
    case PIRAMIS_ROLES['centrale operativa']:
      return import('../monitor/index.js');
    default:
      return null;
  }
};

class App extends React.Component<{ store: any }> {
  layoutMenuScroller: any;
  printingArea: any;
  onToggleMenu = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.layout.onToggleMenu(e);
  };

  onSidebarClick = e => {
    //e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      this.layoutMenuScroller.moveBar();
    }, 500);
  };

  onWrapperClick = () => {
    this.props.store.layout.wrapperClick();
  };

  componentDidUpdate() {
    this.props.store.layout.updateBodyClass();
    if (this.props.store.auth.userDetails) {
      const domainData: any = this.props.store.auth.userDetails.domainsData.entity
        ? JSON.parse(this.props.store.auth.userDetails.domainsData.entity.description)
        : {};
      const context = {
        labels: this.props.store.labels,
        hub: this.props.store.hub,
        entityService: this.props.store.entityService,
        user: this.props.store.auth.userDetails,
        domainData,
        usersService: this.props.store.auth.role.includes(PIRAMIS_ROLES.admin)
          ? this.props.store.usersService
          : { action: () => null, create: () => null },
        root: this.props.store.auth.role,
        fullReindex: this.props.store.auth.role.includes(PIRAMIS_ROLES.superadmin)
          ? this.props.store.fullReindex
          : null,

        menuPlaceholder: 'menuPlaceholder',
        gisApi: new GisApi(domainData.appSettings)
      };
      registerModules(context, this.props.store.auth.role);
    }
  }

  render() {
    const layout = this.props.store.layout;
    return (
      <SplashScreen loading={!this.props.store.auth.userDetails}>
        <div className={layout.wrapperClass} onClick={this.onWrapperClick}>
          <Growls />
          <TopBar printingArea={this.printingArea} />
          <div className={layout.sidebarClass} onClick={this.onSidebarClick}>
            <ScrollPanel ref={el => (this.layoutMenuScroller = el)} style={{ height: '100%' }}>
              <div className="layout-sidebar-scroll-content">
                <Profile
                  labels={this.props.store.labels}
                  layoutColorMode={layout.layoutColorMode}
                  layoutMode={layout.layoutMode}
                  userRole={this.props.store.auth.role}
                  onChangeMenu={layout.switchLayoutMode}
                  onChangeColor={layout.switchLayoutColorMode}
                />
                <div id="menuPlaceholder" />
              </div>
            </ScrollPanel>
            <div className="layout-sidebar-handle clearfix">
              <a className="layout-menu-button" href="#home" onClick={this.onToggleMenu}>
                <span className="pi pi-bars" />
              </a>
            </div>
          </div>

          <div className="layout-main" ref={el => (this.printingArea = el)}>
            <div id="appPlaceholder" />
          </div>
          <div className="layout-mask" />
        </div>
      </SplashScreen>
    );
  }
}

export default withAuthenticator(inject('store')(observer(App)));
