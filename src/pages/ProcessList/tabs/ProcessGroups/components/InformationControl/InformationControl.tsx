import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import InlineButton from '#web-components/components/InlineButton/InlineButton';
import InfoIcon from '#web-components/components/Icons/InfoIcon';
import ConfirmModal from '#web-components/components/ConfirmModal';

export default function InformationControl() {
  const { t } = useTranslation('pages', { keyPrefix: 'processList' });
  const [open, onOpenChange] = useState(false);

  return (
    <>
      <InlineButton
        size="medium"
        leftIcon={<InfoIcon />}
        onLinkClick={() => onOpenChange(true)}
      >
        {t('processGroupsTab.reference')}
      </InlineButton>
      <ConfirmModal
        title={t('modals.information.title')}
        confirmationText={t('modals.information.description')}
        isOpen={open}
        cancelText={t('modals.information.closeButton')}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
