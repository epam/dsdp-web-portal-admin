import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NotificationsSystem, {
  dismissNotification,
  setUpNotifications,
  POSITIONS,
  Notification,
} from 'reapop';
import Box from '@material-ui/core/Box';
import { Theme, useMediaQuery, useTheme } from '@material-ui/core';

import { selectNotifications } from 'store/notifications';
import FlashMessage, { ViewType, theme as notificationTheme } from '#web-components/components/FlashMessage';
import Modal from '#web-components/components/Modal';
import Typography from '#web-components/components/Typography';
import ErrorInfoBox from '#web-components/components/ErrorInfoBox';
import { getMasterSupportEmailRequest, selectMasterSupportEmail } from 'store/settings';
import useAuthentication from 'hooks/useAuthentication';

setUpNotifications({
  defaultProps: {
    position: POSITIONS.topRight,
    dismissAfter: 8000,
  },
});

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('errors', { keyPrefix: 'notification' });
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const notifications = useSelector(selectNotifications);
  const masterSupportEmail = useSelector(selectMasterSupportEmail);
  const { authenticated } = useAuthentication();
  const isLessThanTabletL = useMediaQuery((appTheme: Theme) => appTheme.breakpoints.down('tabletL'));
  const theme = useTheme();

  const handleNotification = useCallback((id: string) => {
    dispatch(dismissNotification(id));
  }, [dispatch]);

  const handleClose = useCallback((id: string) => () => {
    dispatch(dismissNotification(id));
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleOpenModal = useCallback((id: string) => () => {
    const notification = notifications.find((n: Notification) => n.id === id);
    setCurrentNotification(notification || null);
    setModalOpen(true);
    handleClose(id)();
  }, [handleClose, notifications]);

  useEffect(() => {
    if (authenticated) {
      dispatch(getMasterSupportEmailRequest());
    }
  }, [dispatch, authenticated]);

  // TODO: Declare this component outside parent component "Notifications" or memoize it
  // eslint-disable-next-line react/no-unstable-nested-components
  function NotificationComponent({ notification }: { notification: Notification }) {
    return (
      <FlashMessage
        status={notification.status}
        title={notification.title}
        message={notification.message}
        onClose={handleClose(notification.id)}
        viewType={ViewType.notification}
        hasButton={notification.status === 'error'}
        buttonTitle={t('helpButton')}
        buttonHandler={handleOpenModal(notification.id)}
      />
    );
  }

  return (
    <>
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={handleNotification}
        theme={notificationTheme(theme, isLessThanTabletL)}
        components={{
          Notification: NotificationComponent,
        }}
      />
      <Modal
        isOpen={isModalOpen}
        cancelText={i18n.t('actions~close')}
        onOpenChange={handleCloseModal}
        title={t('errorModal.text.title')}
        scroll="body"
        fullScreen={isLessThanTabletL}
        hasCloseBtn
      >
        <Box mt={6}>
          <Typography variant="textRegular">{t('errorModal.text.writeMail')}</Typography>
        </Box>
        <Box mt={1}>
          <ErrorInfoBox>
            <Typography variant="h5">
              {
                masterSupportEmail || t('errorModal.text.emptySupportEmail')
              }
            </Typography>
          </ErrorInfoBox>
        </Box>
        <Box mt={4}>
          <Typography variant="textRegular">{t('errorModal.text.copyTraceId')}</Typography>
        </Box>
        <Box mt={1}>
          <ErrorInfoBox>
            <Typography variant="textSmall">
              {
                currentNotification?.traceId
                  ? `Trace ID: ${currentNotification?.traceId}`
                  : t('errorModal.text.emptyTraceId')
              }
            </Typography>
          </ErrorInfoBox>
        </Box>
        <Box mt={4}>
          <Typography variant="textRegular">{t('errorModal.text.description')}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="textRegular">{t('errorModal.text.thanks')}</Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Notifications;
