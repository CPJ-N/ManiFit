import React from 'react';
import "@/global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/reduxStore';
import { enableScreens } from 'react-native-screens';
import { View } from 'react-native';

//App Screens & Components
import LoadingScreen from './src/screens/LoadingScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { useEffect, useState } from 'react';
import { requestNotificationPermissions } from './src/config/permissions';
import { auth } from './src/config/firebase';
import { User } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './src/store/userSlice';
import { getUser } from './src/utils/controllers/userController';
import { UserDetails } from './src/constants/dataModels/userDetails.model';
import { RootState } from './src/store/reduxStore';

enableScreens();

// Main App Component wrapped with Redux Provider
function AppContent() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [user, setUserState] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean>(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    // Authentication state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('🔐 Auth state changed:', user ? `User signed in: ${user.email}` : 'User signed out');
      setUserState(user);
      
      if (user) {
        // User is signed in, fetch user details and store in Redux
        setUserDataLoading(true);
        try {
          console.log('👤 Checking user details for:', user.uid);
          const userDetails = await getUser(user.uid);
          if (userDetails) {
            console.log('✅ User details found, updating Redux state:', userDetails.fullName);
            dispatch(setUser(userDetails));
            setHasCompletedProfile(true);
          } else {
            console.log('❌ No user details found in Firestore - user needs to complete registration');
            setHasCompletedProfile(false);
          }
        } catch (error) {
          console.error('💥 Error fetching user details:', error);
          setHasCompletedProfile(false);
        } finally {
          setUserDataLoading(false);
        }
      } else {
        // User is signed out, clear Redux state
        console.log('🧹 Clearing user state');
        dispatch(clearUser());
        setHasCompletedProfile(false);
        setUserDataLoading(false);
      }
      
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [dispatch, initializing]);

  // Watch for Redux userInfo changes to update profile completion status
  useEffect(() => {
    if (user && userInfo) {
      console.log('📝 Redux userInfo updated, profile is now complete:', userInfo.fullName);
      setHasCompletedProfile(true);
    } else if (user && !userInfo) {
      console.log('📝 User authenticated but no userInfo in Redux, profile incomplete');
      setHasCompletedProfile(false);
    }
  }, [user, userInfo]);

  useEffect(() => {
    // Set an initial delay before hiding loading screen
    const delay = 2000;

    const timeoutId = setTimeout(() => {
      if (!initializing) {
        console.log('⏰ Hiding loading screen - initializing:', initializing, 'hasCompletedProfile:', hasCompletedProfile);
        setShowLoadingScreen(false);
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [initializing]);

  useEffect(() => {
    // Request notification permissions (safe for Expo Go)
    requestNotificationPermissions();
  }, []);

  // Add a fallback timeout to prevent infinite loading
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (initializing) {
        console.log('⚠️ Fallback timeout triggered - forcing auth state resolution');
        setInitializing(false);
        setHasCompletedProfile(false);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimeout);
  }, []);

  // Show loading screen while checking authentication state OR loading user data
  if (initializing || userDataLoading || showLoadingScreen) {
    console.log('🔄 Still loading - initializing:', initializing, 'userDataLoading:', userDataLoading, 'showLoadingScreen:', showLoadingScreen);
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <RootNavigator
        user={user}
        hasCompletedProfile={hasCompletedProfile}
        isLoading={false}
      />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <GluestackUIProvider mode="light">
        <StatusBar style="auto" />
        <AppContent />
      </GluestackUIProvider>
    </Provider>
  );
}
