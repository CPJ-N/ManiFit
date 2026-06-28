import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/navigation';
import { getExerciseCategoryLabel } from '../constants/exerciseCatalog';

// Screens
import CategoriesScreen from '../screens/workouts/CategoriesScreen';
import ExercisesScreen from '../screens/workouts/ExercisesScreen';
import WorkoutScreen from '../screens/workouts/WorkoutScreen';

type WorkoutsStackParamList = {
  [ROUTES.CATEGORIES]: undefined;
  [ROUTES.EXERCISES]: { categoryId: string };
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
          title: 'Exercise Library',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name={ROUTES.EXERCISES} 
        component={ExercisesScreen}
        options={({ route }) => ({
          title: getExerciseCategoryLabel(route.params.categoryId),
          headerShown: false,
        })}
      />
      <Stack.Screen 
        name={ROUTES.WORKOUT} 
        component={WorkoutScreen}
        options={{
          title: 'Workout',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
} 
