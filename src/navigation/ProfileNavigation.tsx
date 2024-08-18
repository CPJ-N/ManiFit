import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EDIT_PROFILE, PROFILE } from "../constants/screenNames";
import ProfileScreen from "../screens/BottomNavScreens/ProfileScreen";
import EditProfileScreen from "../screens/ProfileScreens/EditProfileScreen";

const ProfileScreens = createNativeStackNavigator();

export default function ProfileNavigation() {
    return (
        <ProfileScreens.Navigator screenOptions={{headerShown: false}} initialRouteName={PROFILE}>
            <ProfileScreens.Screen name={PROFILE} component={ProfileScreen}  />
            <ProfileScreens.Screen name={EDIT_PROFILE} component={EditProfileScreen} />
        </ProfileScreens.Navigator>
    );
}