import { createSlice } from '@reduxjs/toolkit';
import { Maybe } from 'src/types';
import { IUserResponse } from 'src/interface/UserReponse';

export interface UserState {
  user: Maybe<IUserResponse>;
  isAuthenticated: boolean;
  accessToken: string;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  accessToken: '',
};

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.accessToken = '';
      state.isAuthenticated = false;
      state.user = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.access_token;
      state.user = action.payload.user;
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { userLogout, refreshToken, loginSuccess, updateUser } = userSlice.actions;

export default userSlice.reducer;
