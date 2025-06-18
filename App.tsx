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
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './src/store/userSlice';
import { getUser } from './src/utils/controllers/userController';
import { UserDetails } from './src/constants/dataModels/userDetails.model';

enableScreens();

const Stack = createNativeStackNavigator();

// Main App Component wrapped with Redux Provider
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [user, setUserState] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  const loadingFadeAnim = useRef(new Animated.Value(1)).current;
  const appFadeAnim = useRef(new Animated.Value(0)).current;
  const appScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Authentication state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
      setUserState(user);
      
      if (user) {
        // User is signed in, fetch user details and store in Redux
        try {
          const userDetails = await getUser(user.uid);
          if (userDetails) {
            dispatch(setUser(userDetails));
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        // User is signed out, clear Redux state
        dispatch(clearUser());
      }
      
      if (initializing) setInitializing(false);
    });

    return unsubscribe; // unsubscribe on unmount
  }, [dispatch, initializing]);

  useEffect(() => {
    // Set an initial delay before starting transition
    const delay = 1500; // Reduced delay since we're handling auth state properly

    const timeoutId = setTimeout(() => {
      if (!initializing) {
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

  // Show loading screen while checking authentication state
  if (initializing) {
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
          {user ? (
            // User is signed in, show main app screens
            <>
              <Stack.Screen name={BOTTOM_TABS} component={BottomNavigation}/>
              <Stack.Screen name={PROFILE_TABS} component={ProfileNavigation} />
            </>
          ) : (
            // User is not signed in, show auth screens
            <Stack.Screen name={AUTH_TABS} component={AuthNavigation} />
          )}
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
