import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { X_PATH } from 'constants/xPath';
import { groupActionMoveProcessDown, groupActionMoveProcessUp } from 'store/processGroups';
import IconButton from '#web-components/components/IconButton';
import ArrowUpIcon from '#web-components/components/Icons/ArrowUpIcon';
import ArrowDownIcon from '#web-components/components/Icons/ArrowDownIcon';
import { ListItem } from '#web-components/types/table';
import { ProcessDefinition } from '#shared/types/processDefinition';
import { EntityItem } from '#web-components/types/groupedEntity';

import MoveProcessControl from '../MoveProcessControl';

import styles from './ProcessTableActions.styles';

type FormTableActionsProps = {
  item: ListItem;
  list: Array<EntityItem>;
  groupName?: string;
  readonly?: boolean,
  existingGroupNames?: string[];
  moveToUngroupedEnable?: boolean;
};

const useStyles = makeStyles(styles, { name: 'ProcessTableActions' });

export default function ProcessTableActions({
  readonly,
  item,
  list,
  groupName,
  existingGroupNames,
  moveToUngroupedEnable,
}: FormTableActionsProps) {
  const classes = useStyles({ readonly });
  const dispatch = useDispatch();
  const processId = item.id || '';
  const processDefinition = list.find(({ id }) => id === item.id) as ProcessDefinition;
  const index = processDefinition ? list.indexOf(processDefinition) : -1;

  const onUpClick = useCallback(() => {
    dispatch(groupActionMoveProcessUp({ processId, groupName }));
  }, [processId, groupName, dispatch]);
  const onDownClick = useCallback(() => {
    dispatch(groupActionMoveProcessDown({ processId, groupName }));
  }, [processId, groupName, dispatch]);

  return (
    <div className={classes.root}>
      {!readonly && (
        <>
          <IconButton onClick={onUpClick} disabled={index === 0} data-xpath={X_PATH.arrowUpButton}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton onClick={onDownClick} disabled={index === list.length - 1} data-xpath={X_PATH.arrowDownButton}>
            <ArrowDownIcon />
          </IconButton>
          {
            processDefinition && (
              <MoveProcessControl
                existingGroupNames={existingGroupNames}
                groupName={groupName}
                process={processDefinition}
                moveToUngroupedEnable={moveToUngroupedEnable}
              />
            )
          }
        </>
      )}
    </div>
  );
}
