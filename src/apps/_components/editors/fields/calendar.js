// @flow
import * as React from "react";
import DatePicker from "react-date-picker";
import moment from "moment";
import { getClassNames } from "../../utils";

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

const CalendarField = (props: Props) => (
  <div className="p-col-12 mt-4">
    <label htmlFor={props.id}>{props.label}</label>
    <div className="p-inputgroup">
      <DatePicker
        {...props.input || {}}
        onChange={e => {
          props.onChange({
            target: {
              id: props.id,
              value: e
            }
          });
        }}
        value={
          props.value
            ? moment(props.value).toDate()
            : props.input && props.input.defaultNull
            ? undefined
            : new Date()
        }
        calendarIcon={null}
        format="dd/MM/y"
        locale="it-IT"
        showLeadingZeros={true}
      />
      <span className="p-inputgroup-addon">
        <i
          className={getClassNames(
            "fas fa-calendar-alt",
            props.errors[props.id] ? "text-red" : "text-green"
          )}
        />
      </span>
    </div>
  </div>
);

export default CalendarField;
