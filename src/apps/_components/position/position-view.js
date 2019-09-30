// @flow
import * as React from 'react';
import { PiramisContext } from '../../shared/piramis-context';
import moment from 'moment';

export default function PositionView(props: {
  position: any,
  address: string,
  lastCommandResult: string
}) {
  if (!props.position) return null;
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, domainData } = context;
  return (
    <div>
      <h2>{labels.get('ultima posizione registrata')}</h2>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Orario')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {moment(props.position.deviceTime).format('DD/MM/YYYY HH:mm:ss')}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Indirizzo rilevato')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.address}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Latitudine')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.position.latitude}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Longitudine')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.position.longitude}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Altitudine')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.position.altitude}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Satelliti')}
        </div>
        <div
          className={`w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-${
            props.position.attributes.sat >= domainData.appSettings.satLimit ? 'green' : 'red'
          }`}
        >
          {props.position.attributes.sat}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Batteria veicolo')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.position.attributes.power}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Batteria dispositivo')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.position.attributes.battery}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Quadro')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.position.attributes.di1 ? labels.get('acceso') : labels.get('spento')}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Avviamento')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.position.attributes.out1 ? labels.get('bloccato') : labels.get('sbloccato')}
        </div>
      </div>
      <div className="flex mt-1 w-full">
        <div className="w-full md:w-1/3 bg-grey-light font-bold p-1 text-left text-grey-darker">
          {labels.get('Esito ultimo comando')}
        </div>
        <div className="w-full md:w-2/3 bg-grey-darker p-1 text-left font-bold text-grey-lighter">
          {props.lastCommandResult || ''}
        </div>
      </div>
    </div>
  );
}
