import React, { Component } from 'react';
import JsBarcode from 'jsbarcode';
import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.string.isRequired,
  renderer: PropTypes.string,
  format: PropTypes.string,
  text: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  displayValue: PropTypes.bool,
  fontOptions: PropTypes.string,
  font: PropTypes.string,
  textAlign: PropTypes.string,
  textPosition: PropTypes.string,
  textMargin: PropTypes.number,
  fontSize: PropTypes.number,
  background: PropTypes.string,
  lineColor: PropTypes.string,
  margin: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number
};
export default class Barcode extends Component {
  componentDidMount() {
    this.renderBarcode();
  }

  shouldComponentUpdate(nextProps) {
    return Object.keys(propTypes).some(k => this.props[k] !== nextProps[k]);
  }

  componentDidUpdate() {
    this.renderBarcode();
  }

  renderBarcode = () => {
    try {
      new JsBarcode(this.barcodeHolder, this.props.value, Object.assign({}, this.props));
    } catch (e) {
      window.console.error(e);
    }
  };

  render() {
    const renderer = this.props.renderer;
    switch (renderer) {
      case 'canvas':
        return <canvas ref={el => (this.barcodeHolder = el)} />;
      case 'img':
        return <img ref={el => (this.barcodeHolder = el)} alt={this.props.value} />;
      default:
        return <svg ref={el => (this.barcodeHolder = el)} />;
    }
  }
}

Barcode.propTypes = {
  ...propTypes
};

Barcode.defaultProps = {
  format: 'CODE128',
  renderer: 'svg',
  width: 1,
  height: 70,
  displayValue: true,
  fontOptions: '',
  font: 'monospace',
  textAlign: 'center',
  textPosition: 'bottom',
  textMargin: 1,
  fontSize: 14,
  value: 'Piramis',
  background: '#ffffff',
  lineColor: '#000000',
  margin: 5
};
