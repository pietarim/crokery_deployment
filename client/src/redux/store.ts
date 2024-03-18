import shoppingCartReducer from './modules/shoppingCart';
import itemOptionsReducer from './modules/itemOptions';
import recipeReducer from './modules/recipes';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    shoppingCart: shoppingCartReducer,
    itemOptions: itemOptionsReducer,
    recipe: recipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;