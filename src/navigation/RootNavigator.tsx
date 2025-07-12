import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { ROUTES } from '../constants/navigation';
import { RootState } from '../store/reduxStore';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';

export type RootStackParamList = {
  [ROUTES.WELCOME]: undefined;
  [ROUTES.AUTH]: { screen: string } | undefined;
  [ROUTES.MAIN]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  hasCompletedProfile: boolean;
  isLoading: boolean;
}

export default function RootNavigator({ 
  hasCompletedProfile, 
  isLoading 
}: RootNavigatorProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  
  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.WELCOME}>
          <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
          <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
          <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const getInitialRoute = () => {
    if (isAuthenticated && hasCompletedProfile) {
      return ROUTES.MAIN;
    }
    if (isAuthenticated && !hasCompletedProfile) {
      return ROUTES.AUTH;
    }
    return ROUTES.WELCOME;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={getInitialRoute()}>
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 