import React from 'react';
import { useTranslation } from 'react-i18next';
import CommonLayout from 'components/Layouts/CommonLayout';

import ImportUsersForm from 'components/ImportUsersForm';
import { ROUTES } from 'constants/routes';
import { getRoutePathWithVersion } from 'utils/versions';
import useVersion from 'hooks/useVersion';

export default function ImportUsersPage() {
  const { t } = useTranslation('pages', { keyPrefix: 'importUsers' });
  const { versionId } = useVersion();

  return (
    <CommonLayout
      title={t('title')}
      backLink={{
        title: t('text.navTitle'),
        path: getRoutePathWithVersion(ROUTES.USERS, versionId),
      }}
      isLoading={false}
    >
      <ImportUsersForm />
    </CommonLayout>
  );
}
