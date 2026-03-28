import React from 'react';
import { X_PATH } from 'constants/xPath';
import { useTranslation } from 'react-i18next';
import isNumber from 'lodash/isNumber';
import { Order, ColumnDefinition } from '#web-components/types/table';
import MdtuTable from '#web-components/components/Table';

interface Props<T> {
  columnDefinitions: ColumnDefinition[];
  list: T[];
  order: Order;
  orderField: string;
  showAllRows?: boolean;
  onOrderChange: (orderField: string, order: Order) => void;
  emptyPlaceholder: string;
  hideEmptyPlaceholder?: boolean;
  hidePaginationControls?: boolean;
  hideHeader?: boolean;
}

export default function Table<T extends { id: string }>(props: Props<T>) {
  const { t, i18n } = useTranslation('components');
  const {
    columnDefinitions,
    list,
    order,
    orderField,
    showAllRows,
    onOrderChange,
    emptyPlaceholder,
    hideEmptyPlaceholder,
    hidePaginationControls,
    hideHeader,
  } = props;
  return (
    <MdtuTable
      columnDefinitions={columnDefinitions}
      list={list}
      order={order}
      orderField={orderField}
      showAllRows={showAllRows}
      onOrderChange={onOrderChange}
      emptyPlaceholder={emptyPlaceholder}
      hideEmptyPlaceholder={hideEmptyPlaceholder}
      header={{
        hide: hideHeader,
        'data-xpath': X_PATH.tableHeadCell,
      }}
      pagination={{
        hidePaginationControls,
        getDisplayedRowsLabel: (params) => (isNumber(params.count)
          ? t('table.pagination', params)
          : t('table.paginationNoCount', params)),
        labelRowsPerPage: t('table.perPage'),
        'data-xpath': {
          tablePageCountSelect: X_PATH.tablePageCountSelect,
          tableFirstPage: X_PATH.tableFirstPage,
          tablePrevPage: X_PATH.tablePrevPage,
          tableNextPage: X_PATH.tableNextPage,
          tableLastPage: X_PATH.tableLastPage,
        },
        ariaLabel: {
          firstPage: t('table.aria.firstPage'),
          prevPage: t('table.aria.prevPage'),
          nextPage: t('table.aria.nextPage'),
          lastPage: t('table.aria.lastPage'),
        },
      }}
      locale={i18n.language}
    />
  );
}
