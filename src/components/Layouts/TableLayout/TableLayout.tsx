import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableTab } from 'types/table';
import TabsLayout from '../TabsLayout';

type TableLayoutProps = {
  children: React.ReactNode;
  title: string;
  submitButtonText: string;
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  tableName: string;
  isReadOnly?: boolean;
  menu?: React.ReactElement;
};

export default function TableLayout({
  isLoading, title, submitButtonText, tableName, onSubmit, onCancel, children, isReadOnly, menu,
}: TableLayoutProps) {
  const { t } = useTranslation('components', { keyPrefix: 'tableLayout' });
  const tabs: TableTab[] = useMemo(
    () => ([
      { code: 'common', title: t('tabs.common') },
      { code: 'columns', title: t('tabs.columns') },
      { code: 'indexes', title: t('tabs.indexes') },
    ]) as TableTab[],
    [t],
  );
  return (
    <TabsLayout
      isLoading={isLoading}
      submitButtonText={submitButtonText}
      title={title}
      onSubmit={onSubmit}
      onCancel={onCancel}
      entityName={tableName}
      tabs={tabs}
      menu={menu}
      isReadOnly={isReadOnly}
    >
      {children}
    </TabsLayout>
  );
}
