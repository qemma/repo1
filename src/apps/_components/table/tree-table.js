// @flow
import * as React from 'react';
import { Column } from 'primereact/column';
import { TreeTable } from 'primereact/treetable';
import { Button } from 'primereact/button';

export type Props = {
  children: Array<Column>,
  onLoadResults: (options: Options, action: GridAction) => any,
  options: Options,
  result: Result,
  table: any,
  tree: any,
  onSetDtRef?: Function
};

class PiramisTreeTable extends React.Component<Props> {
  dt: any = null;
  static defaultProps = {
    children: [],
    options: {
      sort: [],
      filters: {},
      size: 10,
      from: 0
    },
    result: {
      items: [],
      total: 0
    },
    table: {}
  };

  updateOptions = (newOptions: Options, opType: GridAction) => {
    this.props.onLoadResults(
      {
        ...this.props.options,
        ...newOptions
      },
      opType
    );
  };

  onPage = (e: any) => {
    this.updateOptions({ from: e.first, size: e.rows }, 'paging');
  };

  onRefresh = () => {
    this.updateOptions(
      {
        from: 0,
        size: this.props.options.size
      },
      'refresh'
    );
  };

  onFilter = (e: any) => {
    this.updateOptions({ filters: e.filters, from: 0, size: this.props.options.size }, 'filter');
  };

  onSort = (e: any) => {
    const oldField = (this.props.options.sort || []).find(el => el.field === e.sortField) || {
      field: e.sortField,
      order: 0
    };

    const remaining = (this.props.options.sort || []).filter(el => el.field !== e.sortField);

    let sort = null;
    if (oldField.order === -1) {
      sort = remaining;
    } else {
      sort = [
        {
          ...oldField,
          order: oldField.order ? oldField.order * -1 : 1
        }
      ].concat(remaining);
    }

    this.updateOptions({ sort }, 'sort');
  };

  getHeader = (loading: boolean, totResults: number, headerTitle: any) => {
    return (
      <div className="p-clearfix" style={{ lineHeight: '1.87em' }}>
        {this.props.table && this.props.table.headerLeft && (
          <div style={{ float: 'left' }}>{this.props.table.headerLeft}</div>
        )}
        {headerTitle}
        <Button
          disabled={loading}
          onClick={this.onRefresh}
          label={totResults.toString()}
          icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'}
          style={{ float: 'right' }}
        />
      </div>
    );
  };

  render() {
    const { children, table, options, result, onSetDtRef, tree } = this.props;

    return (
      <TreeTable
        ref={el => {
          this.dt = el;
          onSetDtRef && onSetDtRef(this.dt);
        }}
        {...table || {}}
        multiSortMeta={options.sort}
        filters={options.filters}
        first={options.from}
        rows={options.size}
        lazy
        rowsPerPageOptions={[5, 10, 20, 50]}
        value={tree}
        className="p-datatable-hoverable-rows"
        responsive
        onSort={this.onSort}
        onFilter={this.onFilter}
        onPage={this.onPage}
        paginator={true}
        header={this.getHeader(table.loading, result.total, table.headerTitle)}
        totalRecords={result.total}
      >
        {children}
      </TreeTable>
    );
  }
}

export default PiramisTreeTable;
