import React from 'react';
import "@/global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/store/reduxStore';
import { enableScreens } from 'react-native-screens';
import { Animated, View } from 'react-native';

//App Screens & Componets
import { AUTH_TABS, BOTTOM_TABS, PROFILE_TABS } from './src/constants/screenNames';
import BottomNavigation from './src/navigation/BottomNavigation';
import LoadingScreen from './src/screens/AuthScreens/LoadingScreen';
import AuthNavigation from './src/navigation/AuthNavigation';
import ProfileNavigation from './src/navigation/ProfileNavigation';
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

const Stack = createNativeStackNavigator();

// Main App Component wrapped with Redux Provider
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [user, setUserState] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean>(false);
  const [userDataLoading, setUserDataLoading] = useState(false); // NEW: Track user data loading state
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const loadingFadeAnim = useRef(new Animated.Value(1)).current;
  const appFadeAnim = useRef(new Animated.Value(0)).current;
  const appScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Authentication state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('🔐 Auth state changed:', user ? `User signed in: ${user.email}` : 'User signed out');
      setUserState(user);
      
      if (user) {
        // User is signed in, fetch user details and store in Redux
        setUserDataLoading(true); // Start loading user data
        try {
          console.log('👤 Checking user details for:', user.uid);
          const userDetails = await getUser(user.uid);
          if (userDetails) {
            console.log('✅ User details found, updating Redux state:', userDetails.fullName);
            console.log('🏠 Will show main app (BOTTOM_TABS) since user is authenticated with complete profile');
            dispatch(setUser(userDetails));
            setHasCompletedProfile(true);
          } else {
            console.log('❌ No user details found in Firestore - user needs to complete registration');
            console.log('🔄 Will show AUTH_TABS with USER_DETAILS_FORM as initial route');
            // Don't clear Redux state, just mark as incomplete profile
            setHasCompletedProfile(false);
          }
        } catch (error) {
          console.error('💥 Error fetching user details:', error);
          setHasCompletedProfile(false);
        } finally {
          setUserDataLoading(false); // Finish loading user data
        }
      } else {
        // User is signed out, clear Redux state
        console.log('🧹 Clearing user state');
        dispatch(clearUser());
        setHasCompletedProfile(false); // Set to false instead of null for signed out users
        setUserDataLoading(false); // No need to load data for signed out user
      }
      
      if (initializing) setInitializing(false);
    });

    return unsubscribe; // unsubscribe on unmount
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
    const delay = 1500; // Reduced delay since we're handling auth state properly

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
    };
  }, [initializing]);

  useEffect(() => {
    // Request notification permissions (safe for Expo Go)
    requestNotificationPermissions();
  }, []);

  const startTransition = () => {
    // Start coordinated transition animations
    Animated.parallel([
      // Fade out loading screen
      Animated.timing(loadingFadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Fade in main app
      Animated.timing(appFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      // Scale in main app for a subtle zoom effect
      Animated.spring(appScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hide loading screen completely after animation
      setTimeout(() => {
        setShowLoadingScreen(false);
      }, 100);
    });
  };

  // Add a fallback timeout to prevent infinite loading
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (initializing) {
        console.log('⚠️ Fallback timeout triggered - forcing auth state resolution');
        setInitializing(false);
        setHasCompletedProfile(false); // Default to showing auth screens
      }
    }, 5000); // 5 second fallback

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
        opacity: appFadeAnim,
        transform: [{ scale: appScaleAnim }]
      }}
    >
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{headerShown: false}}>
          {(() => {
            if (user && hasCompletedProfile && userInfo) {
              console.log('🏠 Showing main app - user is fully authenticated and has complete profile');
              return (
            <>
              <Stack.Screen name={BOTTOM_TABS} component={BottomNavigation}/>
              <Stack.Screen name={PROFILE_TABS} component={ProfileNavigation} />
            </>
              );
            } else {
              console.log('🔐 Showing auth screens - user:', user ? 'authenticated' : 'not authenticated', 'profile:', hasCompletedProfile ? 'complete' : 'incomplete');
              return (
                <Stack.Screen name={AUTH_TABS}>
                  {() => <AuthNavigation user={user} hasCompletedProfile={hasCompletedProfile} />}
                </Stack.Screen>
              );
            }
          })()}
          </Stack.Navigator>
        </NavigationContainer>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
        {/* Main App - Always rendered but initially transparent */}
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
              opacity: loadingFadeAnim,
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
    <GluestackUIProvider mode="light">
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GluestackUIProvider>
  );
}
