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
    },
    removeProduct(state, action) {
      const index = state.items.findIndex(item => item.name === action.payload.name);

      if (index !== -1 && state.items[index].count > 1) {
        state.items[index].count -= 1;
      } else {
        state.items = state.items.filter(item => item.name !== action.payload.name);
      }
    },
    addProductById(state, action) {
      console.log('addProductById running');
      console.log(state.items, ' state.items');
      console.log(action.payload, ' action.payload');
      const index = state.items.findIndex(item => item.id === action.payload);
      console.log(index, ' index');

      if (index !== -1) {
        state.items[index].count += 1;
      } else {
        const newItem = { ...action.payload, count: 1 };
        state.items.push(newItem);
      }
    },
    removeProductById(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload);
      console.log('removeProductById running');
      console.log(state.items, ' state.items');
      console.log(action.payload, ' action.payload');
      console.log(index, ' index');

      if (index !== -1 && state.items[index].count > 1) {
        state.items[index].count -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },
  },
});

export const { addProduct, removeProduct, addProductById, removeProductById } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;