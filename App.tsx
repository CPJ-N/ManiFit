import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//App Screens & Componets
import Login from './src/screens/AuthScreens/LoginScreen';
import SignUp from './src/screens/AuthScreens/SignupScreen';
import { BOTTOM_TABS, LOGIN, REGISTER } from './src/constants/screenNames';
import BottomNavigation from './src/navigation/BottomNavigation';
import LoadingScreen from './src/screens/LoadingScreen';

const Stack = createNativeStackNavigator();

// TO DO: Add redux toolkit for state management

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="loading Screen" component={LoadingScreen} /> */}
        <Stack.Screen name={LOGIN} component={Login} />
        <Stack.Screen name={REGISTER} component={SignUp} />
        <Stack.Screen name={BOTTOM_TABS} component={BottomNavigation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
