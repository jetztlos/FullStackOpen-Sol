// part6/redux-anecdotes/src/reducers/filterReducer.js

import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter: (state, action) => {
      return action.payload
    }
  }
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
