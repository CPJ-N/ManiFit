import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import { EXERCISE_TABS, HOME, PROFILE_TABS } from '../constants/screenNames';

// Screens
import Home from '../screens/BottomNavScreens/Home';
import ProfileNavigation from './ProfileNavigation';
import TraineeWorkoutsScreen from '../screens/BottomNavScreens/TraineeWorkoutsScreen';

const BottomTabs = createBottomTabNavigator();

export default function TraineeBottomTabs() {
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
                component={TraineeWorkoutsScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="fitness-outline" size={size} color={color} />
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