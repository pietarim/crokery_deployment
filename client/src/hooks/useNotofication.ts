import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const notification = useContext(NotificationContext);
  if (!notification) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return notification;
};