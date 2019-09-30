// @flow
import * as React from 'react';

const SplashScreen = (props: { loading: boolean, children?: any }) =>
  !props.loading ? (
    <React.Fragment>{props.children || <span />}</React.Fragment>
  ) : (
    <div className="splash-screen">
      <div className="splash-container">
        <div className="splash-double-bounce1" />
        <div className="splash-double-bounce2" />
      </div>
    </div>
  );
export default SplashScreen;
