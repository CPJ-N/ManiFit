import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FAVORITE, HOME, PROFILE_TABS, RESOURCES } from '../constants/screenNames';

// Screens
import Home from '../screens/BottomNavScreens/Home';
import FavoriteScreen from '../screens/BottomNavScreens/FavoriteScreen';
import ResourcesScreen from '../screens/BottomNavScreens/ResourcesScreen';
import ProfileNavigation from './ProfileNavigation';

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
                <BottomTabs.Screen name={RESOURCES} component={ResourcesScreen}
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