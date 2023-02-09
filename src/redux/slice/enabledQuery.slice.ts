/* eslint-disable @typescript-eslint/no-empty-interface */
import { createSlice } from '@reduxjs/toolkit';

export interface EnableState extends Record<string, boolean> {}

const initialState: EnableState = {};

export const enableSlice = createSlice({
  name: 'enable-query',
  initialState,
  reducers: {
    setEnable: (state, action) => {
      state[action.payload] = true;
    },
  },
});

export const { setEnable } = enableSlice.actions;

export default enableSlice.reducer;
