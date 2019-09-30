// @flow
import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { observer } from 'mobx-react';
import { decorate, observable } from 'mobx';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import { getClassNames } from '../utils';

const PlaceToAddressMapper = {
  street_number: ['number', 'short_name'],
  route: ['route', 'long_name'],
  bus_station: ['route', 'long_name'],
  establishment: ['route', 'long_name'],
  point_of_interest: ['route', 'long_name'],
  rotransit_stationute: ['route', 'long_name'],
  neighborhood: ['route', 'long_name'],
  locality: ['locality', 'long_name'],
  administrative_area_level_3: ['municipality', 'long_name'],
  administrative_area_level_2: ['province', 'short_name'],
  administrative_area_level_1: ['region', 'long_name'],
  country: ['country', 'long_name'],
  postal_code: ['zipCode', 'short_name']
};

type Props = {
  value: string,
  icon: string,
  onChange: Function,
  width: any,
  label: string,
  style: any,
  isValid: boolean,
  className: string
};
class Places extends Component<Props> {
  userText: string;
  formattedAddress: string;
  error: any;
  constructor(props) {
    super(props);
    this.userText = props.value || '';
    this.formattedAddress = props.value || '';
    this.error = undefined;
    this.getAddressStructure(this.formattedAddress);
  }

  handleChange = userText => {
    this.error = undefined;
    this.userText = userText;
    this.formattedAddress = '';
    this.props.onChange({ route: this.userText });
  };

  handleError = (status, clearSuggestions) => {
    this.error = status;
    clearSuggestions();
  };

  getAddressStructure = async address => {
    if (!address) return null;
    const place = await geocodeByAddress(address);
    this.formattedAddress = place[0].formatted_address;
    const normalizedAddress = place[0].address_components.reduce((acc, component) => {
      const type = component.types[0];
      const mapPart = PlaceToAddressMapper[type];
      if (!mapPart) return acc;
      return {
        ...acc,
        [mapPart[0]]: component[mapPart[1]]
      };
    }, {});

    return { ...normalizedAddress, formatted_address: this.formattedAddress };
  };

  handleSelect = async address => {
    try {
      this.userText = address;
      const normalizedAddress = await this.getAddressStructure(address);
      this.props.onChange(normalizedAddress);
    } catch (error) {
      this.error = error;
    }
  };

  render() {
    const { label, className, icon } = this.props;
    return (
      <PlacesAutocomplete
        value={this.userText}
        debounce={500}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onError={this.handleError}
        shouldFetchSuggestions={this.userText.length > 2}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="places-container relative">
            <span className="p-float-label">
              <div className="p-inputgroup">
                <InputText {...getInputProps({})} className={`w-full ${className || ''}`} />
                <span className="p-inputgroup-addon">
                  <i className={icon} />
                </span>
                <label htmlFor="piva">{label}</label>
              </div>
            </span>
            <div className="places-dropdown-container w-full border border-solid border-grey-lightest rounded rounded-t-none">
              {loading && <i className="pi pi-spin pi-spinner" />}
              {suggestions.map(suggestion => {
                const className = getClassNames(
                  'p-3 text-left cursor-pointer',
                  suggestion.active ? ' bg-grey-lightest' : 'bg-white'
                );

                return (
                  /* eslint-disable react/jsx-key */
                  <div {...getSuggestionItemProps(suggestion, { className })}>
                    <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                    <small>{suggestion.formattedSuggestion.secondaryText}</small>
                  </div>
                  /* eslint-enable react/jsx-key */
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default observer(
  decorate(Places, {
    userText: observable,
    error: observable,
    formattedAddress: observable
  })
);
