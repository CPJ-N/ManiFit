import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../constants/navigation';
import { SCREEN_FLAGS } from '../config/screenFlags';

// Navigators and Screens
import WorkoutsNavigator from './WorkoutsNavigator';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AspirantRoutinesScreen from '../screens/aspirant/AspirantRoutinesScreen';
import AspirantRoutineDetailScreen from '../screens/aspirant/AspirantRoutineDetailScreen';
import AiCoachScreen from '../screens/aspirant/AiCoachScreen';
import ConnectCoachScreen from '../screens/aspirant/ConnectCoachScreen';
import AspirantProgressScreen from '../screens/aspirant/AspirantProgressScreen';

type MainTabParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.WORKOUTS]: undefined;
  [ROUTES.PROFILE]: undefined;
};

type MainStackParamList = {
  [ROUTES.MAIN_TABS]: undefined;
  [ROUTES.CHECKOUT]: undefined;
  [ROUTES.ASPIRANT_ROUTINES]: { filter?: 'today' | 'all' } | undefined;
  [ROUTES.ASPIRANT_ROUTINE_DETAIL]: { routine: any };
  [ROUTES.AI_COACH]: undefined;
  [ROUTES.CONNECT_COACH]: undefined;
  [ROUTES.ASPIRANT_PROGRESS]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

function DisabledCheckoutScreen() {
  return (
    <View style={styles.disabledScreen}>
      <Text style={styles.disabledTitle}>Subscription disabled</Text>
      <Text style={styles.disabledText}>
        Checkout is disabled for this test build.
      </Text>
    </View>
  );
}

const getCheckoutScreen = () =>
  SCREEN_FLAGS.checkoutEnabled
    ? require('../screens/CheckoutScreen').default
    : DisabledCheckoutScreen;

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#333',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#FFD20A',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.WORKOUTS}
        component={WorkoutsNavigator}
        options={{ 
          tabBarLabel: 'Workouts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen 
        name={ROUTES.MAIN_TABS}
        component={MainTabs} 
      />
      <Stack.Screen 
        name={ROUTES.CHECKOUT}
        getComponent={getCheckoutScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1E1E',
          },
          headerTintColor: '#FFD20A',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#FFFFFF',
          },
          headerBackTitleVisible: false,
          title: 'Subscription',
        }}
      />
      <Stack.Screen
        name={ROUTES.ASPIRANT_ROUTINES}
        component={AspirantRoutinesScreen}
      />
      <Stack.Screen
        name={ROUTES.ASPIRANT_ROUTINE_DETAIL}
        component={AspirantRoutineDetailScreen}
      />
      <Stack.Screen
        name={ROUTES.AI_COACH}
        component={AiCoachScreen}
      />
      <Stack.Screen
        name={ROUTES.CONNECT_COACH}
        component={ConnectCoachScreen}
      />
      <Stack.Screen
        name={ROUTES.ASPIRANT_PROGRESS}
        component={AspirantProgressScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  disabledScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    padding: 24,
  },
  disabledTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  disabledText: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
  },
});
