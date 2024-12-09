import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/store/reduxStore';
import { enableScreens } from 'react-native-screens';

//App Screens & Componets
import { AUTH_TABS, BOTTOM_TABS, LOGIN, PROFILE_TABS, REGISTER } from './src/constants/screenNames';
import BottomNavigation from './src/navigation/BottomNavigation';
import LoadingScreen from './src/screens/AuthScreens/LoadingScreen';
import AuthNavigation from './src/navigation/AuthNavigation';
import ProfileNavigation from './src/navigation/ProfileNavigation';
import { useEffect, useState } from 'react';
import { requestNotificationPermissions } from './src/utils/notificationHandler';

enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set an initial delay (e.g., 2 seconds) before changing the loading state
    const delay = 2000; // 2000 ms = 2 seconds

    const timeoutId = setTimeout(() => {
      if (store.getState()) {
        setIsLoading(false);
      }
    }, delay);

    // Subscribe to store updates
    const unsubscribe = store.subscribe(() => {
      setIsLoading(false);
    });

    // Clean up the timeout and subscription when the component unmounts
    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only on mount

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {/* <Stack.Screen name="loading Screen" component={LoadingScreen} /> */}
          <Stack.Screen name={AUTH_TABS} component={AuthNavigation} />
          <Stack.Screen name={BOTTOM_TABS} component={BottomNavigation}/>
          <Stack.Screen name={PROFILE_TABS} component={ProfileNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
