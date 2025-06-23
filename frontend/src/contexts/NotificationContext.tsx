import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

/**
 * Notification types supported by Bootstrap 5 alerts.
 */
export type NotificationType = 'success' | 'warning' | 'danger' | 'info';

/**
 * Notification state shape.
 */
export interface NotificationState {
  message: string;
  type: NotificationType;
  visible: boolean;
}

/**
 * Notification actions for reducer.
 */
export type NotificationAction =
  | { type: 'SHOW'; payload: { message: string; type: NotificationType } }
  | { type: 'HIDE' };

const initialState: NotificationState = {
  message: '',
  type: 'info',
  visible: false,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'SHOW':
      return {
        message: action.payload.message,
        type: action.payload.type,
        visible: true,
      };
    case 'HIDE':
      return { ...state, visible: false };
    default:
      return state;
  }
}

interface NotificationContextProps {
  state: NotificationState;
  dispatch: Dispatch<NotificationAction>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

/**
 * NotificationProvider wraps the app and provides notification state/actions.
 */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * useNotificationContext provides access to notification state and dispatch.
 */
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotificationContext must be used within NotificationProvider');
  return context;
}
