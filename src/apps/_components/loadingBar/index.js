// @flow
import * as React from 'react';
import './style.css';

const AppLoadingBar = (props: { loading: boolean }) =>
  props.loading ? (
    <div className="load-bar">
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
    </div>
  ) : null;

export default AppLoadingBar;
