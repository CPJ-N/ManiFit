import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { REGISTER, LOGIN, BOTTOM_TABS,  } from "../constants/screenNames";
import SignUp from "../screens/AuthScreens/SignupScreen";
import Login from "../screens/AuthScreens/LoginScreen";
import BottomNavigation from "./BottomNavigation";

//App Screens & Componets

const AuthScreens = createNativeStackNavigator();

export default function AuthNavigator() {

    return (
        <AuthScreens.Navigator 
            screenOptions={{headerShown: false}}>
            <AuthScreens.Screen name={REGISTER} component={SignUp}/>
            <AuthScreens.Screen name={LOGIN} component={Login} />
            {/* <AuthScreens.Screen name={BOTTOM_TABS} component={BottomNavigation} /> */}
        </AuthScreens.Navigator>
    );
}
