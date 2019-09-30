// @flow
import * as React from 'react';
import { Button } from 'primereact/button';

export default function HistoryButton(props: { url: string, data: any }) {
  const { url, data, ...rest } = props;
  function onClick() {
    window.location.hash = url;
    window.history.replaceState(data, '', `#/${url}`);
  }
  return <Button {...rest} onClick={onClick} />;
}
