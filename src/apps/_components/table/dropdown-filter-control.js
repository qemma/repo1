// @flow
import * as React from 'react';
import { Dropdown } from 'primereact/dropdown';

const DropdownFilterElement = (props: {
  value: any,
  onChange: Function,
  field: string,
  options: Array<any>
}) => (
  <Dropdown
    filter
    filterBy="label"
    className="p-column-filter"
    showClear={true}
    style={{ width: '100%' }}
    value={props.value || ''}
    options={props.options}
    onChange={e => {
      props.onChange({
        value: e.value,
        field: props.field,
        matchType: 'match'
      });
    }}
  />
);

export default DropdownFilterElement;
