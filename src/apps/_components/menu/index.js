// @flow
import * as React from 'react';
import classNames from 'classnames';
import { observable, action, decorate } from 'mobx';
import { observer } from 'mobx-react';

class AppSubmenu extends React.Component<{
  className: string,
  items: Array<any>,
  onMenuItemClick: Function,
  root: boolean
}> {
  activeIndex = null;

  setActiveIndex = index => {
    if (index !== this.activeIndex) this.activeIndex = index;
    else this.activeIndex = null;
  };

  onMenuItemClick(event, item, index) {
    //avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    //execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    //prevent hash change
    if (item.items || !item.url) {
      event.preventDefault();
    }

    this.setActiveIndex(index);

    if (this.props.onMenuItemClick) {
      this.props.onMenuItemClick({
        originalEvent: event,
        item: item
      });
    }
  }

  render() {
    let items =
      this.props.items &&
      this.props.items
        .filter(el => el.url)
        .map((item, i) => {
          // console.log(`---------------elemento ${item.label}-------------`);
          // console.log(this.activeIndex);
          // console.log(i);
          // console.log(window.location.hash);
          // console.log(item.url);
          let active =
            this.activeIndex === i ||
            (this.activeIndex === null && item.url === window.location.hash);
          let styleClass = classNames(item.badgeStyleClass, {
            'active-menuitem': active
          });
          let badge = item.badge && <span className="menuitem-badge">{item.badge}</span>;
          let submenuIcon = item.items && (
            <i className="pi pi-fw pi-angle-down menuitem-toggle-icon" />
          );

          return (
            <li className={styleClass} key={`${i}-${item.label}`}>
              {item.items && this.props.root === true && <div className="arrow" />}
              <a
                href={item.url}
                onClick={e => this.onMenuItemClick(e, item, i)}
                target={item.target}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
                {submenuIcon}
                {badge}
              </a>
              <ReactiveSubmenu items={item.items} onMenuItemClick={this.props.onMenuItemClick} />
            </li>
          );
        });

    return items ? <ul className={this.props.className}>{items}</ul> : null;
  }
}

const ReactiveSubmenu = observer(
  decorate(AppSubmenu, {
    activeIndex: observable,
    setActiveIndex: action
  })
);

export default (props: { model: Array<any>, onMenuItemClick: Function }) => (
  <div className="menu">
    <ReactiveSubmenu
      items={props.model}
      className="layout-main-menu"
      onMenuItemClick={props.onMenuItemClick}
      root={true}
    />
  </div>
);
