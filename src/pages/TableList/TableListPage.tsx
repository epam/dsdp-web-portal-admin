import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CommonLayout from 'components/Layouts/CommonLayout';
import { selectDataModelIsLoading, selectTablesListPageIsLoading, selectUpdateDataModelIsLoading } from 'store/tables';
import Tabs, { TabPanel } from '#web-components/components/Tabs';
import { X_PATH } from 'constants/xPath';
import { ENTITY_MODE_TAB_QUERY_PARAM } from 'constants/common';
import { useNavigate, useLocation } from 'react-router';
import TableStructureEditor from './components/TableStructureEditor';
import TableList from './components/TableList';
import styles from './TableListPage.styles';

const useStyles = makeStyles(styles, { name: 'TableListPage' });

const tabs = {
  list: 'list',
  editor: 'editor',
};

export default function TableListPage() {
  const { t } = useTranslation('pages', { keyPrefix: 'tableList' });
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoadingTable = useSelector(selectTablesListPageIsLoading);
  const isLoadingDataModel = useSelector(selectDataModelIsLoading);
  const isLoadingUpdateDataModel = useSelector(selectUpdateDataModelIsLoading);

  const isLoading = isLoadingTable || isLoadingDataModel || isLoadingUpdateDataModel;

  const handleTabChange = useCallback((search: string) => {
    navigate({ search });
  }, [navigate]);

  return (
    <CommonLayout
      title={t('title')}
      titleVariant="h1"
      isLoading={isLoading}
    >
      <Tabs
        classes={{ tabRoot: classes.nowrap }}
        tabProps={{ 'data-xpath': X_PATH.tabsButton }}
        tabQueryParam={ENTITY_MODE_TAB_QUERY_PARAM}
        onTabChange={handleTabChange}
        horizontPadding={0}
        queryString={location.search}
      >
        <TabPanel title={t('text.tableList')} code={tabs.list}>
          <TableList />
        </TabPanel>
        <TabPanel title={t('text.structureDescriptionFile')} code={tabs.editor}>
          <TableStructureEditor />
        </TabPanel>
      </Tabs>
    </CommonLayout>
  );
}
