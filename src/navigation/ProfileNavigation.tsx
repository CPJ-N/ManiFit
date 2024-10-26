import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { 
    DELETE_ACCOUNT, 
    EDIT_PROFILE, 
    LINK_TRAINEE, 
    LINK_TRAINER, 
    PASSWORD_SETTINGS, 
    PRIVACY_POLICY, 
    PROFILE, 
    RAZORPAY_CHECKOUT, 
    REGISTER_TRAINER, 
    SETTINGS 
} from "../constants/screenNames";

//Screens
import ProfileScreen from "../screens/BottomNavScreens/ProfileScreen";
import EditProfileScreen from "../screens/ProfileScreens/EditProfileScreen";
import LinkTraineesScreen from "../screens/ProfileScreens/LinkTraineesScreen";
import LinkedTrainerScreen from "../screens/ProfileScreens/LinkedTrainerScreen";
import SettingsScreen from "../screens/ProfileScreens/SettingsScreen";
import PrivacyPolicyScreen from "../screens/ProfileScreens/PrivacyPolicyScreen";
import DeleteAccountScreen from "../screens/ProfileScreens/DeleteAccountScreen";
import PasswordSettingsScreen from "../screens/ProfileScreens/PasswordSettingsScreen";
import TrainerRegistrationScreen from "../screens/ProfileScreens/TrainerRegistrationScreen";
import RazorpayCheckout from "../screens/RazorpayCheckout";


const ProfileScreens = createNativeStackNavigator();

export default function ProfileNavigation() {
    return (
        <ProfileScreens.Navigator screenOptions={{headerShown: false}} initialRouteName={PROFILE}>
            <ProfileScreens.Screen name={PROFILE} component={ProfileScreen}  />
            <ProfileScreens.Screen name={EDIT_PROFILE} component={EditProfileScreen} />
            <ProfileScreens.Screen name={LINK_TRAINEE} component={LinkTraineesScreen} />
            <ProfileScreens.Screen name={LINK_TRAINER} component={LinkedTrainerScreen} />
            <ProfileScreens.Screen name={PRIVACY_POLICY} component={PrivacyPolicyScreen} />
            <ProfileScreens.Screen name={SETTINGS} component={SettingsScreen} />
            <ProfileScreens.Screen name={RAZORPAY_CHECKOUT} component={RazorpayCheckout} />
            <ProfileScreens.Screen name={DELETE_ACCOUNT} component={DeleteAccountScreen} />
            <ProfileScreens.Screen name={PASSWORD_SETTINGS} component={PasswordSettingsScreen} />
            <ProfileScreens.Screen name={REGISTER_TRAINER} component={TrainerRegistrationScreen} />
        </ProfileScreens.Navigator>
    );
}