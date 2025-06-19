// ===== WORKOUT SESSION MODEL (NEW - For Real-time Tracking) =====
// This will be stored in a new Firebase collection: 'WorkoutSessions'
export interface WorkoutSession {
  id?: string;
  routineId: string;
  clientId: string;
  trainerId: string;
  assigneeId?: string; // Reference to the assignment
  
  // ===== Session Status =====
  status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'abandoned';
  startTime?: string; // ISO date string
  endTime?: string; // ISO date string
  pausedTime?: number; // Total time paused (seconds)
  
  // ===== Current Progress =====
  currentExerciseIndex: number; // Which exercise they're on
  currentSet: number; // Which set of current exercise
  exerciseProgress: ExerciseProgress[]; // Detailed progress
  
  // ===== Session Summary =====
  totalDuration?: number; // Actual workout time (seconds)
  exercisesCompleted: number;
  setsCompleted: number;
  totalReps?: number;
  
  // ===== Health Data =====
  caloriesBurned?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  
  // ===== Notes & Feedback =====
  sessionNotes?: string; // Client's notes during workout
  overallDifficulty?: number; // 1-10 rating
  overallEnjoyment?: number; // 1-10 rating
  trainerFeedback?: string; // Trainer's review
  
  // ===== Sync Status =====
  isOffline: boolean; // Was this recorded offline
  syncedAt?: string; // When it was synced to server
  deviceInfo?: string; // What device was used
  
  // ===== Timestamps =====
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  exerciseOrder: number;
  
  // ===== Set Progress =====
  targetSets: number;
  completedSets: number;
  
  // ===== Performance Data =====
  repsPerSet: number[]; // Actual reps completed per set
  weightPerSet: number[]; // Weight used per set
  restTimePerSet: number[]; // Rest time taken between sets
  
  // ===== Timing =====
  startTime?: string;
  endTime?: string;
  totalTime?: number; // Time spent on this exercise (seconds)
  
  // ===== Quality Metrics =====
  difficulty?: number; // How difficult this exercise was (1-10)
  formRating?: number; // Self-assessed form quality (1-10)
  modifications?: string; // Any modifications made
  
  // ===== Status =====
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  skipReason?: string;
} 