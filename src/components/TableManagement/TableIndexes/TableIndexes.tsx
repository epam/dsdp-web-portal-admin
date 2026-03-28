import React, { useMemo, useState } from 'react';
import Table from 'components/Table';
import { useTranslation } from 'react-i18next';
import { RegistryTableIndexWithRule } from 'types/table';
import { ColumnDefinition, Order } from '#web-components/types/table';

type TableIndexesProps = {
  indexes: RegistryTableIndexWithRule[],
};

export default function TableIndexes({ indexes }: TableIndexesProps) {
  const { t } = useTranslation('domains');
  const indexTableItems = useMemo(() => {
    return Object.values(indexes).map((index) => ({ ...index, id: index.name }));
  }, [indexes]);
  const [order, setOrder] = useState(Order.asc);
  const [orderField, setOrderField] = useState('name');
  const onOrderChange = (orderBy: string, o: Order) => {
    setOrderField(orderBy);
    setOrder(o);
  };
  const columnDefinitions: ColumnDefinition[] = [
    {
      title: t('registry.tableIndexes.columns.name'),
      property: 'name',
    },
    {
      title: t('registry.tableIndexes.columns.rule'),
      property: 'rule',
    },
  ];
  return (
    <Table
      columnDefinitions={columnDefinitions}
      list={indexTableItems}
      order={order}
      orderField={orderField}
      onOrderChange={onOrderChange}
      emptyPlaceholder={t('registry.tableIndexes.emptyPlaceholder')}
    />
  );
}
