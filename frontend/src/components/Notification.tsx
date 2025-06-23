import React, { useEffect } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';

/**
 * Notification component displays a Bootstrap 5 alert at the top center of the screen.
 */
const Notification: React.FC = () => {
  const { state, dispatch } = useNotificationContext();

  useEffect(() => {
    if (state.visible) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.visible, dispatch]);

  if (!state.visible) return null;

  return (
    <div
      className={`alert ${
        state.type === 'success'
          ? 'bg-success'
          : state.type === 'warning'
          ? 'bg-warning'
          : state.type === 'danger'
          ? 'bg-danger'
          : 'bg-info'
      } text-white position-fixed top-0 start-50 translate-middle-x mt-3 shadow z2000-fixed`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex justify-content-between align-items-center">
        <span>{state.message}</span>
        <button
          type="button"
          className="btn-close btn-close-white ms-3"
          aria-label="Close notification"
          onClick={() => dispatch({ type: 'HIDE' })}
        />
      </div>
    </div>
  );
};

export default Notification;
