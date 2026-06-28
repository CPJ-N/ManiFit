import type { CoachVerificationStatus, UserRole } from '../roles';

// ===== ENHANCED USER DETAILS MODEL =====
// Extends your existing UserDetails model
export interface UserDetails {
    uid?: string; // Unique identifier for the user
    email: string; // Email address of the user
    fullName: string; // Full name of the user
    mobileNumber?: string; // Mobile number of the user
    profilePhotoName?: string; // URL of the profile photo
    role?: UserRole; // Product role. Defaults to aspirant; coach requires approval.
    coachVerificationStatus?: CoachVerificationStatus; // Gate for the Coach home layer.
    isTrainer: boolean; // Legacy compatibility flag for existing trainer/trainee code.
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: string; // Date of birth of the user
    age?: number; // Age of the user
    weight?: number; // Weight of the user in kilograms
    height?: number; // Height of the user in centimeters
    fitnessGoals?: string[]; // Fitness goals of the user
    linkedTrainees?: string[]; // Legacy array of Aspirant IDs for Coach accounts
    linkedTrainer?: string; // Legacy Coach ID for Aspirant accounts
    subscriptionId?: string; // Subscription ID of the user
    isSubscribed?: boolean; // Subscription status of the user
    
    // ===== New Enhanced Fields =====
    preferences?: UserPreferences;
    stats?: UserStats;
    notifications?: NotificationSettings;
    createdAt?: string; // ISO date string
    lastActive?: string; // ISO date string
}

export interface UserPreferences {
    // Exercise preferences
    favoriteExercises?: string[]; // Exercise IDs
    preferredEquipment?: string[];
    workoutDifficulty?: 'beginner' | 'intermediate' | 'advanced';
    
    // UI preferences
    theme?: 'light' | 'dark';
    units?: 'metric' | 'imperial'; // kg/lbs, cm/inches
    language?: string;
    
    // Workout preferences
    preferredWorkoutTime?: string; // "morning", "afternoon", "evening"
    workoutDuration?: number; // preferred minutes
    restDayPreference?: string[]; // ['sunday', 'wednesday']
}

export interface UserStats {
    // Workout stats
    totalWorkouts?: number;
    totalWorkoutTime?: number; // minutes
    currentStreak?: number; // days
    longestStreak?: number; // days
    
    // For Coaches
    totalClients?: number;
    routinesCreated?: number;
    workoutsAssigned?: number;
    
    // Progress tracking
    startWeight?: number;
    currentWeight?: number;
    weightHistory?: WeightEntry[];
    measurements?: BodyMeasurements;
}

export interface WeightEntry {
    date: string; // ISO date
    weight: number;
    notes?: string;
}

export interface BodyMeasurements {
    date: string;
    chest?: number;
    waist?: number;
    hips?: number;
    bicep?: number;
    thigh?: number;
    neck?: number;
}

export interface NotificationSettings {
    workoutReminders?: boolean;
    assignmentAlerts?: boolean;
    progressUpdates?: boolean;
    messagingNotifications?: boolean;
    emailNotifications?: boolean;
}
