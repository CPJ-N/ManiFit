// src/features/example/exampleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUser } from '../config/userService';
import { User } from '../constants/dataModels/userInfo.model';

interface ExampleState {
  value: number;
}

const initialState = {
    value:0,
  userInfo: {},
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    // increment: state => {
    //   state.value += 1;
    // },
    // decrement: state => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
    getUserInfo: (state, action: PayloadAction<User>) => {
        state.userInfo = action.payload;
    },
}
});

// export const { increment, decrement, incrementByAmount } = exampleSlice.actions;
export const { getUserInfo } = exampleSlice.actions;
export default exampleSlice.reducer;
