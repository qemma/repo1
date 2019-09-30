// @flow
import { action, decorate, observable, computed } from 'mobx';

const LayoutColorMode = {
  dark: 'dark',
  light: 'light'
};

const LayoutMode = {
  overlay: 'overlay',
  static: 'static'
};

class LayoutStore {
  loading: boolean;
  layoutColorMode: string;
  layoutMode: string;
  staticMenuInactive: boolean;
  overlayMenuActive: boolean;
  mobileMenuActive: boolean;
  constructor() {
    this.loading = false;
    this.layoutColorMode = localStorage.getItem('layoutColorMode') || LayoutColorMode.dark;
    this.layoutMode = localStorage.getItem('layoutMode') || LayoutMode.static;
    this.staticMenuInactive = false;
    this.overlayMenuActive = false;
    this.mobileMenuActive = false;
    document.getElementsByTagName('body')[0].className = `layout-mode-${this.layoutColorMode}`;
  }

  switchLayoutColorMode = mode => {
    if (mode) {
      this.layoutColorMode = mode;
      localStorage.setItem('layoutColorMode', mode);
      document.getElementsByTagName('body')[0].className = `layout-mode-${this.layoutColorMode}`;
    }
  };

  switchLayoutMode = mode => {
    if (mode) {
      localStorage.setItem('layoutMode', mode);
      this.layoutMode = mode;
    }
  };

  wrapperClick = () => {
    this.overlayMenuActive = false;
    this.mobileMenuActive = false;
  };

  onToggleMenu = event => {
    if (window.innerWidth > 1024) {
      if (this.layoutMode === LayoutMode.overlay) {
        this.overlayMenuActive = !this.overlayMenuActive;
      } else if (this.layoutMode === LayoutMode.static) {
        this.staticMenuInactive = !this.staticMenuInactive;
      }
    } else {
      this.mobileMenuActive = !this.mobileMenuActive;
    }
  };

  addClass(element: any, className: string) {
    if (element.classList) element.classList.add(className);
    else element.className += ' ' + className;
  }

  removeClass(element: any, className: string) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
  }

  updateBodyClass = () => {
    if (this.mobileMenuActive) this.addClass(document.body, 'body-overflow-hidden');
    else this.removeClass(document.body, 'body-overflow-hidden');
  };

  get sidebarClass() {
    return `layout-sidebar layout-sidebar-${this.layoutColorMode}`;
  }

  get wrapperClass() {
    const ret = ['layout-wrapper'];
    if (this.layoutMode === LayoutMode.static) {
      ret.push('layout-static');
      if (this.staticMenuInactive) ret.push('layout-static-sidebar-inactive');
    } else if (this.layoutMode === LayoutMode.overlay) {
      ret.push('layout-overlay');
      if (this.overlayMenuActive) ret.push('layout-overlay-sidebar-active');
    }

    if (this.mobileMenuActive) ret.push('layout-mobile-sidebar-active');
    return ret.join(' ');
  }

  get logo() {
    return this.layoutColorMode === LayoutColorMode.dark
      ? 'assets/layout/images/logo_piramis.png'
      : 'assets/layout/images/logo_piramis.png';
  }
}

export default decorate(LayoutStore, {
  layoutColorMode: observable,
  loading: observable,
  layoutMode: observable,
  staticMenuInactive: observable,
  overlayMenuActive: observable,
  mobileMenuActive: observable,
  sidebarClass: computed,
  logo: computed,
  wrapperClass: computed,
  switchLayoutColorMode: action,
  switchLayoutMode: action,
  wrapperClick: action,
  onToggleMenu: action
});
