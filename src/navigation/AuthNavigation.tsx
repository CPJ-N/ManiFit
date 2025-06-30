import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LOGIN, REGISTER, USER_DETAILS_FORM, FORGOT_PASSWORD } from "../constants/screenNames";

// Simplified Auth Screens
import Login from "../screens/AuthScreens/LoginScreen";
import SignUp from "../screens/AuthScreens/SignupScreen";
import UserDetailsForm from "../screens/AuthScreens/UserDetailsForm";
import ForgottenPassword from "../screens/AuthScreens/ForgetPasswordScreen";

const AuthScreens = createNativeStackNavigator();

export default function AuthNavigation({ user, hasCompletedProfile }: { user?: any, hasCompletedProfile?: boolean }) {
    // Simplified routing logic
    let initialRoute = LOGIN;
    
    if (user && !hasCompletedProfile) {
        // User is authenticated but needs to complete profile
        console.log('🔄 User authenticated, completing profile setup');
        initialRoute = USER_DETAILS_FORM;
    } else {
        // Default to login screen for simplicity
        console.log('🔐 Showing login screen');
        initialRoute = LOGIN;
    }

    return (
        <AuthScreens.Navigator 
            screenOptions={{headerShown: false}}
            initialRouteName={initialRoute}
        >
            <AuthScreens.Screen name={LOGIN} component={Login} />
            <AuthScreens.Screen name={REGISTER} component={SignUp} />
            <AuthScreens.Screen name={USER_DETAILS_FORM} component={UserDetailsForm} />
            <AuthScreens.Screen name={FORGOT_PASSWORD} component={ForgottenPassword} />
        </AuthScreens.Navigator>
    );
}
