import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/navigation';

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
  user: any;
  hasCompletedProfile: boolean;
  isLoading: boolean;
}

export default function RootNavigator({ 
  user, 
  hasCompletedProfile, 
  isLoading 
}: RootNavigatorProps) {
  
  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ user && hasCompletedProfile ? ROUTES.MAIN : user ? ROUTES.AUTH : ROUTES.WELCOME }>
          <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
          <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
          <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ user && hasCompletedProfile ? ROUTES.MAIN : user ? ROUTES.AUTH : ROUTES.WELCOME }>
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 