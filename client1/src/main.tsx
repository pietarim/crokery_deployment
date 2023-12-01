import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import store from './redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
);
