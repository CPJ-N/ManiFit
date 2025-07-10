import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { deleteUserDocument } from '../controllers/userController';

export class AuthService {
  /**
   * Sign out the current user
   * @param userId - Optional user ID to delete user document
   * @param deleteAccount - Whether to delete the user account completely
   */
  static async logout(userId?: string, deleteAccount: boolean = false): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      
      if (deleteAccount && currentUser && userId) {
        // Delete user document from Firestore
        await deleteUserDocument(userId);
        console.log('🗑️ User document deleted from Firestore');
      }
      
      // Sign out from Firebase Auth
      await signOut(auth);
      console.log('👋 User signed out successfully');
      
    } catch (error) {
      console.error('💥 Error during logout:', error);
      throw error;
    }
  }

  /**
   * Get current user ID
   */
  static getCurrentUserId(): string | null {
    const currentUser = auth.currentUser;
    return currentUser?.uid || null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  /**
   * Get current user email
   */
  static getCurrentUserEmail(): string | null {
    const currentUser = auth.currentUser;
    return currentUser?.email || null;
  }
}