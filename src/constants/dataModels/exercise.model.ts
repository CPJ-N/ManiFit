export interface Exercise {
    images?: Array<string>;
    id?: string;
    name: string;
    description: string;
    instructions: string[];
    duration?: number;
    repetitions?: number;
    sets?: number;
    weight?: number;
    image?: string;
    video?: string;
    trainerId: string;
    category: string;
}

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


export interface ExerciseDetails {
    exerciseId: string; // ID of the exercise
    duration?: number; // Duration in seconds
    repetitions?: number; // Number of repetitions
    sets?: number; // Number of sets
    weight?: number; // Weight in kilograms
    specialInstructions?: string; // Special instructions for this exercise instance
}