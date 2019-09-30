// @flow
import * as React from 'react';
import Camera from '../camera';
import { Button } from 'primereact/button';
import { Confirm } from '../../_components';
import { PiramisContext } from '../../shared/piramis-context';
import ModalContainer from '../modals';
import { ProgressBar } from 'primereact/progressbar';
import moment from 'moment';

type Props = {
  style: any,
  tooltip: string,
  onFileUploaded: Function,
  path: string
};
let camera: any;
const audio = window.Audio ? new window.Audio('/assets/capture.mp3') : {};
export default function CameraUploader(props: Props) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const { labels, entityService, hub } = context;
  const [loading: any, setLoading] = React.useState(false);
  const [progress: any, setProgress] = React.useState(0);
  const [opened: any, setOpened] = React.useState(false);

  async function takePicture(dataUri) {
    setLoading(true);
    try {
      audio.play();
      const blob = await camera.capture();
      camera.pause();
      const filename = await Confirm(
        labels.get('nome del file'),
        labels,
        {},
        {
          input: { placeholder: labels.get('nome del file') },
          icon: 'fas fa-file-image',
          disableConfirm: true
        }
      );
      const file = await entityService.upload(
        blob,
        `${props.path}${filename || moment().unix()}.jpeg`,
        (prog, total) => {
          const progress = (prog * 100) / total;
          setProgress(Math.round(progress));
        }
      );
      props.onFileUploaded(file);
    } catch (error) {
      if (error !== 'user cancelled') {
        console.log(error);
        hub.growl(
          'error',
          labels.get('errore upload file'),
          labels.get('errore durante il caricamento del file. Si prega di riprovare.')
        );
      }
    } finally {
      setProgress(0);
      camera && camera.resume();
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <ModalContainer
        onClose={() => {
          camera = null;
          setOpened(false);
        }}
        visible={opened}
        height="100%"
        closeOnOutside
        hidePrint
        header={labels.get('Fotografa il documento da caricare')}
        width="100%"
      >
        <div style={{ position: 'relative' }}>
          {loading && <ProgressBar value={progress} />}
          <Camera
            onClick={takePicture}
            ref={cam => {
              if (cam) camera = cam;
            }}
          >
            <Button
              disabled={loading}
              onClick={takePicture}
              style={{
                width: '20%',
                position: 'fixed',
                top: '25px',
                left: '50%',
                transform: 'translate(-50%,0)'
              }}
              icon="fas fa-camera"
              className="button p-button-icon-only"
            />
          </Camera>
        </div>
      </ModalContainer>
      <Button
        style={props.style}
        tooltip={props.tooltip}
        className="p-button p-component p-button-secondary p-button-icon-only"
        icon="fas fa-camera"
        onClick={() => setOpened(true)}
      />
    </React.Fragment>
  );
}
