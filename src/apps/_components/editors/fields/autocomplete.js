// @flow
import * as React from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { getClassNames } from '../../utils';

type Props = {
  value: any,
  id: string,
  label: string,
  onChange: Function,
  icon?: string,
  className?: string,
  input?: any,
  errors: any
};
export default class AutocompleteField extends React.Component<
  Props,
  { selected: any, loading: boolean }
> {
  static defaultProps: Props;
  constructor(props: Props) {
    super(props);
    const loading = props.input && props.input.resolveSelected && props.value ? true : false;
    this.state = {
      selected: props.value,
      loading
    };
    loading && this.resolveSelected(props.input && props.input.resolveSelected, props.value);
  }

  resolveSelected = async (resolver: (data: any) => any = () => null, toResolve: any) => {
    const selected = await resolver(toResolve);
    this.setState({ loading: false, selected });
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.value !== prevProps.value) {
      this.setState({ selected: this.props.value });
    }
  }
  render() {
    if (this.state.loading)
      return (
        <div className="p-col-12 mt-4">
          <i className="fas fa-circle-notch fa-spin" />
        </div>
      );
    const { input, className, errors, onChange, id, icon, label } = this.props;
    return (
      <div className="p-col-12 mt-4">
        <span className="p-float-label">
          <div className="p-inputgroup">
            <AutoComplete
              {...input || {}}
              value={this.state.selected}
              style={{ width: '100%' }}
              inputStyle={{ width: '100%', borderRight: 'none' }}
              className={getClassNames(className || 'w-full inline-block', errors[id] && 'p-error')}
              onChange={e => {
                this.setState(
                  { selected: e.value },
                  () =>
                    (!e.value || (input && input.multiple)) &&
                    onChange({
                      target: {
                        id: id,
                        value: e.value
                      }
                    })
                );
              }}
              onBlur={() => {
                this.setState({ selected: this.props.value });
              }}
              onSelect={e => {
                input &&
                  !input.multiple &&
                  onChange({
                    target: {
                      id: id,
                      value: e.value
                    }
                  });
              }}
              id={id}
            />
            <span className="p-inputgroup-addon">
              <i className={getClassNames(icon, errors[id] ? 'text-red' : 'text-green')} />
            </span>
            <label htmlFor={id}>{label}</label>
          </div>
        </span>
      </div>
    );
  }
}
