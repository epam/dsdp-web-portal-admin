import React, { useMemo, useState } from 'react';
import Table from 'components/Table';
import { useTranslation } from 'react-i18next';
import { RegistryTable } from 'types/table';
import { get } from 'lodash';
import { ColumnDefinition, Order } from '#web-components/types/table';

type TableColumnsProps = {
  columns: RegistryTable['columns'],
};

export default function TableColumns({ columns }: TableColumnsProps) {
  const { t } = useTranslation('domains');
  const columnTableItems = useMemo(() => {
    return Object.entries(columns).map(([,c]) => ({ ...c, id: c.name }));
  }, [columns]);
  const [order, setOrder] = useState(Order.asc);
  const [orderField, setOrderField] = useState('name');
  const onOrderChange = (orderBy: string, o: Order) => {
    setOrderField(orderBy);
    setOrder(o);
  };
  const columnDefinitions: ColumnDefinition[] = [
    {
      title: t('registry.table.columns.name'),
      property: 'name',
    },
    {
      title: t('registry.table.columns.type'),
      property: 'type',
    },
    {
      title: t('registry.table.columns.defaultValue'),
      property: 'defaultValue',
      formatter(listItem, property) {
        const value = get(listItem, property);
        return value || '-';
      },
    },
    {
      title: '',
      property: '',
      sortable: false,
    },
  ];
  return (
    <Table
      columnDefinitions={columnDefinitions}
      list={columnTableItems}
      order={order}
      orderField={orderField}
      onOrderChange={onOrderChange}
      emptyPlaceholder={t('registry.table.emptyPlaceholder')}
    />
  );
}
