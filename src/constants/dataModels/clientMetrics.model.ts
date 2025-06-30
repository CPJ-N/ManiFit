// ===== CLIENT METRICS MODEL (MVP SIMPLIFIED) =====
// For tracking basic client progress - streamlined for MVP
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
  
  // ===== Simple Progress Data =====
  weightHistory: WeightEntry[];
  
  // ===== Health Data =====
  totalCaloriesBurned?: number;
  
  // ===== Timestamps =====
  createdAt: string;
  updatedAt: string;
}

// ===== WEIGHT TRACKING (MVP ESSENTIAL) =====
export interface WeightEntry {
  date: string; // ISO date string
  weight: number; // in kg
  notes?: string;
}

// ===== BASIC PROGRESS SUMMARY =====
export interface BasicProgressSummary {
  timeframe: '7d' | '30d' | '90d';
  workoutCount: number;
  avgDuration: number;
  totalCalories: number;
  consistencyScore: number; // 1-100 (percentage of assigned workouts completed)
} 