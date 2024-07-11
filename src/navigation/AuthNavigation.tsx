import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { REGISTER, LOGIN } from "../constants/screenNames";

//App Screens & Componets
import SignUp from "../screens/AuthScreens/SignupScreen";
import Login from "../screens/AuthScreens/LoginScreen";


const AuthScreens = createNativeStackNavigator();

export default function AuthNavigation() {

    return (
        <AuthScreens.Navigator 
            screenOptions={{headerShown: false}}>
            <AuthScreens.Screen name={REGISTER} component={SignUp}/>
            <AuthScreens.Screen name={LOGIN} component={Login} />
        </AuthScreens.Navigator>
    );
}
