import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import exerciseReducer from './exerciseSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        exercises: exerciseReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            warnAfter: 128, // Increase the warning threshold to 128ms
          },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;