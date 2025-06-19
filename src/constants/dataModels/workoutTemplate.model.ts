import { CoreExercise } from './exercise.model';

// ===== WORKOUT TEMPLATE MODEL (NEW) =====
// For shareable workout templates between trainers
export interface WorkoutTemplate {
  id?: string;
  name: string;
  description: string;
  category: string; // 'Strength', 'Cardio', 'HIIT', etc.
  muscleGroups: string[];
  
  // ===== Template Structure =====
  warmupText: string;
  exercises: ExerciseTemplate[];
  coreExercises?: CoreExercise[];
  cooldownText?: string;
  
  // ===== Metadata =====
  createdBy: string; // Trainer ID
  isPublic: boolean; // Can other trainers use this
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  requiredEquipment: string[];
  
  // ===== Usage Stats =====
  timesUsed: number;
  avgRating: number;
  ratingCount: number;
  
  // ===== Timestamps =====
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseTemplate {
  exerciseId: string;
  name: string;
  order: number;
  
  // ===== Default Values =====
  defaultSets: number;
  defaultReps: number | string;
  suggestedWeight?: string;
  defaultRestTime?: number;
  
  // ===== Template Options =====
  isOptional?: boolean;
  alternatives?: string[]; // Alternative exercise IDs
  progressionNotes?: string;
  
  // ===== All ExerciseDetails fields =====
  specialInstructions?: string;
  variation?: string;
  isWarmup?: boolean;
  isCoreWork?: boolean;
  isComboSet?: boolean;
} 