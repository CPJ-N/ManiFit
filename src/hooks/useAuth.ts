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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      dispatch(setAuthenticated(!!firebaseUser));
      dispatch(setAuthLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  return { isAuthenticated, authLoading, userInfo };
};