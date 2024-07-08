import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../screens/Home';
import Welcome from '../screens/Welcome';
import { HOME, WELCOME } from '../constants/screenNames';

const BottomTabs = createBottomTabNavigator();

export default function BottomNavigation() {
    return (
            <BottomTabs.Navigator screenOptions={{headerShown: false}}>
                <BottomTabs.Screen name={HOME} component={Home} />
                <BottomTabs.Screen name={WELCOME} component={Welcome} />
                {/* <BottomTabs.Screen name="Resources" component={ResourcesScreen} />
                <BottomTabs.Screen name="Favorite" component={FavoriteScreen} />
                <BottomTabs.Screen name="Support" component={SupportScreen} /> */}
            </BottomTabs.Navigator>
    );
}