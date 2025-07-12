import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../config/firebase';
import { getUser } from '../utils/controllers/userController';
import { setUser } from '../store/userSlice';
import { RootState } from '../store/reduxStore';

export const useUserProfile = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = auth.currentUser;
      
      if (isAuthenticated && currentUser?.uid && !userInfo) {
        setLoading(true);
        try {
          const userProfile = await getUser(currentUser.uid);
          if (userProfile) {
            dispatch(setUser(userProfile));
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [isAuthenticated, userInfo, dispatch]);

  return { userInfo, isLoading: loading };
};