// @flow

import * as React from 'react';
type Props = {
  color: 'red' | 'blue' | 'orange',
  title: string,
  content: any
};
const Alert = (props: Props) => (
  <div role="alert">
    <div className={`bg-${props.color} text-white font-bold rounded-t px-4 py-2`}>
      {props.title}
    </div>
    <div
      className={`border border-t-0 border-${props.color}-light rounded-b bg-${
        props.color
      }-lightest px-4 py-3 text-${props.color}-dark`}
    >
      <div>{props.content}</div>
    </div>
  </div>
);

export default Alert;
