import shoppingCartReducer from './modules/shoppingCart';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    shoppingCart: shoppingCartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;