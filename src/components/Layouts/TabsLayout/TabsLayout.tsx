import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Box, makeStyles } from '@material-ui/core';
import { selectorAsyncActionCriticalErrors } from 'store/asyncAction/selectors';
import { X_PATH } from 'constants/xPath';
import Loader from 'components/Loader';
import { ErrorInfo } from '#shared/types/common';
import TabsLayoutHeader, { TabsLayoutHeaderProps } from './components/TabsLayoutHeader';
import ErrorLayout from '../Error';
import EntityModeTabs from './components/EntityModeTabs';

import styles from './TabsLayout.styles';

const useStyles = makeStyles(styles, { name: 'TabsLayout' });

interface Props extends TabsLayoutHeaderProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  error?: ErrorInfo;
  title: string;
  entityName: string;
  isReadOnly?: boolean;
  menu?: React.ReactElement;
  tabs: Array<{ code: string; title: string; }>;
  loaderDescription?: string;
}

export default function TabsLayout({
  error,
  isLoading = false,
  children,
  title,
  entityName,
  isReadOnly,
  menu,
  submitButtonText,
  onSubmit,
  onCancel,
  onEditMode,
  tabs,
  loaderDescription,
}: Props) {
  const classes = useStyles();
  const criticalError = useSelector(selectorAsyncActionCriticalErrors);

  if (criticalError || error) {
    return (
      <ErrorLayout
        error={criticalError || error}
      />
    );
  }

  return (
    <>
      <Box className={classes.header}>
        {isReadOnly ? (
          <TabsLayoutHeader
            onCancel={onCancel}
            onEditMode={onEditMode}
          />
        ) : (
          <TabsLayoutHeader
            submitButtonText={submitButtonText}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        )}
      </Box>
      <Grid className={classes.container} item data-xpath={X_PATH.commonLayoutContent}>
        <Loader
          show={isLoading}
          description={loaderDescription}
          data-xpath="component-loader"
        />
        <EntityModeTabs entityName={entityName} modeName={title} tabs={tabs} menu={menu} />
        { children }
      </Grid>
    </>
  );
}
