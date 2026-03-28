import React, {
  useCallback,
} from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import CommonLayout from 'components/Layouts/CommonLayout';
import { selectGroupDataIsLoading } from 'store/processGroups';
import { selectDeleteProcessIsLoading, selectProcessListIsLoading } from 'store/process';
import { X_PATH } from 'constants/xPath';
import { PROCESS_MODE_TAB_QUERY_PARAM } from 'constants/common';
import Tabs, { TabPanel } from '#web-components/components/Tabs';
import useVersion from 'hooks/useVersion';
import ProcessListTab from './tabs/ProcessList';
import styles from './ProcessListPage.styles';

const useStyles = makeStyles(styles, { name: 'ProcessListPage' });

const tabs = {
  all: 'all',
  groups: 'groups',
};

export default function ProcessListPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'processList' });
  const isProcessListLoading = useSelector(selectProcessListIsLoading);
  const isGroupDataLoading = useSelector(selectGroupDataIsLoading);
  const deleteProcessIsLoading = useSelector(selectDeleteProcessIsLoading);
  const { versionCreateIsLoading } = useVersion();

  const handleTabChange = useCallback((search: string) => {
    navigate({ search });
  }, [navigate]);
  const isLoading = isProcessListLoading || isGroupDataLoading || versionCreateIsLoading || deleteProcessIsLoading;
  return (
    <CommonLayout
      title={t('title')}
      titleVariant="h1"
      isLoading={isLoading}
      loaderDescription={
        (deleteProcessIsLoading || versionCreateIsLoading) ? i18n.t('text~processingRequest') : ''
      }
    >
      <Tabs
        classes={{ tabRoot: classes.nowrap }}
        tabProps={{ 'data-xpath': X_PATH.tabsButton }}
        tabQueryParam={PROCESS_MODE_TAB_QUERY_PARAM}
        onTabChange={handleTabChange}
        horizontPadding={0}
        queryString={location.search}
      >
        <TabPanel title={t('tabs.all')} code={tabs.all}>
          <ProcessListTab />
        </TabPanel>
      </Tabs>
    </CommonLayout>
  );
}
