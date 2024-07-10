export interface User {
    uid: string;
    email: string;
    displayName: string;
    profilePhotoUrl?: string;
    type: 'trainer' | 'trainee'; // Differentiates between trainer and trainee
    age?: number;
    weight?: number; // in kilograms
    fitnessGoals?: string[];
  }
  