import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { REGISTER, LOGIN, USER_DETAILS_FORM } from "../constants/screenNames";

//App Screens & Componets
import SignUp from "../screens/AuthScreens/SignupScreen";
import Login from "../screens/AuthScreens/LoginScreen";
import UserDetailsForm from "../screens/AuthScreens/UserDetailsForm";


const AuthScreens = createNativeStackNavigator();

export default function AuthNavigation() {

    return (
        <AuthScreens.Navigator 
            screenOptions={{headerShown: false}}>
            <AuthScreens.Screen name={REGISTER} component={SignUp}/>
            <AuthScreens.Screen name={LOGIN} component={Login} />
            <AuthScreens.Screen name={USER_DETAILS_FORM} component={UserDetailsForm} />
        </AuthScreens.Navigator>
    );
}
