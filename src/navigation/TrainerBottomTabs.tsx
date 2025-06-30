import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import { EXERCISE_TABS, FAVORITE, HOME, PROFILE_TABS } from '../constants/screenNames';

// Screens
import Home from '../screens/BottomNavScreens/Home';
import ProfileNavigation from './ProfileNavigation';
import ExerciseNavigation from './ExerciseNavigation';
import ClientListScreen from '../screens/ClientScreens/ClientListScreen';

const BottomTabs = createBottomTabNavigator();

export default function TrainerBottomTabs() {
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
            <BottomTabs.Screen 
                name={HOME} 
                component={Home} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home-outline" size={size} color={color}/>
                    ),
                }}
            />  
            
            <BottomTabs.Screen 
                name={EXERCISE_TABS} 
                component={ExerciseNavigation}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="albums-outline" size={size} color={color} />
                    ),
                }}
            />
            
            <BottomTabs.Screen 
                name={FAVORITE} 
                component={ClientListScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />
            
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