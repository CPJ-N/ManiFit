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
    },
    clearUser: (state) => {
      state.userInfo = null;
    },
    setUserImageUrl: (state, action: PayloadAction<string>) => {
      state.userImageUrl = action.payload;
    },
    clearUserImageUrl: (state) => {
      state.userImageUrl = '';
    }
  },
});

export const { setUser, clearUser, setUserImageUrl, clearUserImageUrl } = userSlice.actions;

export default userSlice.reducer;
