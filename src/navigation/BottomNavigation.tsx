import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';
import { RootState } from '../store/reduxStore';

import { EXERCISE_TABS, HOME, PROFILE_TABS, CLIENT_LIST } from '../constants/screenNames';

// Screens
import Home from '../screens/BottomNavScreens/Home';
import TraineeWorkoutsScreen from '../screens/BottomNavScreens/TraineeWorkoutsScreen';
import ProfileNavigation from './ProfileNavigation';
import ExerciseNavigation from './ExerciseNavigation';
import ClientListScreen from '../screens/ClientScreens/ClientListScreen';

const BottomTabs = createBottomTabNavigator();

export default function BottomNavigation() {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const isTrainer = userInfo?.isTrainer === true;

    return (
        <BottomTabs.Navigator 
            screenOptions={{
                headerShown: false, 
                tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: '#2A2A2A' },
                tabBarActiveTintColor: '#ffd20a',
                tabBarInactiveTintColor: '#FFFFFF',
            }}
        >
            {/* Home - Available for both trainers and trainees */}
            <BottomTabs.Screen 
                name={HOME} 
                component={Home} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home-outline" size={size} color={color}/>
                    ),
                }}
            />
            
            {/* Exercise/Workout Tab - Role-based component */}
            <BottomTabs.Screen 
                name={EXERCISE_TABS} 
                component={isTrainer ? ExerciseNavigation : TraineeWorkoutsScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons 
                            name={isTrainer ? "albums-outline" : "fitness-outline"} 
                            size={size} 
                            color={color} 
                        />
                    ),
                }}
            />
            
            {/* Clients Tab - Only for trainers */}
            {isTrainer && (
                <BottomTabs.Screen 
                    name={CLIENT_LIST} 
                    component={ClientListScreen}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="people-outline" size={size} color={color} />
                        ),
                    }}
                />
            )}
            
            {/* Profile - Available for both trainers and trainees */}
            <BottomTabs.Screen 
                name={PROFILE_TABS} 
                component={ProfileNavigation} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </BottomTabs.Navigator>
    );
}