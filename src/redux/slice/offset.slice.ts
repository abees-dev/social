import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IOffset {
  isOffsetTop: boolean;
}

const initialState: IOffset = {
  isOffsetTop: false,
};

export const offsetSlice = createSlice({
  name: 'offset-top',
  initialState,
  reducers: {
    setOffset: (state, action: PayloadAction<boolean>) => {
      state.isOffsetTop = action.payload;
    },
  },
});

export const { setOffset } = offsetSlice.actions;

export default offsetSlice.reducer;
