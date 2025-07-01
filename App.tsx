import React from 'react';
import "@/global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/reduxStore';
import { enableScreens } from 'react-native-screens';
import { Animated, View } from 'react-native';

//App Screens & Components
import LoadingScreen from './src/screens/LoadingScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { useEffect, useState, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [user, setUserState] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean>(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  
  // Simplified animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
    // Set an initial delay before starting transition
    const delay = 1500;

    const timeoutId = setTimeout(() => {
      if (!initializing) {
        console.log('⏰ Starting transition - initializing:', initializing, 'hasCompletedProfile:', hasCompletedProfile);
        setIsLoading(false);
        startTransition();
      }
    }, delay);

    // Clean up the timeout when component unmounts
    return () => {
      clearTimeout(timeoutId);
      fadeAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, [initializing, fadeAnim, scaleAnim]);

  useEffect(() => {
    // Request notification permissions (safe for Expo Go)
    requestNotificationPermissions();
  }, []);

  const startTransition = () => {
    // Simplified transition animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // Hide loading screen completely after animation
      setTimeout(() => {
        setShowLoadingScreen(false);
      }, 100);
    });

    // Separate scale animation for main app
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  };

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
  if (initializing || userDataLoading) {
    console.log('🔄 Still loading - initializing:', initializing, 'userDataLoading:', userDataLoading, 'hasCompletedProfile:', hasCompletedProfile);
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
      </View>
    );
  }

  const MainApp = () => (
    <Animated.View 
      style={{ 
        flex: 1,
        opacity: 1,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <RootNavigator
        user={user}
        hasCompletedProfile={hasCompletedProfile}
        isLoading={false}
      />
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
        {/* Main App - Always rendered */}
        <MainApp />
        {/* Loading Screen Overlay */}
        {showLoadingScreen && (
          <Animated.View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: fadeAnim,
              zIndex: 1000,
            }}
          >
            <LoadingScreen />
          </Animated.View>
        )}
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
