import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import store from './redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import { theme } from './theme';
import { NotificationProvider } from './context/NotificationContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
);
