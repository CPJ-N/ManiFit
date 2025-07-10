import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUser } from '../utils/controllers/userController';
import { setUser, clearUser, logout as logoutAction } from '../store/userSlice';
import { UserDetails } from '../constants/dataModels/userDetails.model';

export interface AuthState {
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedProfile: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userDetails: null,
    isLoading: true,
    isAuthenticated: false,
    hasCompletedProfile: false,
  });
  
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      console.log('🔐 Auth state changed:', user ? `User signed in: ${user.email}` : 'User signed out');
      
      if (user) {
        // User is signed in, fetch user details
        try {
          console.log('👤 Checking user details for:', user.uid);
          const userDetails = await getUser(user.uid);
          
          if (userDetails) {
            console.log('✅ User details found:', userDetails.fullName);
            dispatch(setUser(userDetails));
            setAuthState({
              user,
              userDetails,
              isLoading: false,
              isAuthenticated: true,
              hasCompletedProfile: true,
            });
          } else {
            console.log('❌ No user details found - user needs to complete registration');
            dispatch(clearUser());
            setAuthState({
              user,
              userDetails: null,
              isLoading: false,
              isAuthenticated: true,
              hasCompletedProfile: false,
            });
          }
        } catch (error) {
          console.error('💥 Error fetching user details:', error);
          dispatch(clearUser());
          setAuthState({
            user,
            userDetails: null,
            isLoading: false,
            isAuthenticated: true,
            hasCompletedProfile: false,
          });
        }
      } else {
        // User is signed out
        console.log('🧹 Clearing user state');
        dispatch(clearUser());
        setAuthState({
          user: null,
          userDetails: null,
          isLoading: false,
          isAuthenticated: false,
          hasCompletedProfile: false,
        });
      }
    });

    return unsubscribe;
  }, [dispatch]);

  const logout = async (deleteAccount: boolean = false) => {
    try {
      if (deleteAccount && authState.userDetails?.uid) {
        // Delete user document from Firestore
        // This would require additional implementation
        console.log('🗑️ Account deletion requested');
      }
      
      await auth.signOut();
      dispatch(logoutAction());
      console.log('👋 User logged out successfully');
    } catch (error) {
      console.error('💥 Error during logout:', error);
      throw error;
    }
  };

  const refreshUserDetails = async () => {
    if (!authState.user) return;
    
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const userDetails = await getUser(authState.user.uid);
      
      if (userDetails) {
        dispatch(setUser(userDetails));
        setAuthState((prev: AuthState) => ({
          ...prev,
          userDetails,
          hasCompletedProfile: true,
          isLoading: false,
        }));
      } else {
        dispatch(clearUser());
        setAuthState((prev: AuthState) => ({
          ...prev,
          userDetails: null,
          hasCompletedProfile: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('💥 Error refreshing user details:', error);
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...authState,
    logout,
    refreshUserDetails,
  };
};