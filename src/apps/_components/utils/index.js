// @flow
import * as React from 'react';
import moment from 'moment';
import { Checkbox } from 'primereact/checkbox';
import { get } from 'lodash';
import { ITEM_CATEGORY } from '../../shared/const';
import uniqueId from 'uniqid';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export function resolveAddress(position: any): any {
  return new Promise((resolve: any, reject: any) => {
    const google = window.google;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: position.latitude, lng: position.longitude } }, function(
      results,
      status
    ) {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject(status);
      }
    });
  });
}

export function getMessage(summary: string, detail: string | React.Node, type: string = 'error') {
  if (!detail) return null;
  return (
    <div className={`p-messages p-component p-messages-${type} p-messages-enter-done`}>
      <div className="p-messages-wrapper">
        <span className="p-messages-icon pi  pi-info-circle" />
        <ul>
          <li>
            <span className="p-messages-summary">{summary}</span>
            <span className="p-messages-detail">{detail}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function getGridDateTemplate(rowData: IEntity, column: { field: string }) {
  const dateString = get(rowData, column.field);
  if (!dateString) return '';
  return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
}

export const getClassNames = (...classNames: any) => classNames.filter(item => item).join(' ');

export function getGridBoolTemplate(rowData: IEntity & any, column: { field: string }) {
  const value = rowData[column.field];
  return <Checkbox readOnly disabled onChange={() => null} checked={(value && true) || false} />;
}

export async function wait(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

export const getGroup = (entity: IEntity, parent?: IEntity) => {
  let group = entity.group && entity.group.uuid ? entity.group.uuid : entity.group;
  if (!group) {
    group = (parent && parent.group) || entity.uuid;
  }

  return group;
};

export const getParentId = (entity: IEntity, parent?: IEntity) => {
  let parentId = entity.parentId;
  if (!parentId) {
    parentId = parent ? parent.uuid : entity.uuid;
  }

  return parentId;
};

export function addDays(days: number = 1) {
  let today = new Date();
  let newdate = new Date();
  newdate.setDate(today.getDate() + days);
  return newdate;
}

export function createHistory(parent: IEntity, notes: string, userNotes?: string) {
  const uuid = uniqueId();
  return {
    uuid,
    category: ITEM_CATEGORY.storico,
    parentId: parent.uuid,
    userNotes,
    notes
  };
}

export function getentityDescription(entity: any) {
  return `${entity.name}${entity.surname ? ` ${entity.surname}` : ''} ${entity.taxCode ||
    entity.vatCode} ${entity.address.formatted_address}`;
}

export const getHierarchyId = (entity: IEntity, parent?: IEntity) => {
  let hierarchyId = entity.hierarchyId;

  if (!hierarchyId || hierarchyId.startsWith('undefined')) {
    hierarchyId = parent ? `${parent.hierarchyId}*${entity.uuid}` : entity.uuid;
  }

  return hierarchyId;
};

export const getObjectLookup = (entity: IEntity) => {
  return [
    'name',
    'surname',
    'email',
    'pec',
    'address.formatted_address',
    'make',
    'model',
    'type',
    'category',
    'reference1',
    'reference2',
    'taxCode',
    'vatCode'
  ]
    .map(key => get(entity, key, ''))
    .filter(el => el)
    .join('|')
    .toLowerCase();
};

export function printLabels(id: string, small: boolean = false) {
  const prtContent: any = document.getElementById(id);

  const WinPrint = window.open(
    '',
    '',
    'left=0,top=0,width=800,height=900,toolbar=1,menubar=1,scrollbars=0,status=0'
  );

  const css = `
  * {
    box-sizing: border-box;
  }
  
  html {
    height: 100%;
  }
  
  body {
    font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    color: #333333;
    background-color: #edf0f5;
    margin: 0;
    padding: 0;
    min-height: 100%;
  }
  body .menuitem-badge {
    margin-top: 3px;
    font-size: 10px;
    float: right;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    color: #ffffff;
    background-color: #007be5;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
  }
  
  a {
    text-decoration: none;
  }

  .label-barcodes {
    background-color: #ffffff;
    margin: 0;
    page-break-inside: avoid; 
  }
    .label-barcodes div {
      text-align: center; 
  }
  
  @media print {
    @page {
      size: auto;
      /* auto is the initial value */
      margin: 0mm;
      /* this affects the margin in the printer settings */ }
    html {
      background-color: #ffffff;
      margin: 0 !important;
      height: auto !important;
      page-break-after: avoid !important;
      /* this affects the margin on the html before sending to printer */ }
    .labels-container {
      background-color: #ffffff;
      width: 62mm;
      height: 25mm !important;
      border: none;
      margin: 0 !important;
      page-break-after: avoid !important;
      /* margin you want for the content */ }
      .labels-container .label-barcodes {
        width: 62mm;
        height: 25mm;
        page-break-after: always; } }
  `;

  if (WinPrint) {
    WinPrint.document.write(
      `<html><head><style type="text/css">${css}</style></head><body class='labels-container${
        small ? '-small' : ''
      }'>${prtContent.innerHTML}</body></html>`
    );

    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  }
}
