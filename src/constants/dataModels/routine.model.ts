import { Exercise } from "./excercise.model";

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  trainerId: string;
}