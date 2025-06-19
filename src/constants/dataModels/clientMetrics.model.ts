// ===== CLIENT METRICS MODEL =====
// For tracking client progress, analytics, and achievements
export interface ClientMetrics {
  id?: string;
  clientId: string;
  trainerId: string;
  
  // ===== Basic Stats =====
  startDate: string; // When client started training
  totalWorkouts: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  
  // ===== Streak Tracking =====
  currentStreak: number; // Days in a row
  longestStreak: number;
  lastWorkoutDate?: string;
  
  // ===== Performance Metrics =====
  avgWorkoutDuration: number; // Minutes
  totalWorkoutTime: number; // Total minutes worked out
  
  // ===== Progress Data =====
  personalRecords: PersonalRecord[];
  strengthProgress: StrengthProgress[];
  measurements: Measurement[];
  weeklyProgress: WeeklyProgress[];
  
  // ===== Goals & Achievements =====
  goals: Goal[];
  achievements: Achievement[];
  badges: Badge[];
  
  // ===== Health Data =====
  avgCaloriesBurned?: number;
  totalCaloriesBurned?: number;
  avgHeartRate?: number;
  
  // ===== Timestamps =====
  createdAt: string;
  updatedAt: string;
}

export interface PersonalRecord {
  id?: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  previousRecord?: number; // For comparison
}

export interface StrengthProgress {
  exerciseId: string;
  exerciseName: string;
  category: string; // 'chest', 'back', etc.
  dataPoints: StrengthDataPoint[];
}

export interface StrengthDataPoint {
  date: string;
  weight: number;
  reps: number;
  volume: number; // weight * reps * sets
  oneRepMax?: number; // Calculated
}

export interface Measurement {
  id?: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  
  // Body measurements (in cm)
  chest?: number;
  waist?: number;
  bicep?: number;
  thigh?: number;
  neck?: number;
  
  // Metadata
  unit: 'cm' | 'inches';
  notes?: string;
}

export interface WeeklyProgress {
  weekStart: string; // Monday of the week
  workoutsCompleted: number;
  totalDuration: number;
  avgDifficulty: number; // 1-10
  avgEnjoyment: number; // 1-10
  caloriesBurned: number;
  strengthGains: number; // % improvement
}

export interface Goal {
  id?: string;
  type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'custom';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string; // 'kg', 'lbs', 'reps', '%'
  deadline?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface Achievement {
  id?: string;
  type: 'workout_streak' | 'personal_record' | 'consistency' | 'milestone';
  title: string;
  description: string;
  icon: string; // Icon name
  dateEarned: string;
  value?: number; // Achievement value (e.g., 30 for 30-day streak)
}

export interface Badge {
  id?: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'special';
  dateEarned: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ===== ANALYTICS INTERFACES =====
export interface ProgressSummary {
  timeframe: '7d' | '30d' | '90d' | '1y';
  workoutCount: number;
  avgDuration: number;
  totalCalories: number;
  strengthImprovement: number; // Percentage
  consistencyScore: number; // 1-100
  topExercises: ExerciseStats[];
}

export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  timesPerformed: number;
  avgWeight: number;
  maxWeight: number;
  totalVolume: number;
  improvement: number; // Percentage since start
} 