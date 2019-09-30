// @flow
import * as React from 'react';
import { Alert } from '../../../_components';
import { InputText } from 'primereact/inputtext';
import { PiramisContext } from '../../../shared/piramis-context';
import { ITEM_CATEGORY } from '../../../shared/const';

export default function VehicleData(props: { onVehicleScanned: (vehicleData: any) => void }) {
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
    if (e.key === 'Enter') {
      const plate = e.target.value;
      hub.loading(true);
      setError('');
      try {
        const result = await entityService.search({
          category: ITEM_CATEGORY.veicolo,
          includeParents: true,
          from: 0,
          size: 1,
          filters: {
            plate: {
              matchMode: 'match',
              value: plate
            }
          }
        });
        if (!result.total || result.total > 1) {
          throw new Error(labels.get(`trovati ${result.total || 0} veicoli per la targa ${plate}`));
        }
        if (result.total === 1) {
          props.onVehicleScanned({
            vehicle: result.items[0],
            customer: result.parents[0]
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
            <label htmlFor="barcode">{labels.get('inserisci la targa del veicolo')}</label>
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
