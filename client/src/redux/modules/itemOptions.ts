import { createSlice } from '@reduxjs/toolkit';
import { OptionsForMenu } from '../../types';

const initialState: OptionsForMenu[] = [];

const itemOptionsSlice = createSlice({
  name: 'itemOptions',
  initialState,
  reducers: {
    setItemOptions(_state, action) {
      return action.payload;
    }
  }
});

export const { setItemOptions } = itemOptionsSlice.actions;
export default itemOptionsSlice.reducer;