import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Utility functions for authentication management
 */

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