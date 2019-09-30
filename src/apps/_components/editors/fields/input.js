// @flow
import * as React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { getClassNames } from '../../utils';
import Places from '../../places';

type Props = {
  value: any,
  id: string,
  label: string,
  onChange: Function,
  icon?: string,
  className?: string,
  input?: any,
  errors: any,
  addonComponent?: any
};

export const InputField = (props: Props) => (
  <div className="p-col-12 mt-4">
    <span className="p-float-label">
      <div className="p-inputgroup">
        <InputText
          {...props.input || {}}
          value={props.value || ''}
          className={getClassNames(
            props.className || 'w-full',
            props.errors[props.id] && 'p-error'
          )}
          onChange={props.onChange}
          id={props.id}
        />
        <span className="p-inputgroup-addon">
          <i
            className={getClassNames(
              props.icon,
              props.errors[props.id] ? 'text-red' : 'text-green'
            )}
          />
          {props.addonComponent}
        </span>
        <label htmlFor={props.id}>{props.label}</label>
      </div>
    </span>
  </div>
);

export const TextAreaField = (props: Props) => (
  <div className="p-col-12 mt-4">
    <label htmlFor={props.id}>{props.label}</label>
    <div className="p-inputgroup">
      <InputTextarea
        {...props.input || {}}
        value={props.value || ''}
        className={getClassNames(props.className || 'w-full', props.errors[props.id] && 'p-error')}
        onChange={props.onChange}
        id={props.id}
      />
    </div>
  </div>
);

export const SelectField = (props: Props) => (
  <div className="p-col-12 mt-4">
    <label htmlFor={props.id}>{props.label}</label>
    <div className="p-inputgroup">
      <Dropdown
        {...props.input || {}}
        className={getClassNames(props.className || 'w-full', props.errors[props.id] && 'p-error')}
        value={props.value}
        style={{ width: '100%', borderRight: 'none' }}
        onChange={e => {
          props.onChange({
            target: {
              id: props.id,
              value: e.value,
              text:
                e.originalEvent && e.originalEvent.currentTarget
                  ? e.originalEvent.currentTarget.innerText
                  : e.value
            }
          });
        }}
        id={props.id}
      />
      <span className="p-inputgroup-addon">
        <i
          className={getClassNames(props.icon, props.errors[props.id] ? 'text-red' : 'text-green')}
        />
      </span>
    </div>
  </div>
);

export const MultiSelectField = (props: Props) => (
  <div className="p-col-12 mt-4">
    <label htmlFor={props.id}>{props.label}</label>
    <div className="p-inputgroup">
      <MultiSelect
        {...props.input || {}}
        className={getClassNames(props.className || 'w-full', props.errors[props.id] && 'p-error')}
        value={props.value}
        style={{ width: '100%', borderRight: 'none' }}
        onChange={e =>
          props.onChange({
            target: {
              id: props.id,
              value: e.value
            }
          })
        }
        id={props.id}
      />
      <span className="p-inputgroup-addon">
        <i
          className={getClassNames(props.icon, props.errors[props.id] ? 'text-red' : 'text-green')}
        />
      </span>
    </div>
  </div>
);

export const PlacesField = (props: Props) => (
  <div className="p-col-12 mt-4">
    <Places
      value={props.value ? props.value.formatted_address : ''}
      className={getClassNames(props.className || 'w-full', props.errors[props.id] && 'p-error')}
      icon={getClassNames(props.icon, props.errors[props.id] ? 'text-red' : 'text-green')}
      {...props.input || {}}
      onChange={e =>
        props.onChange({
          target: {
            id: props.id,
            value: e
          }
        })
      }
      label={props.label}
    />
  </div>
);

export const BoolField = (props: Props) => (
  <div className="p-col-12 mt-4">
    <Checkbox
      {...props.input || {}}
      className={getClassNames(props.className || 'w-full', props.errors[props.id] && 'p-error')}
      id={props.id}
      onChange={e => {
        props.onChange({
          target: {
            id: props.id,
            value: e.checked
          }
        });
      }}
      checked={(props.value && true) || false}
    />
    <label style={{ marginLeft: '5px' }} htmlFor={props.id}>
      {props.label}
    </label>
  </div>
);
