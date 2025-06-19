// ===== ENHANCED EXERCISE MODELS =====
// This works with your GitHub exercise fetching
export interface Exercise {
  // ===== GitHub Exercise Fields (Keep as-is) =====
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment?: string[];
  instructions?: string;
  images?: string[]; // URLs from GitHub
  level?: string; // From GitHub repo
  category?: string;
  
  // ===== Enhanced Fields =====
  source: 'github' | 'local' | 'custom'; // Track source
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // User-specific data (stored locally or in user preferences)
  isFavorite?: boolean;
  lastUsed?: string;
  timesUsed?: number;
  personalNotes?: string;
  
  // Custom exercise fields (for trainer-created exercises)
  createdBy?: string; // trainer ID
  isPublic?: boolean; // Can other trainers use this
  tags?: string[];
  
  // Video support (for future)
  videoUrl?: string;
  demonstrationGifs?: string[];
  
  // ===== Legacy Fields (for compatibility) =====
  description?: string;
  image?: string;
  video?: string;
  trainerId?: string;
}

// ===== ENHANCED EXERCISE DETAILS (For Workouts) =====
// This enhances your existing ExerciseDetails model
export interface ExerciseDetails {
  // ===== Basic Exercise Info =====
  exerciseId: string; // Links to Exercise.id
  name: string; // Exercise name for quick display
  order: number; // Position in workout (1, 2, 3...) - for trainer format
  
  // ===== Sets & Reps (Enhanced for trainer format) =====
  sets: number;
  repetitions: number | string; // Support "12" or "12,10,8" or "12-15"
  weight?: number | string; // Support numbers or "bodyweight", "light", etc.
  
  // ===== Timing =====
  restTime?: number; // Rest between sets (seconds)
  duration?: string; // For time-based exercises "1min", "30sec"
  tempo?: string; // "slow", "fast", "2-1-2-1"
  
  // ===== Special Instructions =====
  specialInstructions?: string;
  variation?: string; // "with rope", "close grip", etc.
  holdDuration?: number; // For planks, holds (seconds)
  
  // ===== Workout Structure (NEW - for trainer format) =====
  isWarmup?: boolean; // Part of warmup section
  isCoreWork?: boolean; // Part of core/stomach section at end
  isComboSet?: boolean; // Part of combination set
  combineWithNext?: boolean; // No rest before next exercise
  
  // ===== Equipment & Setup =====
  equipment?: string[]; // Specific equipment for this instance
  setupNotes?: string; // How to set up for this exercise
  
  // ===== Progress Tracking =====
  targetRPE?: number; // Rate of Perceived Exertion (1-10)
  lastPerformed?: string; // Last time this exercise was done
  personalRecord?: number; // Best weight/reps for this exercise
  
  // ===== Session Notes =====
  trainerNotes?: string; // Notes from trainer for this specific assignment
  clientFeedback?: string; // Client's feedback after completing
}

// ===== CORE EXERCISE MODEL =====
// For the specific "stomach" section in your trainer's format
export interface CoreExercise {
  name: string;
  reps?: number; // For countable exercises
  duration?: string; // For time-based "1min", "45 seconds"
  sets: number;
  specialInstructions?: string;
  order: number; // Order within core section
  holdPosition?: boolean; // For planks, side planks
  combination?: string; // "Plank (1min) + side plank (45 seconds)"
}

// ===== Commented out old interfaces to avoid conflicts =====
// export interface Exercise {
//     images?: Array<string>;
//     id?: string;
//     name: string;
//     description: string;
//     instructions: string[];
//     duration?: number;
//     repetitions?: number;
//     sets?: number;
//     weight?: number;
//     image?: string;
//     video?: string;
//     trainerId: string;
//     category: string;
// }

// export interface Exercise {
//     id?: string; // Unique identifier for the exercise
//     name: string; // Name of the exercise
//     description: string; // Description of the exercise
//     image?: string; // Image name or URL of the exercise
//     video?: string; // Video URL of the exercise
//     category: string; // Category of the exercise (e.g., strength, cardio)
//     force?: 'static' | 'pull' | 'push' | null; // Type of force used in the exercise
//     level: 'beginner' | 'intermediate' | 'expert'; // Difficulty level of the exercise
//     mechanic?: 'isolation' | 'compound' | null; // Type of mechanic involved in the exercise
//     equipment?: string | null; // Equipment used for the exercise
//     primaryMuscles: string[]; // Primary muscles targeted by the exercise
//     secondaryMuscles?: string[]; // Secondary muscles targeted by the exercise
//     instructions: string[]; // Instructions for performing the exercise
// }

// export interface ExerciseDetails {
//     exerciseId: string; // ID of the exercise
//     duration?: number; // Duration in seconds
//     repetitions?: number; // Number of repetitions
//     sets?: number; // Number of sets
//     weight?: number; // Weight in kilograms
//     specialInstructions?: string; // Special instructions for this exercise instance
// }