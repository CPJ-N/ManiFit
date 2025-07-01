import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/navigation';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Screens
import LoadingScreen from '../screens/LoadingScreen';

type RootStackParamList = {
  [ROUTES.AUTH]: undefined;
  [ROUTES.MAIN]: undefined;
  Loading: undefined;
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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && hasCompletedProfile ? (
          <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />
        ) : (
          <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 