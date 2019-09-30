// @flow
import * as React from 'react';
import { GMap } from 'primereact/gmap';

export default function PositionMap(props: {
  position: any,
  onMapReady: Function,
  gisDeviceStatus: string
}) {
  if (!props.position) return null;

  const google = window.google;

  function getMapsData(position) {
    if (!position) return null;

    const options = {
      center: { lat: position.latitude, lng: position.longitude },
      zoom: 20,
      subtree: false
    };
    const overlays = [
      new google.maps.Marker({
        position: { lat: position.latitude, lng: position.longitude },
        title: 'car',
        icon: `assets/gis/auto-${props.gisDeviceStatus}.svg`
      })
    ];

    return { options, overlays };
  }

  const mapData: any = getMapsData(props.position);

  return (
    <GMap
      onMapReady={props.onMapReady}
      overlays={mapData.overlays}
      options={mapData.options}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
