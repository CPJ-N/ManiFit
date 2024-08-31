import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/store/reduxStore';

//App Screens & Componets
import { AUTH_TABS, BOTTOM_TABS, LOGIN, PROFILE_TABS, REGISTER } from './src/constants/screenNames';
import BottomNavigation from './src/navigation/BottomNavigation';
import LoadingScreen from './src/screens/AuthScreens/LoadingScreen';
import AuthNavigation from './src/navigation/AuthNavigation';
import ProfileNavigation from './src/navigation/ProfileNavigation';

const Stack = createNativeStackNavigator();

// TODO: configure redux toolkit state management for loading screen

export default function App() {
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
