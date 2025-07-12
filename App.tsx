import React from 'react';
import "@/global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/reduxStore';
import { enableScreens } from 'react-native-screens';
import { View } from 'react-native';

import LoadingScreen from './src/screens/LoadingScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { useEffect, useState } from 'react';
import { requestNotificationPermissions } from './src/config/permissions';
import { useAuth } from './src/hooks/useAuth';
import { useUserProfile } from './src/hooks/useUserProfile';

enableScreens();

function AppContent() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const { isAuthenticated, authLoading } = useAuth();
  const { userInfo, isLoading: userLoading } = useUserProfile();

  const hasCompletedProfile = !!userInfo;

  useEffect(() => {
    requestNotificationPermissions();

    // Show loading screen for at least 2 seconds
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Debug logging (remove for production)
  if (__DEV__) {
    console.log('App state:', {
      showLoadingScreen,
      authLoading,
      isAuthenticated,
      userLoading,
      hasCompletedProfile
    });
  }

  // Only show loading if explicitly needed
  if (showLoadingScreen) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
      </View>
    );
  }

  // Show loading if auth is still initializing
  if (authLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <RootNavigator
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