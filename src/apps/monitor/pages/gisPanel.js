// @flow
import * as React from 'react';
import moment from 'moment';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import { Alert, Confirm } from '../../_components';
import { Button } from 'primereact/button';
import { PiramisContext } from '../../shared/piramis-context';
import { JsonEditor as Editor } from 'jsoneditor-react';
import { HUB_EVENTS } from '../../shared/const';
import { PositionMap, PositionView, PositionWaiting } from '../../_components/position';
import { resolveAddress } from '../../_components/utils';

export default function GisPanel(props: { device: any, vehicle: any, onRefresh: Function }) {
  const google = window.google;

  let jsonEditor: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [lastCommandResult: string, setResult] = React.useState();
  const [gapMapObj: any, setMapInstance] = React.useState();
  const [position: string, setPosition] = React.useState();
  const [address: string, setAddress] = React.useState('');
  const [gisDeviceStatus: string, setGisDeviceStatus] = React.useState('offline');
  const { labels, hub, domainData, gisApi } = context;

  React.useEffect(() => {
    const socketPromise = connectSocket();
    // Specify how to clean up after this effect:
    return async function cleanup() {
      const socket = await socketPromise;
      socket.close(1000, 'cleanuppage');
    };
  }, []);

  React.useEffect(() => {
    if (gapMapObj && position) {
      const newPoint = new google.maps.LatLng(position.latitude, position.longitude);
      gapMapObj.map.setCenter(newPoint);
      gapMapObj.map.panTo(newPoint);
    }
  });

  function onMapReady(map) {
    setMapInstance(map);
  }

  async function updatePosition(position: any) {
    setPosition(position);

    jsonEditor && jsonEditor.jsonEditor.set(position);
    try {
      const addr = await resolveAddress(position);
      setAddress(addr);
    } catch (error) {
      // unable to resolve address but we keep going
      console.log(error);
    }
  }

  async function connectSocket() {
    const gisDevice: any = await initData(props.device, props.vehicle);

    if (!gisDevice) {
      hub.growl(
        'error',
        labels.get(`impossibile verificare i dati gis per device ${props.device.imei}`),
        labels.get('errore caricamento dati')
      );
    }

    const socket = new WebSocket(`${domainData.appSettings.gisWs}/api/socket`);

    socket.onclose = evt => {
      if (evt.reason !== 'cleanuppage') {
        setTimeout(() => connectSocket(), 60 * 1000);
      }
    };

    socket.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.positions) {
        const devicePositions = data.positions.filter(el => el.deviceId === gisDevice.id);
        const pos = devicePositions.length && devicePositions[0];
        if (pos && !pos.attributes.result) {
          console.log(pos);
          hub.dispatch(HUB_EVENTS.GISPOSITION, { position: pos }, 'centraleoperativa');
          updatePosition(pos);
        }
        if (pos && pos.attributes.result) {
          setResult(pos.attributes.result);
          console.log(pos);
          hub.growl('success', pos.attributes.result, labels.get('RISULTATO COMANDO'));
          hub.dispatch(HUB_EVENTS.GISRESULT, { position: pos }, 'centraleoperativa');
        }
      }

      if (data.events) {
        const deviceEvents = data.events.filter(el => el.deviceId === gisDevice.id);
        const evt = deviceEvents.length && deviceEvents[0];
        if (evt) {
          console.log(evt);
          hub.growl(
            'info',
            `${moment(evt.serverTime).format('DD/MM/YYYY HH:mm:ss')} ${evt.type}`,
            labels.get('EVENTO')
          );
        }
      }

      if (data.devices) {
        const deviceInfo = data.devices.filter(el => el.id === gisDevice.id);
        const info = deviceInfo.length && deviceInfo[0];
        if (info) {
          //console.log(info);
          setGisDeviceStatus(info.status);
        }
      }
    };

    return socket;
  }

  async function initData(device: any, vehicle: any) {
    await gisApi.login();
    let gisDevice: any = await gisApi.getDevice(device.imei);
    if (!gisDevice) {
      gisDevice = await gisApi.createDevice(
        device.imei,
        device.tel,
        `${vehicle.plate} - ${vehicle.make} - ${vehicle.model} - ${vehicle.name}`,
        'car'
      );
    }
    await gisApi.setDevice(device.tel, 1800);
    return gisDevice;
  }

  function getPositionFullData(position) {
    if (!position || !domainData.appSettings.fullPositionDetails) return null;
    return (
      <div className="p-grid w-full">
        <div className="p-col-12 mt-3">
          <h2 className="b-2">{labels.get('Dettaglio completo ultima posizione')}</h2>
          <Editor
            mode="view"
            ref={el => {
              jsonEditor = el;
            }}
            ace={ace}
            theme="ace/theme/github"
            navigationBar={true}
            allowedModes={['view', 'code']}
            value={position}
          />
        </div>
      </div>
    );
  }

  function getPositionDetails(position: any) {
    if (!position) return null;
    return (
      <div className="p-grid w-full">
        <div className="p-col-7">
          <PositionView
            position={position}
            address={address}
            lastCommandResult={lastCommandResult}
          />
        </div>
        <div className="p-col-5">
          <PositionMap
            position={position}
            onMapReady={onMapReady}
            gisDeviceStatus={gisDeviceStatus}
          />
        </div>
      </div>
    );
  }

  function getCommands(position: any) {
    if (!position) return null;
    return (
      <div className="p-grid w-full">
        <div className="p-col-12 mt-4">
          <Alert
            color="orange"
            title={labels.get(`COMANDI EMERGENZA`)}
            content={
              <div>
                <p>
                  {labels.get(
                    'Comandi da utilizzare solamente in caso in cui si riscontrino problemi o il dispositivo rimanga in uno stato non desiderato.'
                  )}
                </p>
                <div>
                  <Button
                    className="p-button-info p-button-rounded"
                    label={labels.get('SVEGLIA DISPOSITIVO VIA SMS')}
                    icon="fas fa-info"
                    onClick={async () => {
                      await gisApi.smsCommand(props.device.tel, 'h s getrecord');
                      hub.growl(
                        'info',
                        labels.get('Comando ATTIVA inviato con successo!'),
                        labels.get('OPERAZIONE ESEGUITA')
                      );
                    }}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />
                  <Button
                    className="p-button-success p-button-rounded"
                    label={labels.get('SBLOCCA VIA SMS')}
                    icon="fas fa-unlock"
                    onClick={async () => {
                      await gisApi.smsCommand(props.device.tel, 'h s setdigout 00');
                      hub.growl(
                        'info',
                        labels.get('Comando SBLOCCA inviato con successo!'),
                        labels.get('OPERAZIONE ESEGUITA')
                      );
                    }}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />

                  <Button
                    className="p-button-success p-button-rounded"
                    label={labels.get('SBLOCCA VIA API')}
                    icon="fas fa-unlock"
                    onClick={async () => {
                      await gisApi.sendComand(position.deviceId, 'setdigout 00', 'sblocca', false);
                      hub.growl(
                        'info',
                        labels.get('Comando SBLOCCA inviato con successo!'),
                        labels.get('OPERAZIONE ESEGUITA')
                      );
                    }}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />

                  <Button
                    className="p-button-danger p-button-rounded"
                    label={labels.get('BLOCCA VIA SMS')}
                    icon="fas fa-lock"
                    onClick={async () => {
                      await gisApi.smsCommand(props.device.tel, 'h s setdigout 11');
                      hub.growl(
                        'info',
                        labels.get('Comando BLOCCA inviato con successo!'),
                        labels.get('OPERAZIONE ESEGUITA')
                      );
                    }}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />

                  <Button
                    className="p-button-danger p-button-rounded"
                    label={labels.get('BLOCCA VIA API')}
                    icon="fas fa-lock"
                    onClick={async () => {
                      await gisApi.sendComand(position.deviceId, 'setdigout 11', 'blocca', false);
                      hub.growl(
                        'info',
                        labels.get('Comando BLOCCA inviato con successo!'),
                        labels.get('OPERAZIONE ESEGUITA')
                      );
                    }}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />

                  <Button
                    className="p-button-warning p-button-rounded"
                    label={labels.get('COMANDO CUSTOM VIA SMS')}
                    icon="fas fa-edit"
                    onClick={async () => {
                      const command = await Confirm(
                        labels.get('digita comando'),
                        labels,
                        {},
                        {
                          input: { placeholder: labels.get('digita comando') },
                          icon: 'fas fa-edit',
                          disableConfirm: true
                        }
                      );
                      await gisApi.smsCommand(props.device.tel, command);
                      hub.growl(
                        'info',
                        labels.get('Comando CUSTOM inviato con successo!'),
                        labels.get('OPERAZIONE ESEGUITA')
                      );
                    }}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />

                  <Button
                    className="p-button-warning p-button-rounded"
                    label={labels.get('COMANDO CUSTOM VIA API')}
                    icon="fas fa-edit"
                    onClick={async () => {
                      const command = await Confirm(
                        labels.get('digita comando'),
                        labels,
                        {},
                        {
                          input: { placeholder: labels.get('digita comando') },
                          icon: 'fas fa-edit',
                          disableConfirm: true
                        }
                      );
                      await gisApi.sendComand(position.deviceId, command, command, false);
                      hub.growl(
                        'info',
                        labels.get('Comando CUSTOM inviato con successo!'),
                        labels.get('OPERAZIONE ESEGUITA')
                      );
                    }}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PositionWaiting display={position ? false : true} onRefresh={props.onRefresh} />
      {getCommands(position)}
      {getPositionDetails(position)}
      {getPositionFullData(position)}
    </div>
  );
}
