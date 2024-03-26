import { createSlice } from '@reduxjs/toolkit';

interface RecipeItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  amount: number;
  isTitle?: string;
  count: number;
}

interface ShoppingCartState {
  items: RecipeItem[];
}

const initialState: ShoppingCartState = {
  items: [],
};

const setLocalStorage = (state: ShoppingCartState) => {
  localStorage.setItem('shoppingCart', JSON.stringify(state));
};

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    addProduct(state, action) {
      const index = state.items.findIndex(item => item.name === action.payload.name);

      if (index !== -1) {
        state.items[index].count += 1;
      } else {
        const newItem = { ...action.payload, count: 1 };
        state.items.push(newItem);
      }
      setLocalStorage(state);
    },
    removeProduct(state, action) {
      const index = state.items.findIndex(item => item.name === action.payload.name);

      if (index !== -1 && state.items[index].count > 1) {
        state.items[index].count -= 1;
      } else {
        state.items = state.items.filter(item => item.name !== action.payload.name);
      }
      setLocalStorage(state);
    },
    addProductById(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items[index].count += 1;
      } else {
        const newItem = { ...action.payload, count: 1 };
        state.items.push(newItem);
      }
      setLocalStorage(state);
    },
    removeProductById(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload);

      if (index !== -1 && state.items[index].count > 1) {
        state.items[index].count -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
      setLocalStorage(state);
    },
  },
});

export const { addProduct, removeProduct, addProductById, removeProductById } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;