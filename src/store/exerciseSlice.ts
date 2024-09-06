import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from '../constants/dataModels/exercise.model';

interface ExerciseState {
  allExercises: Exercise[] | null;
}

const initialState: ExerciseState = {
    allExercises: [],
};

export const exerciseSlice = createSlice({
  name: 'allExercises',
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.allExercises = action.payload;
    },
    clearExercises: (state) => {
      state.allExercises = [];
    }
  },
});

export const { setExercises, clearExercises } = exerciseSlice.actions;

export default exerciseSlice.reducer;
