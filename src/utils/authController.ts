import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Utility functions for authentication management
 */

/**
 * Sign in user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise<User> - Firebase user object
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const processedEmail = email.toLowerCase();
    const trimmedPassword = password.trim();
    
    console.log('🔑 Attempting login with email:', `"${processedEmail}"`);
    console.log('🔑 Original email input:', `"${email}"`);
    console.log('🔑 Login attempt details:');
    console.log('  - Email length:', processedEmail.length);
    console.log('  - Password length:', trimmedPassword.length);
    console.log('  - Email domain:', processedEmail.split('@')[1]);
    
    const userCredential = await signInWithEmailAndPassword(auth, processedEmail, trimmedPassword);
    
    console.log('✅ Login successful!');
    console.log('👤 User info:', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
      creationTime: userCredential.user.metadata.creationTime,
      lastSignInTime: userCredential.user.metadata.lastSignInTime
    });
    
    return userCredential.user;
  } catch (error: any) {
    console.log('💥 Login failed with detailed error:');
    console.log('  - Error code:', error.code);
    console.log('  - Error message:', error.message);
    console.log('  - Full error object:', JSON.stringify(error, null, 2));
    
    // Check for specific error types
    if (error.code === 'auth/network-request-failed') {
      console.log('🌐 Network issue detected');
    }
    if (error.message.includes('API key')) {
      console.log('🔑 API key issue detected');
    }
    if (error.code === 'auth/invalid-credential') {
      console.log('🚨 Invalid credential error - check if user exists in Firebase Console');
    }
    
    throw error;
  }
};

/**
 * Register new user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @param fullName - User's full name
 * @returns Promise<User> - Firebase user object
 */
export const registerUser = async (email: string, password: string, fullName: string): Promise<User> => {
  try {
    console.log('📝 Attempting to register user:', email);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    
    // Create user profile
    const userDetails = {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      fullName: fullName.trim(),
      isTrainer: false,
      isSubscribed: false,
      createdAt: new Date().toISOString(),
    };

    const { createUser } = await import('./controllers/userController');
    await createUser(userDetails, userCredential.user.uid);
    
    console.log('✅ User registered and profile created successfully');
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    throw error;
  }
};

/**
 * Get user-friendly error message from Firebase auth error
 * @param error - Firebase auth error
 * @returns string - User-friendly error message
 */
export const getAuthErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return 'Authentication failed. Please try again.';
  }
};

/**
 * Sign out the current user and clear all persisted sessions
 * Useful for clearing incomplete registration sessions
 */
export const clearAuthSession = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing authentication session...');
    await signOut(auth);
    console.log('✅ Authentication session cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing authentication session:', error);
    throw error;
  }
};

/**
 * Check if current user has completed their profile
 * @param user - Firebase user object
 * @returns Promise<boolean> - true if profile is complete
 */
export const hasCompleteProfile = async (user: any): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const { getUser } = await import('./controllers/userController');
    const userDetails = await getUser(user.uid);
    return !!userDetails;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
};

/**
 * Development helper: Clear any incomplete sessions on app start
 * Only use this during development for testing fresh user flows
 */
export const clearIncompleteSessionsForDev = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const isComplete = await hasCompleteProfile(currentUser);
    if (!isComplete) {
      console.log('🔄 Development mode: Clearing incomplete session for fresh testing');
      await clearAuthSession();
    }
  }
};

/**
 * Get current authentication state summary for debugging
 */
export const getAuthDebugInfo = (): string => {
  const user = auth.currentUser;
  if (!user) {
    return '❌ No authenticated user';
  }
  
  return `✅ Authenticated user: ${user.email} (${user.uid})`;
}; 