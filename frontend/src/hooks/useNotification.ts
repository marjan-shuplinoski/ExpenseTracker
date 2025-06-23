import { useCallback } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';
import type { NotificationType } from '../contexts/NotificationContext';

/**
 * useNotification - custom hook to trigger notifications from any component or service.
 * Usage: const notify = useNotification(); notify('Message', 'success');
 */
export function useNotification() {
  const { dispatch } = useNotificationContext();
  return useCallback(
    (message: string, type: NotificationType = 'info') => {
      dispatch({ type: 'SHOW', payload: { message, type } });
    },
    [dispatch]
  );
}
