import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { REGISTER, LOGIN, USER_DETAILS_FORM, FORGOT_PASSWORD, PASSWORD_RESET } from "../constants/screenNames";

//App Screens & Componets
import SignUp from "../screens/AuthScreens/SignupScreen";
import Login from "../screens/AuthScreens/LoginScreen";
import UserDetailsForm from "../screens/AuthScreens/UserDetailsForm";
import ForgottenPassword from "../screens/AuthScreens/ForgetPasswordScreen";
import PasswordReset from "../screens/AuthScreens/PasswordResetScreen";


const AuthScreens = createNativeStackNavigator();

export default function AuthNavigation() {

    return (
        <AuthScreens.Navigator 
            screenOptions={{headerShown: false}}>
            <AuthScreens.Screen name={REGISTER} component={SignUp}/>
            <AuthScreens.Screen name={LOGIN} component={Login} />
            <AuthScreens.Screen name={USER_DETAILS_FORM} component={UserDetailsForm} />
            <AuthScreens.Screen name={FORGOT_PASSWORD} component={ForgottenPassword} />
            <AuthScreens.Screen name={PASSWORD_RESET} component={PasswordReset} />
        </AuthScreens.Navigator>
    );
}
