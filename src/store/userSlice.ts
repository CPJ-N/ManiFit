// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetails } from '../constants/dataModels/userDetails.model';

interface UserState {
  userInfo: UserDetails | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
  userInfo: null,
  status: 'idle',
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
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
