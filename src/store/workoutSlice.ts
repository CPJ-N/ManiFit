import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from '../constants/dataModels/exercise.model';
import { Routine } from '../constants/dataModels/routine.model';

interface WorkoutState {
  allExercises: Exercise[] | null;
  userRoutines: Routine[] | null;
}

const initialState: WorkoutState = {
    allExercises: [],
    userRoutines: []
};

export const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.allExercises = action.payload;
    },
    clearExercises: (state) => {
      state.allExercises = [];
    },
    setUserRoutine: (state, action: PayloadAction<Routine[]>) => {
      state.userRoutines = action.payload;
    },
    clearUserRoutine: (state) => {
      state.userRoutines = [];
    },
  },
});

export const { setExercises, clearExercises } = workoutSlice.actions;

export default workoutSlice.reducer;
