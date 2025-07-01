export const ROUTES = {
  // Root
  AUTH: 'Auth',
  MAIN: 'Main',
  
  // Auth Stack  
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main Tabs
  HOME: 'Home',
  WORKOUTS: 'Workouts', 
  PROFILE: 'Profile',
  
  // Workouts Stack
  CATEGORIES: 'Categories',
  EXERCISES: 'Exercises',
  WORKOUT: 'Workout',
  
  // Modals (Profile)
  CHECKOUT: 'Checkout',
  SETTINGS: 'Settings',
  PROGRESS: 'Progress',
} as const; 