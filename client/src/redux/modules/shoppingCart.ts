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
  console.log('state to local storage'); // TODO: remove
  console.log('state', { ...state }); // TODO: remove
  localStorage.setItem('shoppingCart', JSON.stringify(state));
};

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.items.map(item => console.log(item.name, ' ', item.id)); // TODO: removeve
      console.log('state', JSON.stringify(state));
      const index = state.items.findIndex(item => item.name === action.payload.name);

      if (index !== -1) {
        console.log('state.items[index]', state.items[index]); // TODO: remove
        state.items[index].count += 1;
      } else {
        console.log(action.payload); // TODO: remove
        const newItem = { ...action.payload, count: 1 };
        state.items.push(newItem);
      }
      console.log('state', state.items); // TODO: remove
      setLocalStorage(state);
    },
    removeProduct(state, action) {
      console.log('action.payload', action.payload); // TODO: remove
      const index = state.items.findIndex(item => item.name === action.payload.name);

      if (index !== -1 && state.items[index].count > 1) {
        state.items[index].count -= 1;
      } else {
        state.items = state.items.filter(item => item.name !== action.payload.name);
      }
      setLocalStorage(state);
    },
    addProductById(state, action) {
      console.log('action.payload', action.payload); // TODO: remo
      state.items.map(item => console.log(item.name, '', item.id)); // TODO: removeve
      console.log('state.items', state.items); // TODO: remove
      const index = state.items.findIndex(item => item.id === action.payload);
      console.log('index', index); // TODO: remove
      if (index !== -1) {
        console.log('state.items[index]', state.items[index]); // TODO: remove
        state.items[index].count += 1;
      } else {
        console.log('this should not happen'); // TODO: remove
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