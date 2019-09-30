// @flow
import * as React from 'react';
import { Button } from 'primereact/button';
import { Confirm } from '../../_components';
import { InputText } from 'primereact/inputtext';

type Props = {
  sim: any,
  sat: any,
  style?: any,
  labels: Localizer,
  onUnlink: (sat: any, sim: any, notes: string) => void
};
class UnlinkSim extends React.Component<Props, { loading: boolean, notes: string }> {
  state = { loading: false, notes: '' };

  unlink = () => {
    Confirm(this.props.labels.get(`Sicuro di voler proseguire?`), this.props.labels).then(() => {
      //ok called
      this.setState({ loading: true }, async () => {
        try {
          await this.props.onUnlink(this.props.sat, this.props.sim, this.state.notes);
        } finally {
          this.setState({ loading: false });
        }
      });
    });
  };

  render() {
    return (
      <div className="w-full py-4">
        <div className="p-inputgroup w-full">
          <InputText
            className="w-full"
            value={this.state.notes}
            placeholder={this.props.labels.get("per rimuovere l'abbinamento inserisci una nota")}
            onChange={e => this.setState({ notes: e.target.value })}
          />
          <Button
            disabled={!this.state.notes}
            style={this.props.style}
            tooltip={this.props.labels.get('visualizza dettaglio')}
            className="p-button-danger"
            icon={this.state.loading ? 'fas fa-circle-notch fa-spin' : 'fas fa-unlink'}
            onClick={this.unlink}
          />
        </div>
      </div>
    );
  }
}

export default UnlinkSim;
