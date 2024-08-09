export interface UserDetails {
    uid?: string; // Unique identifier for the user
    email: string; // Email address of the user
    fullName: string; // Full name of the user
    mobileNumber?: string; // Mobile number of the user
    profilePhotoUrl?: string; // URL of the profile photo
    isTrainer: boolean; // Differentiates between trainer and trainee
    dateOfBirth?: string; // Date of birth of the user
    age?: number; // Age of the user
    weight?: number; // Weight of the user in kilograms
    height?: number; // Height of the user in centimeters
    fitnessGoals?: string[]; // Fitness goals of the user
}