// @flow
import * as React from "react";
import DatePicker from "react-date-picker";

const CalendarFilterElement = (props: {
  value: any,
  onChange: Function,
  field: string
}) => (
  <DatePicker
    onChange={e => {
      props.onChange({
        value: e,
        field: props.field,
        matchType: "match"
      });
    }}
    value={props.value}
    calendarIcon={null}
    format="dd/MM/y"
    locale="it-IT"
    showLeadingZeros={true}
  />
  // <Calendar
  //   value={props.value}
  //   className="piramis-calendar-filter"
  //   inputClassName="p-column-filter"
  //   monthNavigator={true}
  //   yearNavigator={true}
  //   yearRange="2000:2099"
  //   showButtonBar={true}
  //   onChange={e => {
  //     props.onChange({
  //       value: e.value,
  //       field: props.field,
  //       matchType: "match"
  //     });
  //   }}
  //   dateFormat="dd/mm/yy"
  // />
);

export default CalendarFilterElement;
