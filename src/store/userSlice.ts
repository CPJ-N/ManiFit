// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetails } from '../constants/dataModels/userDetails.model';

interface UserState {
  userInfo: UserDetails | null;
  status: 'idle' | 'loading' | 'failed';
  userImageUrl: string;
}

const initialState: UserState = {
  userInfo: null,
  status: 'idle',
  userImageUrl: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDetails>) => {
      state.userInfo = action.payload;
      state.status = 'idle';
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.userImageUrl = '';
      state.status = 'idle';
    },
    setUserImageUrl: (state, action: PayloadAction<string>) => {
      state.userImageUrl = action.payload;
    },
    clearUserImageUrl: (state) => {
      state.userImageUrl = '';
    },
    setLoading: (state: UserState) => {
      state.status = 'loading';
    },
    setFailed: (state: UserState) => {
      state.status = 'failed';
    },
    logout: (state: UserState) => {
      // Complete logout - clear all user data
      state.userInfo = null;
      state.userImageUrl = '';
      state.status = 'idle';
    }
  },
});

export const { 
  setUser, 
  clearUser, 
  setUserImageUrl, 
  clearUserImageUrl, 
  setLoading, 
  setFailed, 
  logout 
} = userSlice.actions;

export default userSlice.reducer;
