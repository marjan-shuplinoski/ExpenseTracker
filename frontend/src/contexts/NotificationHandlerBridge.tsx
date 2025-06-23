import { useEffect } from 'react';
import { setApiNotificationHandler } from '../services/api';
import { useNotification } from '../hooks/useNotification';

/**
 * NotificationHandlerBridge wires up the API notification handler after context is available.
 */
export default function NotificationHandlerBridge() {
  const notify = useNotification();
  useEffect(() => {
    setApiNotificationHandler(notify);
  }, [notify]);
  return null;
}
