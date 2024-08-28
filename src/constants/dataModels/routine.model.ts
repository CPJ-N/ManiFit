// export interface Routine {
//   id?: string;
//   name: string;
//   description?: string;
//   exercises: string[];
//   trainerId?: string;
// }

import { ExerciseDetails } from "./exercise.model";

export interface Routine {
  id?: string; // Unique identifier for the routine
  name: string; // Name of the routine
  description: string; // Description of the routine
  exercises: ExerciseDetails[]; // Array of exercises with details
  createdBy: string; // Trainer ID
  assignees: Assignee[]; // Array of objects containing trainee IDs and specific session dates
}

export interface Assignee {
  traineeId: string;
  date: string; // Specific date the session is assigned to this trainee
  status: 'planned' | 'completed' | 'missed'; // Current status of the session for this trainee
}