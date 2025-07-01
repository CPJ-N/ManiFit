import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/navigation';

// Screens
import CategoriesScreen from '../screens/workouts/CategoriesScreen';
import ExercisesScreen from '../screens/workouts/ExercisesScreen';
import WorkoutScreen from '../screens/workouts/WorkoutScreen';

type WorkoutsStackParamList = {
  [ROUTES.CATEGORIES]: undefined;
  [ROUTES.EXERCISES]: { categoryName: string; categoryImage: any };
  [ROUTES.WORKOUT]: { exercises: any[] };
};

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

export default function WorkoutsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E1E1E',
        },
        headerTintColor: '#FFD20A',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name={ROUTES.CATEGORIES} 
        component={CategoriesScreen}
        options={{
          title: 'Exercise Categories',
          headerShown: false, // We'll add a custom header in the component
        }}
      />
      <Stack.Screen 
        name={ROUTES.EXERCISES} 
        component={ExercisesScreen}
        options={({ route }) => ({
          title: route.params.categoryName.toUpperCase(),
        })}
      />
      <Stack.Screen 
        name={ROUTES.WORKOUT} 
        component={WorkoutScreen}
        options={{
          title: 'Workout',
          gestureEnabled: false, // Prevent going back during workout
        }}
      />
    </Stack.Navigator>
  );
} 