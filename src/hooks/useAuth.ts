import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { setAuthenticated, setAuthLoading } from '../store/userSlice';
import { RootState } from '../store/reduxStore';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, authLoading, userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log('🔐 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        console.log('✅ User authenticated:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName
        });
        dispatch(setAuthenticated(true));
      } else {
        console.log('❌ User not authenticated');
        dispatch(setAuthenticated(false));
      }
      
      console.log('🏁 Auth loading complete');
      dispatch(setAuthLoading(false));
    });

    return () => {
      console.log('🔄 Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);

  return { isAuthenticated, authLoading, userInfo };
};