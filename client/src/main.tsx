import React from 'react';
import ReactDOM from 'react-dom/client';
/* import App from './App.tsx'; */
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import store from './redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import { theme } from './theme';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { WidthProvider } from './context/WidthContext';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './Components/ErrorPage';
import CreateRecipe from './Components/CreateRecipe';
import ShoppingList from './Components/ShoppingList';
import ListRecipes from './Components/ListRecipes.tsx';
import Root from './Components/Root';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ListRecipes />,
        errorElement: <ErrorPage />
      },
      {
        path: "/create-recipe",
        element: <CreateRecipe />,
        errorElement: <ErrorPage />
      },
      {
        path: "/shopping-list",
        element: <ShoppingList />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <AuthProvider>
          <NotificationProvider>
            <WidthProvider>
              <RouterProvider router={router} />
            </WidthProvider>
          </NotificationProvider>
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
);
