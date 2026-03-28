import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import {
  getReportListClean,
  getReportListRequest,
  selectReportList,
  selectReportListIsLoading,
} from 'store/report';

import CommonLayout from 'components/Layouts/CommonLayout';
import Table from 'components/Table';
import { Report } from 'types/report';
import { REPORT_API_APPENDIX } from 'api/reports';
import { API_APPENDIX, API_URL } from 'constants/baseUrl';
import { Order, ColumnDefinition } from '#web-components/types/table';
import { dateTimeFormatter } from '#web-components/utils';
import IconButton from '#web-components/components/IconButton';
import SearchInput from '#web-components/components/SearchInput';
import ExportIcon from '#web-components/assets/icons/export.svg?react';

import styles from './ReportListPage.styles';

const useStyles = makeStyles(styles, { name: 'ReportList' });
const MIN_SEARCH_LENGTH = 3;

export default function ReportListPage() {
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'reportList' });
  const [order, setOrder] = useState(Order.asc);
  const [searchString, setSearchString] = useState('');
  const [orderField, setOrderField] = useState('name');
  const dispatch = useDispatch();
  const reportList = useSelector(selectReportList);
  const isLoading = useSelector(selectReportListIsLoading);
  const classes = useStyles();

  const reportItemList = useMemo(() => {
    if (searchString.length < MIN_SEARCH_LENGTH) {
      return reportList;
    }

    return reportList?.filter((report) => (
      report.name.toLowerCase().includes(searchString.toLowerCase())
      || report.slug.toLowerCase().includes(searchString.toLowerCase())
    ));
  }, [reportList, searchString]);

  const formatter = useCallback((item, property) => {
    return dateTimeFormatter(item, property, i18n.language);
  }, [i18n.language]);

  const columnDefinitions: ColumnDefinition[] = [
    {
      title: t('table.columns.id'),
      property: 'id',
      width: 80,
    },
    {
      title: t('table.columns.name'),
      property: 'name',
      width: 296,
    },
    {
      title: t('table.columns.slug'),
      property: 'slug',
      width: 192,
    },
    {
      title: t('table.columns.created'),
      property: 'createdAt',
      formatter,
      width: '208px',
    },
    {
      title: t('table.columns.updated'),
      property: 'updatedAt',
      formatter,
      width: '208px',
    },
    {
      title: '',
      property: '',
      sortable: false,
      height: 'large',
      width: '56px',
      // TODO: Declare this component outside parent component "ReportListPage" or memoize it.
      //  If you want to allow component creation in props, set allowAsProps option to true
      // eslint-disable-next-line react/no-unstable-nested-components
      Component({ item }) {
        const report = item as Report;
        const downloadUrl = `${API_URL}/${API_APPENDIX}/${REPORT_API_APPENDIX}/${report.id}`;
        return (
          <IconButton className={classes.downloadButton}>
            <a href={downloadUrl} download aria-label="Download Report">
              <ExportIcon />
            </a>
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getReportListRequest());
    return () => {
      dispatch(getReportListClean());
    };
  }, [dispatch]);

  const onOrderChange = (orderBy: string, o: Order) => {
    setOrderField(orderBy);
    setOrder(o);
  };

  return (
    <CommonLayout
      title={t('title')}
      hint={i18n.t('text~hintSection')}
      isLoading={isLoading}
    >
      <Grid container justifyContent="space-between" className={classes.actions}>
        <Grid item>
          <SearchInput
            label={t('fields.searchLabel')}
            placeholder={t('fields.searchPlaceholder')}
            onSearch={setSearchString}
          />
        </Grid>
      </Grid>
      <Table
        columnDefinitions={columnDefinitions}
        list={reportItemList}
        order={order}
        orderField={orderField}
        onOrderChange={onOrderChange}
        emptyPlaceholder={t('table.emptyPlaceholder')}
        hideEmptyPlaceholder={isLoading}
      />
    </CommonLayout>
  );
}
