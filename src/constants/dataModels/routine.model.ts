// export interface Routine {
//   id?: string;
//   name: string;
//   description?: string;
//   exercises: string[];
//   trainerId?: string;
// }

import { ExerciseDetails } from "./exercise.model";

export interface Routine {
  routineId?: string; // Unique identifier for the routine
  name: string; // Name of the routine
  description: string; // Description of the routine
  exercises: ExerciseDetails[]; // Array of exercises with details
  createdBy: string; // Trainer ID
}