import React, { Component } from 'react';
import Barcode from './barcode';

export class DeviceLabel extends Component {
  render() {
    const { sn, imei, phone } = this.props;
    return (
      <div className="label-barcodes">
        <div>
          <Barcode value={sn} text={`sn: ${sn}`} />
        </div>
        <div>
          <Barcode value={imei} text={`imei: ${imei}`} />
        </div>
        <div>
          <Barcode value={phone} text={`num: ${phone}`} />
        </div>
      </div>
    );
  }
}

export class DeviceLabelList extends Component {
  render() {
    const { items, id } = this.props;
    const height = 15;
    const fontSize = 8;
    return (
      <div id={id}>
        {items.map(item => {
          const { sn, imei, phone } = item;
          return (
            <div className="label-barcodes" key={sn}>
              <div>
                <Barcode value={sn} height={height} fontSize={fontSize} text={`sn: ${sn}`} />
              </div>
              <div>
                <Barcode value={imei} height={height} fontSize={fontSize} text={`imei: ${imei}`} />
              </div>
              <div>
                <Barcode value={phone} height={height} fontSize={fontSize} text={`num: ${phone}`} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
