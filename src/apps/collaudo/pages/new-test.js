// @flow
import * as React from 'react';
import { Steps } from 'primereact/steps';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { PiramisContext } from '../../shared/piramis-context';
import DeviceData from './components/device-data';
import VehicleData from './components/vehicle-data';
import VerifyData from './components/verify-data';
import GisDashboard from './components/gis-dashboard';
import CollectDocs from './components/get-docs';
import CollaudoPdf from './components/collaudo-pdf';
import { ITEM_CATEGORY, ENTITY_STATUS } from '../../shared/const';
import { createHistory } from '../../_components/utils';
import { Alert } from '../../_components';

function saveData(testData: any) {
  try {
    localStorage.setItem('activeCollaudo', JSON.stringify(testData));
  } catch (error) {}
}

function getData() {
  const state = localStorage.getItem('activeCollaudo');
  if (state) {
    return JSON.parse(state);
  } else {
    return null;
  }
}
export default function NewTest() {
  const savedData = getData();
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, gisApi } = context;
  const [activeStep: number, setActiveStep] = React.useState(savedData ? savedData.step : 0);

  const [deviceData: { device: any, order: any }, setDeviceData] = React.useState(
    savedData ? savedData.deviceData : undefined
  );

  const [docs: Array<any>, setDocs] = React.useState(savedData ? savedData.docs : []);
  const [refreshingGis: boolean, setRefreshGis] = React.useState(false);
  const [vehicleData: { vehicle: any, customer: any }, setVehicleData] = React.useState(
    savedData ? savedData.vehicleData : undefined
  );
  const [validSelection: boolean, setValidSelection] = React.useState(
    savedData ? savedData.validSelection : false
  );
  const [collaudoResult: any, setCollaudoResult] = React.useState(
    savedData ? savedData.collaudoResult : undefined
  );

  const [finalSaveStatus: any, setFinalSaveStatus] = React.useState(
    savedData ? savedData.finalSaveStatus : undefined
  );

  React.useEffect(() => {
    saveData({
      step: activeStep,
      vehicleData,
      deviceData,
      validSelection,
      collaudoResult,
      finalSaveStatus,
      docs
    });
  });

  const steps = [
    { label: labels.get('scansiona dispositivo'), value: 0 },
    { label: labels.get('cerca veicolo'), value: 1 },
    { label: labels.get('verifica dati'), value: 2 },
    { label: labels.get('test GIS'), value: 3 },
    { label: labels.get('carica documenti'), value: 4 },
    { label: labels.get('firma e registra'), value: 5 }
  ];

  const completeCollaudo = async (esitoFile: any, codCollaudo: string) => {
    setActiveStep(6);
    setFinalSaveStatus({ error: false, esitoFile, codCollaudo, loading: true });
    try {
      if (!vehicleData || !deviceData) throw new Error('missing required vehicle and device data'); // this should never happen

      const sell: any = await getSell(
        vehicleData.vehicle.group,
        vehicleData.vehicle.uuid,
        vehicleData.customer.uuid
      );

      const files = (docs || []).concat(esitoFile);
      const collaudo: any = {
        uuid: codCollaudo,
        items: files.map(el => el.key),
        reference1: vehicleData.vehicle.plate,
        reference2: deviceData.device.imei,
        carId: vehicleData.vehicle.itemId,
        category: ITEM_CATEGORY.collaudo,
        status: ENTITY_STATUS.inserted,
        group: vehicleData.vehicle.group,
        parentId: sell.uuid
      };
      const deviceHistory: any = createHistory(
        deviceData.device,
        `Eseguito collaudo per vendita ${sell.uuid}. Veicolo: ${vehicleData.vehicle.plate}`
      );
      const device = {
        ...deviceData.device,
        status: ENTITY_STATUS.installed,
        plate: vehicleData.vehicle.plate,
        km: 0,
        notes: `Eseguito collaudo per vendita ${sell.uuid}. Veicolo: ${vehicleData.vehicle.plate}`
      };

      let executedTests = (sell.tests || []).concat(codCollaudo);
      const updtSell = {
        ...sell,
        tests: executedTests,
        status: executedTests.length === sell.reference2.length ? ENTITY_STATUS.closed : sell.status
      };

      const updatedVehicle = {
        ...vehicleData.vehicle,
        imei: device.imei,
        km: 0
      };

      await entityService.put([collaudo, deviceHistory, updtSell, device, updatedVehicle]);
      await gisApi.setDevice(deviceData.device.tel, 30);
      setFinalSaveStatus({ error: false, esitoFile, codCollaudo, loading: false });
    } catch (error) {
      console.error(error);
      setFinalSaveStatus({ error: true, esitoFile, codCollaudo, loading: false });
    }
  };

  const getSell = async (group: string, vehicleId: string, customerId: string) => {
    const data = await entityService.search({
      type: 'match',
      field: 'category',
      value: ITEM_CATEGORY.vendita,
      filters: {
        group: { matchMode: 'match', value: group },
        status: { matchMode: 'match', value: ENTITY_STATUS.inserted },
        reference1: { matchMode: 'match', value: customerId },
        reference2: { matchMode: 'match', value: vehicleId }
      }
    });
    return data.items[0];
  };

  const deviceScanned = (deviceScanned: { device: any, order: any }) => {
    setDeviceData(deviceScanned);
    if (vehicleData && vehicleData.vehicle) {
      setValidSelection(deviceScanned.order.group === vehicleData.vehicle.group);
    } else {
      setValidSelection(false);
    }
    setActiveStep(1);
  };

  const vehicleScanned = (vehicleScanned: { vehicle: any, customer: any }) => {
    setVehicleData(vehicleScanned);
    if (deviceData && deviceData.order) {
      setValidSelection(deviceData.order.group === vehicleScanned.vehicle.group);
    } else {
      setValidSelection(false);
    }
    setActiveStep(2);
  };

  const onStepChange = e => {
    // navigate manually only on the first 4 steps. once collaudo is over you can't go back
    if (activeStep > 3) return;

    let proceed = false;
    if (e.index === 0) {
      proceed = true;
    } else if (e.index === 1) {
      proceed = deviceData ? true : false;
    } else if (e.index === 2) {
      proceed = deviceData && vehicleData ? true : false;
    } else if (e.index === 3) {
      proceed = deviceData && vehicleData && validSelection ? true : false;
    }

    if (proceed) {
      setActiveStep(e.index);
    }
  };

  const getSelectionSummary = () => {
    if (!deviceData && !vehicleData) return null;
    return (
      <div style={{ marginBottom: '2em' }}>
        <h2>{labels.get('dispositivo e veicolo selezionati:')}</h2>
        {deviceData && deviceData.device && (
          <div
            aria-live="polite"
            style={{ marginRight: '1rem', marginTop: '1rem' }}
            className="p-message p-component p-message-info"
          >
            <span className="p-message-text">
              <span>
                <strong>{labels.get('dispositivo SN/IMEI')}: </strong>
                {deviceData.device.sn} - {deviceData.device.imei}
              </span>
            </span>
          </div>
        )}
        {vehicleData && vehicleData.vehicle && (
          <div
            aria-live="polite"
            style={{ marginRight: '1rem', marginTop: '1rem' }}
            className="p-message p-component p-message-info"
          >
            <span className="p-message-text">
              <span>
                <strong>{labels.get('targa veicolo')}: </strong>
                {vehicleData.vehicle.plate}
              </span>
            </span>
          </div>
        )}
      </div>
    );
  };

  function resetGisDashboard() {
    setRefreshGis(true);
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setRefreshGis(false);
    }, 1000);
  }

  function onCollaudoEnd(steps, values) {
    const res: any = {
      steps,
      values
    };
    setCollaudoResult(res);
    setActiveStep(4);
  }

  function FinalStatus(props: { status: any }) {
    const status = props.status;
    return (
      <Alert
        color={status.error ? 'red' : status.loading ? 'blue' : 'green'}
        title={labels.get(`Salvataggio dati di collaudo`)}
        content={
          <div>
            {status.loading && (
              <div className="mb-2">
                <div className="mb-2">
                  {labels.get(
                    `Salvataggio dati di collaudo e aggiornamento in corso. Si prega di attendere...`
                  )}
                </div>
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
              </div>
            )}
            {!status.error && !status.loading && (
              <div className="mb-2">
                {labels.get(
                  'Dati salvati con successo. Puoi chiudere il browser o iniziare un nuovo collaudo.'
                )}
              </div>
            )}
            {status.error && (
              <div className="mb-2">
                <div className="mb-2">
                  {labels.get(
                    'Errore salvataggio dati. Si prega di riprovare. Se il problema persiste contattare gli amministratori di sistema'
                  )}
                </div>
                <Button
                  label={labels.get(`Riprova`)}
                  onClick={() => {
                    completeCollaudo(status.esitoFile, status.codCollaudo);
                  }}
                  className={`p-button-danger p-button-rounded`}
                />
              </div>
            )}
          </div>
        }
      />
    );
  }

  return (
    <Card title={labels.get('Nuovo Collaudo')}>
      <fieldset className="p-fieldset p-component">
        {activeStep !== 6 && (
          <Steps model={steps} activeIndex={activeStep} readOnly={false} onSelect={onStepChange} />
        )}
        {getSelectionSummary()}
        {activeStep === 0 && <DeviceData onDeviceScanned={deviceScanned} />}
        {activeStep === 1 && <VehicleData onVehicleScanned={vehicleScanned} />}
        {activeStep === 2 && (
          <VerifyData
            deviceData={deviceData}
            vehicleData={vehicleData}
            onProceed={() => setActiveStep(3)}
            isValid={validSelection}
          />
        )}
        {activeStep === 3 && (
          <div>
            {!refreshingGis && (
              <GisDashboard
                device={deviceData && deviceData.device}
                vehicle={vehicleData && vehicleData.vehicle}
                onRefresh={resetGisDashboard}
                onCollaudoEnd={onCollaudoEnd}
              />
            )}
            {refreshingGis && (
              <div className="text-center">
                <i
                  className="fas fa-circle-notch fa-spin text-grey-light"
                  style={{ fontSize: '20em' }}
                />
              </div>
            )}
          </div>
        )}
        {activeStep === 4 && deviceData && vehicleData && (
          <CollectDocs
            dockey={`${deviceData.device.imei}/${vehicleData.vehicle.plate}/`}
            onNewDoc={docs => setDocs(docs)}
            docs={docs}
            onProceed={() => setActiveStep(5)}
          />
        )}
        {activeStep === 5 && deviceData && vehicleData && (
          <CollaudoPdf
            dockey={`${deviceData.device.imei}/${vehicleData.vehicle.plate}/`}
            collaudo={{
              vehicleData,
              deviceData,
              validSelection,
              collaudoResult,
              docs
            }}
            onCollaudoEnd={completeCollaudo}
          />
        )}
        {activeStep === 6 && finalSaveStatus && <FinalStatus status={finalSaveStatus} />}
      </fieldset>
    </Card>
  );
}
