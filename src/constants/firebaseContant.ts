export const firebaseBucketName = {
    exerciseImages: 'excercise-images',
    userImages: 'user-images',
}

// ===== ENHANCED FIREBASE COLLECTIONS =====
export const firebaseCollection = {
    // ===== Existing Collections (Keep as-is) =====
    exercises: 'Exercises',
    routines: 'Routines',
    userDetails: 'UsersDetails',
    transactionDetails: 'TransactionDetails',
    subscriptions: 'Subscriptions',
    plans: 'Plans',
    webhookEvents: 'WebhookEvents',
    charges: 'Charges',
    payouts: 'Payouts',
    
    // ===== New Collections =====
    workoutSessions: 'WorkoutSessions', // Real-time workout tracking
    exerciseLibrary: 'ExerciseLibrary', // Custom exercises created by trainers
    workoutTemplates: 'WorkoutTemplates', // Shareable workout templates
    clientMetrics: 'ClientMetrics', // Progress tracking data
}

// ===== SUB-COLLECTIONS =====
// These are sub-collections under main documents
export const firebaseSubCollections = {
    sessionExercises: 'exercises', // Under workout sessions
    routineComments: 'comments', // Under routines
}
