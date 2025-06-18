import React from 'react';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
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

enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const loadingFadeAnim = useRef(new Animated.Value(1)).current;
  const appFadeAnim = useRef(new Animated.Value(0)).current;
  const appScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Set an initial delay (e.g., 2.5 seconds) before starting transition
    const delay = 2500; // 2500 ms = 2.5 seconds

    const timeoutId = setTimeout(() => {
      if (store.getState()) {
        setIsLoading(false);
        startTransition();
      }
    }, delay);

    // Subscribe to store updates
    const unsubscribe = store.subscribe(() => {
      if (isLoading) {
        setIsLoading(false);
        startTransition();
      }
    });

    // Clean up the timeout and subscription when the component unmounts
    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [isLoading]); // Add isLoading dependency to prevent multiple calls

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
        delay: 200, // Slight delay for smoother transition
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

  const MainApp = () => (
    <Animated.View 
      style={{ 
        flex: 1, 
        opacity: appFadeAnim,
        transform: [{ scale: appScaleAnim }]
      }}
    >
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={AUTH_TABS} component={AuthNavigation} />
            <Stack.Screen name={BOTTOM_TABS} component={BottomNavigation}/>
            <Stack.Screen name={PROFILE_TABS} component={ProfileNavigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </Animated.View>
  );

  return (
    <GluestackUIProvider mode="light"><View style={{ flex: 1 }}>
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
      </View></GluestackUIProvider>
  );
}
