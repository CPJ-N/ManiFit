import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { EXERCISE_TABS, FAVORITE, HOME, PROFILE_TABS } from '../constants/screenNames';

// Screens
import Home from '../screens/BottomNavScreens/Home';
import FavoriteScreen from '../screens/BottomNavScreens/FavoriteScreen';
import ProfileNavigation from './ProfileNavigation';
import ExerciseNavigation from './ExerciseNavigation';
import {ImageUploadScreen} from '../components/ImageUpload';
import RoutineList from '../screens/RoutineList';


const BottomTabs = createBottomTabNavigator();

export default function BottomNavigation() {
    return (
            <BottomTabs.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}}>
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
                <BottomTabs.Screen name={FAVORITE} component={FavoriteScreen}
                    options={{
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="bookmarks-outline" size={size} color={color} />
                    ),
                }}/>
                <BottomTabs.Screen name={PROFILE_TABS} component={ProfileNavigation} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}/>
            </BottomTabs.Navigator>
    );
}