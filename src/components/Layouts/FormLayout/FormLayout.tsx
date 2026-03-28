import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormTabs } from 'types/form';
import TabsLayout from '../TabsLayout';

type FormLayoutProps = {
  children: React.ReactNode;
  title: string;
  submitButtonText: string;
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  formName: string;
  isReadOnly?: boolean;
  menu?: React.ReactElement;
  loaderDescription?: string;
  onEditMode?: () => void;
};

export default function FormLayout({
  isLoading, title, submitButtonText,
  formName, onSubmit, onCancel, onEditMode, children, isReadOnly, menu, loaderDescription,
}: FormLayoutProps) {
  const { t } = useTranslation('components', { keyPrefix: 'formLayout' });
  const tabsHiddenForReadOnly = useMemo(() => (['modeler']), []);
  const tabs: FormTabs = useMemo(
    () => ([
      { code: 'common', title: t('tabs.common') },
      { code: 'code', title: t('tabs.code') },
      { code: 'modeler', title: t('tabs.modeler') },
      { code: 'preview', title: t('tabs.preview') },
      { code: 'query', title: t('tabs.query') },
    ].filter(({ code }) => !isReadOnly || !tabsHiddenForReadOnly.includes(code))) as FormTabs,
    [t, isReadOnly, tabsHiddenForReadOnly],
  );
  return (
    <TabsLayout
      isLoading={isLoading}
      loaderDescription={loaderDescription}
      submitButtonText={submitButtonText}
      title={title}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onEditMode={onEditMode}
      entityName={formName}
      tabs={tabs}
      menu={menu}
      isReadOnly={isReadOnly}
    >
      {children}
    </TabsLayout>
  );
}
