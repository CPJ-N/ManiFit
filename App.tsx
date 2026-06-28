import React from 'react';
import "@/global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkoutsNavigator from './src/navigation/WorkoutsNavigator';

enableScreens();

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <WorkoutsNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
