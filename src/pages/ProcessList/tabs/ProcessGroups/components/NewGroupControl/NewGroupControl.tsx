import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InlineButton from '#web-components/components/InlineButton/InlineButton';
import PlusIcon from '#web-components/components/Icons/PlusIcon';
import EditGroupNameModal from '../EditGroupNameModal';

interface Props {
  onAdd: (name: string) => void;
  existingGroupNames: Array<string>;
}

export default function NewGroupControl(props: Props) {
  const { onAdd, existingGroupNames } = props;
  const { t } = useTranslation('pages', { keyPrefix: 'processList' });
  const [open, onOpenChange] = useState(false);

  const handleSubmit = useCallback((name: string) => {
    onOpenChange(false);
    onAdd(name);
  }, [onAdd]);

  return (
    <>
      <InlineButton
        leftIcon={<PlusIcon />}
        onLinkClick={() => onOpenChange(true)}
        size="medium"
      >
        { t('processGroupsTab.createGroup') }
      </InlineButton>
      <EditGroupNameModal
        text={{
          title: t('modals.groupName.addTitle'),
          groupFieldLabel: t('modals.groupName.addLabel'),
          addButtonLabel: t('modals.groupName.addSubmitButton'),
        }}
        existingGroupNames={existingGroupNames}
        isOpen={open}
        onOpenChange={onOpenChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
