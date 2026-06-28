export const ROUTES = {
  // Root
  AUTH: 'Auth',
  MAIN: 'Main',
  MAIN_TABS: 'MainTabs',
  
  // Auth Stack  
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main Tabs
  HOME: 'Home',
  WORKOUTS: 'Workouts', 
  PROFILE: 'Profile',

  // Aspirant Stack
  ASPIRANT_ROUTINES: 'AspirantRoutines',
  ASPIRANT_ROUTINE_DETAIL: 'AspirantRoutineDetail',
  AI_COACH: 'AiCoach',
  CONNECT_COACH: 'ConnectCoach',
  ASPIRANT_PROGRESS: 'AspirantProgress',
  
  // Workouts Stack
  CATEGORIES: 'Categories',
  EXERCISES: 'Exercises',
  WORKOUT: 'Workout',
  
  // Modals (Profile)
  CHECKOUT: 'Checkout',
  SETTINGS: 'Settings',
  PROGRESS: 'Progress',
  WELCOME: 'Welcome',
} as const; 
