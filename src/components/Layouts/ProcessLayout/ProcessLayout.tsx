import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProcessTab } from 'types/processes';
import TabsLayout from '../TabsLayout';

type ProcessLayoutProps = {
  children: React.ReactNode;
  title: string;
  submitButtonText: string;
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  processName: string;
  isReadOnly?: boolean;
  menu?: React.ReactElement;
  loaderDescription?: string;
  onEditMode?: () => void;
};

export default function ProcessLayout({
  isLoading, title, submitButtonText, processName,
  onSubmit, onCancel, children, isReadOnly, menu, loaderDescription,
  onEditMode,
}: ProcessLayoutProps) {
  const { t } = useTranslation('components', { keyPrefix: 'processLayout' });
  const tabs: ProcessTab[] = useMemo(
    () => ([
      { code: 'common', title: t('tabs.common') },
      { code: 'code', title: t('tabs.code') },
      { code: 'modeler', title: t('tabs.modeler') },
    ]) as ProcessTab[],
    [t],
  );
  return (
    <TabsLayout
      isLoading={isLoading}
      submitButtonText={submitButtonText}
      title={title}
      onSubmit={onSubmit}
      onCancel={onCancel}
      entityName={processName}
      tabs={tabs}
      menu={menu}
      isReadOnly={isReadOnly}
      loaderDescription={loaderDescription}
      onEditMode={onEditMode}
    >
      {children}
    </TabsLayout>
  );
}
