import React, { useState, createContext, useCallback, ReactNode } from 'react';
import { useTheme, Card, Flex } from '@chakra-ui/react';
import { InfoOutlineIcon, WarningIcon, CheckCircleIcon } from '@chakra-ui/icons';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  /* notification: Notification | null; */
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode; }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && <NotificationComponent {...notification} />}
    </NotificationContext.Provider>
  );
};

interface NotificationProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

const NotificationComponent: React.FC<NotificationProps> = ({ message, type = 'info' }: NotificationProps) => {

  const theme = useTheme();
  const successGreen = theme.colors.successGreen.custom;
  const errorRed = theme.colors.errorRed.custom;
  const infoBlue = theme.colors.blue[500];

  const colors = {
    success: successGreen,
    info: infoBlue,
    warning: errorRed,
    error: errorRed,
  };

  const retunrIcon = () => {
    if (type === 'success') {
      return <CheckCircleIcon ml='1' mr='1' />;
    } else if (type === 'info') {
      return <InfoOutlineIcon ml='1' mr='1' />;
    } else if (type === 'warning' || type === 'error') {
      return <WarningIcon ml='1' mr='1' />;
    }
    return null;
  };

  const backgroundColor = colors[type] || 'info';
  return (
    <Card style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: backgroundColor }}>
      <Flex
        color='white'
        alignItems={'center'}
        direction="row"
        justify="space-between"
        style={{ padding: '3px', border: 'solid 2px white', margin: '4px' }}
      >
        {retunrIcon()} {message}</ Flex>
    </Card>
  );
};
