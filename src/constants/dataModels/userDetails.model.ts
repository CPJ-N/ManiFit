export interface UserDetails {
    id?: string;
    email: string;
    fullName: string;
    mobileNumber?: string;
    profilePhotoUrl?: string;
    isTrainer: boolean;
    dateOfBirth?: string;
    age?: number;
    weight?: string; // in kilograms
    height?: string; // in centimeters
    fitnessGoals?: string[];
  }
  