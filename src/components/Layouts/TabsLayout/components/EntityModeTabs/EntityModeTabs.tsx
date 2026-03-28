import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { Grid, makeStyles, Paper } from '@material-ui/core';

import { X_PATH } from 'constants/xPath';
import { ENTITY_MODE_TAB_QUERY_PARAM } from 'constants/common';
import { TabsLayoutTab } from 'types/common';
import Tabs, { TabPanel } from '#web-components/components/Tabs';
import Typography from '#web-components/components/Typography';

import styles from './EntityModeTabs.styles';

interface EntityModeTabsProps {
  entityName: string;
  modeName: string;
  tabs: TabsLayoutTab[];
  menu?: React.ReactElement;
}
const useStyles = makeStyles(styles, { name: 'EntityModeTabs' });

export default function EntityModeTabs({
  entityName, modeName, tabs, menu,
}: EntityModeTabsProps) {
  const classes = useStyles();

  const [searchParams, setSearchParams] = useSearchParams();
  const handleTabChange = useCallback((search: string) => {
    setSearchParams(search);
  }, [setSearchParams]);
  return (
    <Paper className={classes.container}>
      <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
        <Grid item className={classes.formNameContainer}>
          <Typography variant="textTiny" className={classes.modeName}>{modeName}</Typography>
          <Typography variant="h6" className={classes.entityName}>{entityName}</Typography>
        </Grid>
        <Grid item>
          <Grid className={classes.tabsBar} container wrap="nowrap">
            <Grid item>
              <Tabs
                classes={{ tabs: classes.tabsRoot }}
                tabProps={{ 'data-xpath': X_PATH.tabsButton }}
                tabQueryParam={ENTITY_MODE_TAB_QUERY_PARAM}
                onTabChange={handleTabChange}
                hidePanels
                queryString={searchParams.toString()}
              >
                {tabs.map(({ code, title }) => (
                  <TabPanel key={code} code={code} title={title} />
                ))}
              </Tabs>
            </Grid>
            {menu && (
              <Grid className={classes.menu} item>
                {menu}
              </Grid>
            ) }
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
