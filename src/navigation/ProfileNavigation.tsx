import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EDIT_PROFILE, LINK_TRAINEE, LINK_TRAINER, PROFILE, SETTINGS } from "../constants/screenNames";
import ProfileScreen from "../screens/BottomNavScreens/ProfileScreen";
import EditProfileScreen from "../screens/ProfileScreens/EditProfileScreen";
import LinkTraineesScreen from "../screens/ProfileScreens/LinkTraineesScreen";
import LinkedTrainerScreen from "../screens/ProfileScreens/LinkedTrainerScreen";
import SettingsScreen from "../screens/ProfileScreens/SettingsScreen";

const ProfileScreens = createNativeStackNavigator();

export default function ProfileNavigation() {
    return (
        <ProfileScreens.Navigator screenOptions={{headerShown: false}} initialRouteName={PROFILE}>
            <ProfileScreens.Screen name={PROFILE} component={ProfileScreen}  />
            <ProfileScreens.Screen name={EDIT_PROFILE} component={EditProfileScreen} />
            <ProfileScreens.Screen name={LINK_TRAINEE} component={LinkTraineesScreen} />
            <ProfileScreens.Screen name={LINK_TRAINER} component={LinkedTrainerScreen} />
            <ProfileScreens.Screen name={SETTINGS} component={SettingsScreen} />
        </ProfileScreens.Navigator>
    );
}