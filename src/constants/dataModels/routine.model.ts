import { Exercise } from "./exercise.model";

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  trainerId: string;
}