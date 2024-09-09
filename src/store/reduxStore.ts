import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import exerciseReducer from './workoutSlice';

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
          // serializableCheck: false, // if the warning threshold is too much
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;