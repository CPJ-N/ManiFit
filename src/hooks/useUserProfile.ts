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
      
      console.log('👤 User profile check:', {
        isAuthenticated,
        hasCurrentUser: !!currentUser,
        userId: currentUser?.uid,
        hasUserInfo: !!userInfo
      });
      
      if (isAuthenticated && currentUser?.uid && !userInfo) {
        console.log('📥 Loading user profile for:', currentUser.uid);
        setLoading(true);
        
        try {
          const userProfile = await getUser(currentUser.uid);
          if (userProfile) {
            console.log('✅ User profile loaded successfully:', {
              fullName: userProfile.fullName,
              email: userProfile.email,
              isTrainer: userProfile.isTrainer
            });
            dispatch(setUser(userProfile));
          } else {
            console.log('❌ No user profile found in Firestore');
          }
        } catch (error) {
          console.error('💥 Error loading user profile:', error);
        } finally {
          setLoading(false);
          console.log('🏁 User profile loading complete');
        }
      } else if (!isAuthenticated) {
        console.log('🚫 Not authenticated - skipping profile load');
      } else if (userInfo) {
        console.log('✅ User profile already loaded:', userInfo.fullName);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, userInfo, dispatch]);

  return { userInfo, isLoading: loading };
};