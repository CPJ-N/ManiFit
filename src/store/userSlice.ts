// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetails } from '../constants/dataModels/userDetails.model';

interface UserState {
  userInfo: UserDetails | null;
  status: 'idle' | 'loading' | 'failed';
  userImageUrl: string;
  isAuthenticated: boolean;
  authLoading: boolean;
}

const initialState: UserState = {
  userInfo: null,
  status: 'idle',
  userImageUrl: '',
  isAuthenticated: false,
  authLoading: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDetails>) => {
      state.userInfo = action.payload;
    },
    clearUser: (state) => {
      state.userInfo = null;
    },
    setUserImageUrl: (state, action: PayloadAction<string>) => {
      state.userImageUrl = action.payload;
    },
    clearUserImageUrl: (state) => {
      state.userImageUrl = '';
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.userInfo = null;
        state.userImageUrl = '';
      }
    }
  },
});

export const { setUser, clearUser, setUserImageUrl, clearUserImageUrl, setAuthLoading, setAuthenticated } = userSlice.actions;

export default userSlice.reducer;
