import React, { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core';
import Accordion from '#web-components/components/Accordion';
import IconButton from '#web-components/components/IconButton';
import { Order, ColumnDefinition, ListItem } from '#web-components/types/table';
import DoneIcon from '#web-components/components/Icons/DoneIcon';
import ErrorIcon from '#web-components/components/Icons/ErrorIcon';
import RevertIcon from '#web-components/components/Icons/RevertIcon';
import ConfirmModal from '#web-components/components/ConfirmModal';
import Link from '#web-components/components/Link';
import Table from 'components/Table';
import { VersionsChange, VersionChangeType } from 'types/versions';
import { getLanguageNativeName } from 'utils/i18n';
import { getRoutePathWithVersion } from 'utils/versions';
import { ROUTES } from 'constants/routes';
import useVersion from 'hooks/useVersion';

import styles from './CandidateChanges.styles';

const useStyles = makeStyles(styles, { name: 'CandidateChanges' });

interface InterfaceCandidateChangesProps {
  title: string;
  data: VersionsChange[];
  onRevert: (changeType: VersionChangeType, changeItem: VersionsChange) => void;
  dataXpath?: string;
}

type CandidateListItem = {
  id: string,
  title: string,
  status: 'NEW' | 'CHANGED' | 'DELETED'
};

const namesToTranslate = ['createTables'];
const nonSortableColumns = ['changedGroups', 'changedDataModelFiles'];
const TITLE_LINKS = {
  changedForms: {
    pathname: ROUTES.PREVIEW_FORM,
    searchValue: 'formId',
  },
  changedBusinessProcesses: {
    pathname: ROUTES.EDIT_PROCESS,
    searchValue: 'processName',
  },
};

function TitleLinkComponent(title: keyof typeof TITLE_LINKS) {
  return function TitleLink({ item }: { item: ListItem }) {
    const { versionId } = useVersion();
    const classes = useStyles();
    const { title: name, id, status } = item as CandidateListItem;
    if (status === 'DELETED') {
      return <span>{name}</span>;
    }
    return (
      <Link
        to={getRoutePathWithVersion(
          TITLE_LINKS[title].pathname,
          versionId,
        ).replace(`:${TITLE_LINKS[title].searchValue}`, id as string)}
        className={classes.link}
        component={RouterLink}
      >
        {name}
      </Link>
    );
  };
}

const StatusComponent = ({ item }: { item: ListItem }) => {
  const { t } = useTranslation('components', { keyPrefix: 'candidateChanges' });
  if (get(item, 'conflicted')) {
    return (<ErrorIcon title={t('table.columns.conflict.conflictTooltip')} />);
  }

  return (<DoneIcon title={t('table.columns.conflict.okTooltip')} />);
};

const RevertActionComponent = ({ onRevert }: { onRevert: (item: VersionsChange) => void }) => (
  function RevertAction({ item }: { item: ListItem }) {
    const classes = useStyles();
    const { t } = useTranslation('components', { keyPrefix: 'candidateChanges' });
    return (
      <IconButton
        onClick={() => onRevert(item as VersionsChange)}
        className={classes.cellAction}
        title={t('table.columns.revert.buttonTitle')}
      >
        <RevertIcon />
      </IconButton>
    );
  }
);

export default function CandidateChanges({
  title, data, onRevert, dataXpath,
}: InterfaceCandidateChangesProps) {
  const { t } = useTranslation('components', { keyPrefix: 'candidateChanges' });
  const classes = useStyles();
  const [order, setOrder] = useState(Order.asc);
  const [orderField, setOrderField] = useState('name');
  const [itemRevertConfirmation, setItemRevertConfirmation] = useState<null | VersionsChange>(null);
  const dataList = useMemo(() => {
    return (data?.map((item) => ({ ...item, id: item.name })));
  }, [data]);
  const hasConflicts = !!dataList.find((item) => get(item, 'conflicted'));

  const onOrderChange = (orderBy: string, o: Order) => {
    setOrderField(orderBy);
    setOrder(o);
  };

  const handleRevertClick = (item: VersionsChange) => {
    setItemRevertConfirmation(item);
  };

  const onRevertConfirmation = () => {
    if (itemRevertConfirmation) {
      onRevert(title as VersionChangeType, itemRevertConfirmation);
      setItemRevertConfirmation(null);
    }
  };

  const onConfirmModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setItemRevertConfirmation(null);
    }
  };

  const nameFormatter = (item: ListItem, property: string) : string => {
    if (title === 'changedI18nFiles') {
      return getLanguageNativeName(get(item, property));
    }

    return namesToTranslate.includes(get(item, property))
      ? t(`table.values.name.${get(item, property)}`)
      : get(item, property);
  };

  const columnDefinitions: ColumnDefinition[] = [
    {
      title: '',
      property: 'conflicted',
      width: '36px',
      sortable: false,
      Component: StatusComponent,
    },
    {
      title: t(`table.columns.name.${title}`),
      property: 'name',
      width: 296,
      sortable: !nonSortableColumns.includes(title),
      formatter: nameFormatter,

      ...(Object.keys(TITLE_LINKS).includes(title) && {
        Component: TitleLinkComponent(title as keyof typeof TITLE_LINKS),
      }),
    },
    {
      title: t('table.columns.status'),
      property: 'status',
      width: 100,
      sortable: !nonSortableColumns.includes(title),
      formatter: (item, property) => t(`table.values.status.${get(item, property)}`),
    },
    {
      title: '',
      property: 'revert',
      width: '44px',
      sortable: false,
      Component: RevertActionComponent({ onRevert: handleRevertClick }),
    },
  ];

  return (
    <>
      <Accordion
        label={<>{t(title)} { hasConflicts && <ErrorIcon className={classes.conflictIcon} />}</>}
        labelVariant="h5"
        expanded={hasConflicts}
        key={String(hasConflicts)}
        dataXpath={dataXpath}
      >
        <Table
          columnDefinitions={columnDefinitions}
          list={dataList}
          order={order}
          orderField={orderField}
          onOrderChange={onOrderChange}
          emptyPlaceholder={t('table.emptyPlaceholder')}
          hidePaginationControls
          showAllRows
        />
      </Accordion>
      <ConfirmModal
        title={t('modals.revertConfirm.title')}
        confirmationText={t('modals.revertConfirm.description')}
        submitText={t('modals.revertConfirm.confirm')}
        cancelText={t('modals.revertConfirm.cancel')}
        isOpen={!!itemRevertConfirmation}
        onSubmit={onRevertConfirmation}
        onOpenChange={onConfirmModalOpenChange}
      />
    </>
  );
}
