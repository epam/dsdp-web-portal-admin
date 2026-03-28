import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getRoutePathWithVersion, isMaster as isMasterVersion } from 'utils/versions';
import useVersion from 'hooks/useVersion';
import {
  getTableListRequest,
  selectTablesList,
  selectTablesListPageIsLoading,
  getTableListClean,
  selectTablesListPageCriticalError,
} from 'store/tables';
import { TableListItem, TableModeCode } from 'types/table';
import Table from 'components/Table';
import { ROUTES } from 'constants/routes';
import { ENTITY_MODE_TAB_QUERY_PARAM } from 'constants/common';
import { ColumnDefinition, Order } from '#web-components/types/table';
import Link from '#web-components/components/Link';
import SearchInput from '#web-components/components/SearchInput';
import { NotificationWarningIcon } from '#web-components/components/Icons';
import ComponentError from 'components/ComponentError';
import BoolTableItem from '../BoolTableItem';
import styles from './TableList.styles';

const MIN_SEARCH_LENGTH = 3;

const useStyles = makeStyles(styles, { name: 'TableList' });

export default function TableList() {
  const { t } = useTranslation('pages', { keyPrefix: 'tableList' });
  const classes = useStyles();
  const dispatch = useDispatch();
  const { versionId } = useVersion();
  const isMaster = isMasterVersion(versionId);
  const [searchString, setSearchString] = useState('');
  const [order, setOrder] = useState(Order.asc);
  const [orderField, setOrderField] = useState('name');
  const isLoading = useSelector(selectTablesListPageIsLoading);
  const tablesList = useSelector(selectTablesList);
  const tablesListError = useSelector(selectTablesListPageCriticalError);

  const tablesItemList = useMemo(() => {
    return (tablesList?.map((table) => ({ ...table, id: table.name })) || [])
      .filter((p) => {
        if (searchString.length < MIN_SEARCH_LENGTH) {
          return true;
        }
        return p.name.toLowerCase().includes(searchString.toLowerCase());
      });
  }, [tablesList, searchString]);
  const columnDefinitions: ColumnDefinition[] = [
    {
      title: t('table.columns.name'),
      property: 'name',
      width: 40,
      // eslint-disable-next-line react/no-unstable-nested-components
      Component: ({ item }) => {
        const { name } = item as TableListItem;
        return (
          <Link
            to={getRoutePathWithVersion(ROUTES.EDIT_TABLE, versionId)
              .replace(':tableName', name)
              .concat('?', new URLSearchParams({ [ENTITY_MODE_TAB_QUERY_PARAM]: TableModeCode.common }).toString())}
            className={classes.title}
            component={RouterLink}
          >
            {name}
          </Link>
        );
      },
    },
    {
      title: t('table.columns.objectReference'),
      property: 'objectReference',
      width: 10,
      // TODO: Declare this component outside parent component "ProcessListPage" or memoize it.
      //  If you want to allow component creation in props, set allowAsProps option to true
      // eslint-disable-next-line react/no-unstable-nested-components
      Component({ item }) {
        const tableItem = item as TableListItem;
        return <BoolTableItem value={tableItem.objectReference} />;
      },
    },
    {
      title: t('table.columns.description'),
      property: 'description',
      width: 40,
      formatter(listItem) {
        const tableItem = listItem as TableListItem;
        return tableItem.description || '-';
      },
    },
    {
      title: '',
      property: '',
      sortable: false,
    },
  ];
  const onOrderChange = (orderBy: string, o: Order) => {
    setOrderField(orderBy);
    setOrder(o);
  };

  useEffect(() => {
    dispatch(getTableListRequest(versionId));
    return () => {
      dispatch(getTableListClean());
    };
  }, [dispatch, versionId]);

  if (tablesListError) {
    return (
      <ComponentError
        icon={<NotificationWarningIcon size={56} />}
        text={tablesListError}
      />
    );
  }

  return (
    <>
      <Box className={classes.actions}>
        <SearchInput
          label={t('fields.searchLabel')}
          placeholder={t('fields.searchPlaceholder')}
          onSearch={setSearchString}
        />
      </Box>

      <Table
        columnDefinitions={columnDefinitions}
        list={tablesItemList}
        order={order}
        orderField={orderField}
        onOrderChange={onOrderChange}
        emptyPlaceholder={isMaster ? t('table.emptyPlaceholder') : t('table.emptyPlaceholderCandidates')}
        hideEmptyPlaceholder={isLoading}
      />
    </>
  );
}
