export interface UserDetails {
    uid: string;
    email: string;
    fullName: string;
    mobileNumber?: string;
    profilePhotoUrl?: string;
    type: 'trainer' | 'trainee'; // Differentiates between trainer and trainee
    dateOfBirth?: string;
    age?: number;
    weight?: number; // in kilograms
    height?: number; // in centimeters
    fitnessGoals?: string[];
  }
  