// @flow
import * as React from "react";
import classNames from "classnames";
import { observer, inject } from "mobx-react";
import { observable, action, decorate } from "mobx";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { PIRAMIS_ROLES } from "../../shared/const";

class AppInlineProfile extends React.Component<{
  store: any,
  onChangeColor: Function,
  onChangeMenu: Function,
  labels: any,
  userRole: string,
  layoutColorMode: any,
  layoutMode: any
}> {
  expanded = false;
  colorOptions = [
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" }
  ];

  menuOptions = [
    { label: "Static", value: "static" },
    { label: "Overlay", value: "overlay" }
  ];

  toggleMenu = event => {
    this.expanded = !this.expanded;
    event.preventDefault();
  };

  logout = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.store.auth.logOut();
  };

  changeColor = e => {
    this.props.onChangeColor(e.value);
  };

  changeMenu = e => {
    this.props.onChangeMenu(e.value);
  };

  render() {
    const auth = this.props.store.auth;
    const labels = this.props.labels;
    const role = this.props.userRole;
    return (
      <div className="profile">
        <div>
          <img src="assets/layout/images/logo_piramis.png" alt="" />
        </div>
        <a className="profile-link" href="#account" onClick={this.toggleMenu}>
          <span className="username" style={{ marginRight: "5px" }}>
            {auth.username}
          </span>
          <i className="fas fa-user-cog" />
        </a>

        <ul
          className={classNames({
            "profile-expanded": this.expanded
          })}
        >
          <li>
            <div className="sidebar-button">
              <span>{labels.get("menuTheme")}</span>
              <SelectButton
                value={this.props.layoutColorMode}
                options={this.colorOptions}
                onChange={this.changeColor}
              />
            </div>
          </li>
          <li>
            <div className="sidebar-button">
              <span>{labels.get("menuType")}</span>
              <SelectButton
                value={this.props.layoutMode}
                options={this.menuOptions}
                onChange={this.changeMenu}
              />
            </div>
          </li>
          <li>
            <a href="#logout" onClick={this.logout}>
              <i className="pi pi-fw pi-power-off" />
              <span>Logout</span>
            </a>
          </li>
          <li>
            <div>{auth.userDetails.group}</div>
          </li>

          {role === PIRAMIS_ROLES.superadmin && (
            <li>
              <div className="sidebar-button">
                <Button
                  label="Danger zone"
                  className="p-button p-component p-button-rounded p-button-danger p-button-text-only"
                  onClick={() =>
                    (window.location.hash = "/superadmin/dangerzone")
                  }
                />
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default inject("store")(
  observer(
    decorate(AppInlineProfile, {
      expanded: observable,
      toggleMenu: action
    })
  )
);
