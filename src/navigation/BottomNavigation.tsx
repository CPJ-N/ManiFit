import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import { EXERCISE_TABS, FAVORITE, HOME, PROFILE_TABS, CLIENT_LIST } from '../constants/screenNames';

// Screens
import Home from '../screens/BottomNavScreens/Home';
import FavoriteScreen from '../screens/BottomNavScreens/FavoriteScreen';
import ProfileNavigation from './ProfileNavigation';
import ExerciseNavigation from './ExerciseNavigation';
import CompleteExerciseList from '../screens/RoutineScreens/CompleteExerciseList';
import ClientListScreen from '../screens/ClientScreens/ClientListScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reduxStore';


const BottomTabs = createBottomTabNavigator();

export default function BottomNavigation() {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    return (
            <BottomTabs.Navigator screenOptions={{
                headerShown: false, tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: '#2A2A2A' },
                tabBarActiveTintColor: '#ffd20a', // Active icon color
                tabBarInactiveTintColor: '#FFFFFF', // Inactive icon color
                }}>
                <BottomTabs.Screen name={HOME} component={Home} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="home-outline" size={size} color={color}/>
                    ),
                }}/>  
                <BottomTabs.Screen name={EXERCISE_TABS} component={ExerciseNavigation}
                    options={{
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="albums-outline" size={size} color={color} />
                    ),
                }}/>
                { userInfo?.isTrainer === true && <BottomTabs.Screen name={FAVORITE} component={ClientListScreen}
                    options={{
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}/>}
                <BottomTabs.Screen name={PROFILE_TABS} component={ProfileNavigation} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}/>
            </BottomTabs.Navigator>
    );
}