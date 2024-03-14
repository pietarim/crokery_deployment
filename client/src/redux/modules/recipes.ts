import { createSlice } from '@reduxjs/toolkit';
import { DbRecipe } from '../../types';

const initialState: DbRecipe[] = [];

const recipesSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setRecipes(state, action) {
      state.splice(0, state.length, ...action.payload);
    },
    addRecipes(state, action) {
      state.push(...action.payload);
    },
    updateRecipe(state, action) {
      const index = state.findIndex((r) => r.id === action.payload.id);
      state[index] = action.payload;
    },
    deleteRecipe(state, action) {
      for (let i = 0; i < state.length; i++) {
        if (state[i].id === action.payload) {
          state.splice(i, 1);
          break;
        }
      }
    }
  }
});

export const { setRecipes, addRecipes, updateRecipe, deleteRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;