// export interface Routine {
//   id?: string;
//   name: string;
//   description?: string;
//   exercises: string[];
//   trainerId?: string;
// }

import { ExerciseDetails, CoreExercise } from "./exercise.model";

// ===== ENHANCED ROUTINE MODEL =====
// This enhances your existing Routine model
export interface Routine {
  id?: string; // Unique identifier for the routine
  name: string; // Name of the routine
  description: string; // Description of the routine
  exercises: ExerciseDetails[]; // Array of exercises with details
  createdBy: string; // Trainer ID
  assignees: Assignee[]; // Array of objects containing trainee IDs and specific session dates
  assigneeIds?: string[]; // Queryable trainee IDs for Firestore rules and array-contains queries
  
  // ===== Enhanced Workout Structure =====
  muscleGroup: string; // 'Back', 'Chest', 'Legs', 'Full Body', etc.
  warmupText: string; // Default: "Proper stretching and warm up"
  coreSection?: CoreExercise[]; // Separate core exercises (position 8+)
  cooldownText?: string; // Cool down instructions
  
  // ===== Metadata =====
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // Minutes
  tags?: string[]; // For search and categorization
  isTemplate: boolean; // Can be shared between trainers
  
  // ===== Usage & Analytics =====
  timesAssigned?: number;
  timesCompleted?: number;
  avgCompletionTime?: number; // Minutes
  avgRating?: number; // 1-5 stars from clients
  
  // ===== Timestamps =====
  createdAt: string; // ISO date string
  updatedAt: string;
  lastUsed?: string;
}

// ===== ENHANCED ASSIGNEE MODEL =====
// This enhances your existing Assignee model
export interface Assignee {
  traineeId: string;
  date: string; // Specific date the session is assigned to this trainee
  status: 'planned' | 'completed' | 'missed'; // Current status of the session for this trainee
  
  // ===== Enhanced Fields =====
  assignedAt: string; // When it was assigned
  dueDate?: string; // Optional due date
  completedAt?: string; // When completed
  startedAt?: string; // When they started the workout
  
  // ===== Assignment Details =====
  priority?: 'low' | 'medium' | 'high';
  isRecurring?: boolean; // Part of recurring schedule
  recurringPattern?: string; // "weekly", "daily", etc.
  
  // ===== Feedback =====
  clientFeedback?: string; // Client's notes
  trainerFeedback?: string; // Trainer's feedback
  difficulty?: number; // How difficult client found it (1-10)
  enjoyment?: number; // How much client enjoyed it (1-10)
  
  // ===== Performance =====
  actualDuration?: number; // How long it actually took (minutes)
  caloriesBurned?: number; // Estimated calories
  exercisesCompleted?: number; // How many exercises they finished
  setsCompleted?: number; // Total sets completed
  
  // ===== Modifications =====
  modifications?: ExerciseModification[]; // Any changes made during workout
  skippedExercises?: string[]; // Exercise IDs that were skipped
  skippedReasons?: string[]; // Why exercises were skipped
}

export interface ExerciseModification {
  exerciseId: string;
  originalSets: number;
  actualSets: number;
  originalReps: number | string;
  actualReps: number | string;
  originalWeight?: number;
  actualWeight?: number;
  reason?: string; // Why it was modified
}
