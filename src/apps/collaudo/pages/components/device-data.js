// @flow
import * as React from 'react';
import { Alert } from '../../../_components';
import { InputText } from 'primereact/inputtext';
import { PiramisContext } from '../../../shared/piramis-context';
import { ITEM_CATEGORY, ENTITY_STATUS } from '../../../shared/const';

export default function DeviceData(props: { onDeviceScanned: (deviceData: any) => void }) {
  let scanInput: any;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [error: string, setError] = React.useState();
  const { labels, entityService, hub } = context;

  React.useEffect(() => {
    if (scanInput) {
      scanInput.element.focus();
    }
  });

  const onScanEntry = async e => {
    e.persist();
    if (e.key === 'Enter') {
      try {
        setError('');
        hub.loading(true);
        const result = await entityService.search({
          category: ITEM_CATEGORY.device,
          includeParents: true,
          from: 0,
          size: 1,
          filters: {
            status: {
              matchMode: 'match',
              value: ENTITY_STATUS.delivered
            },
            imei: {
              or: true,
              matchMode: 'match',
              value: e.target.value
            },
            sn: {
              or: true,
              matchMode: 'match',
              value: e.target.value
            }
          }
        });
        if (!result.total || result.total > 1) {
          throw new Error(
            labels.get(
              `trovati ${result.total || 0} dispositivi in stato ${
                ENTITY_STATUS.delivered
              } per il codice ${e.target.value}`
            )
          );
        }
        if (result.total === 1) {
          props.onDeviceScanned({
            device: result.items[0],
            order: result.parents[0]
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        hub.loading(false);
      }
    }
  };

  return (
    <div className="p-grid w-full">
      <div className="p-col-12">
        <span className="p-float-label">
          <div className="p-inputgroup">
            <InputText
              id="barcode"
              ref={el => (scanInput = el)}
              onKeyPress={onScanEntry}
              className="w-full"
            />
            <span className="p-inputgroup-addon">
              <i className="fas fa-barcode" />
            </span>
            <label htmlFor="barcode">{labels.get('scansiona device')}</label>
          </div>
        </span>
      </div>
      {error && (
        <div className="p-col-12 mt-4">
          <Alert color="red" title={labels.get('attenzione!')} content={<p>{error}</p>} />
        </div>
      )}
    </div>
  );
}
