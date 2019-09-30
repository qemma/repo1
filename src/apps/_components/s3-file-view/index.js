// @flow
import * as React from 'react';
import CameraUploader from '../docs-uploader';
import { Button } from 'primereact/button';
import { PiramisContext } from '../../shared/piramis-context';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function S3Files(props: { docs: Array<any>, dockey: string, onNewDoc?: Function }) {
  const context: PiramisContextData = React.useContext(PiramisContext);
  const [docs: Array<any>, setDocs] = React.useState(props.docs || []);
  const [loading: boolean, setLoading] = React.useState(false);
  const { labels, entityService, hub } = context;

  async function download(key: string) {
    try {
      setLoading(true);
      hub.loading(true);
      const url = await entityService.download(key);
      console.log(url);
      window.open(url, '_blank');
    } catch {
      hub.growl(
        'error',
        labels.get('errore download file'),
        labels.get('errore durante il download del file. Si prega di riprovare.')
      );
    } finally {
      setLoading(false);
      hub.loading(false);
    }
  }

  function fileUploaded(file: any) {
    const updtDocs = docs.filter(el => el.key !== file.key).concat(file);
    setDocs(updtDocs);
    if (!props.onNewDoc) return;
    props.onNewDoc(updtDocs);
  }

  async function deleteFile(key: string) {
    try {
      setLoading(true);
      hub.loading(true);
      await entityService.delFile(key);
      const updtDocs = docs.filter(file => file.key !== key);
      setDocs(updtDocs);
      if (!props.onNewDoc) return;
      props.onNewDoc(updtDocs);
    } catch (error) {
      hub.growl(
        'error',
        labels.get('errore cancellazione file'),
        labels.get('errore durante la cancellazione. Si prega di riprovare.')
      );
    } finally {
      setLoading(false);
      hub.loading(false);
    }
  }

  return (
    <DataTable
      value={docs}
      header={
        props.onNewDoc ? (
          <div className="p-clearfix" style={{ lineHeight: '1.87em' }} tooltip="Aggiungi documento">
            <CameraUploader
              style={{ float: 'right' }}
              tooltip={labels.get('aggiungi nuovi file')}
              path={props.dockey}
              onFileUploaded={fileUploaded}
            />
          </div>
        ) : null
      }
    >
      <Column
        field="key"
        header="file"
        style={{ maxWidth: '100px', wordWrap: 'break-word' }}
        body={file => {
          const fileParts = file.key.split('/');
          const fileName = fileParts[fileParts.length - 1];
          return fileName;
        }}
      />
      <Column
        style={{ maxWidth: '100px', wordWrap: 'break-word', textAlign: 'center' }}
        body={file => (
          <div>
            <Button
              type="button"
              disabled={loading}
              icon="fas fa-eye"
              className="p-button-success"
              onClick={() => download(file.key)}
              style={{ marginRight: '.5em' }}
            />
            {props.onNewDoc && (
              <Button
                type="button"
                disabled={loading}
                icon="fas fa-trash"
                className="p-button-danger"
                onClick={() => deleteFile(file.key)}
              />
            )}
          </div>
        )}
      />
    </DataTable>
  );
}
