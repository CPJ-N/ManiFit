import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WELCOME_ONBOARDING, REGISTER, LOGIN, USER_DETAILS_FORM, TRAINER_ONBOARDING, TRAINEE_ONBOARDING, FORGOT_PASSWORD, PASSWORD_RESET } from "../constants/screenNames";
import { auth } from "../config/firebase";

//App Screens & Componets
import WelcomeOnboardingScreen from "../screens/AuthScreens/WelcomeOnboardingScreen";
import SignUp from "../screens/AuthScreens/SignupScreen";
import Login from "../screens/AuthScreens/LoginScreen";
import UserDetailsForm from "../screens/AuthScreens/UserDetailsForm";
import TrainerOnboardingScreen from "../screens/AuthScreens/TrainerOnboardingScreen";
import TraineeOnboardingScreen from "../screens/AuthScreens/TraineeOnboardingScreen";
import ForgottenPassword from "../screens/AuthScreens/ForgetPasswordScreen";
import PasswordReset from "../screens/AuthScreens/PasswordResetScreen";

const AuthScreens = createNativeStackNavigator();

export default function AuthNavigation({ user, hasCompletedProfile }: { user?: any, hasCompletedProfile?: boolean }) {
    // Determine initial route based on user state
    let initialRoute = WELCOME_ONBOARDING;
    
    if (user && !hasCompletedProfile) {
        // User is authenticated but hasn't completed profile setup
        console.log('🔄 AuthNavigation: User authenticated but profile incomplete, starting with USER_DETAILS_FORM');
        initialRoute = USER_DETAILS_FORM;
    } else if (!user) {
        // No user, start with welcome onboarding
        console.log('🎬 AuthNavigation: No user, starting with WELCOME_ONBOARDING');
        initialRoute = WELCOME_ONBOARDING;
    }

    return (
        <AuthScreens.Navigator 
            screenOptions={{headerShown: false}}
            initialRouteName={initialRoute}>
            <AuthScreens.Screen name={WELCOME_ONBOARDING} component={WelcomeOnboardingScreen} />
            <AuthScreens.Screen name={LOGIN} component={Login} />
            <AuthScreens.Screen name={REGISTER} component={SignUp}/>
            <AuthScreens.Screen name={USER_DETAILS_FORM} component={UserDetailsForm} />
            <AuthScreens.Screen name={TRAINER_ONBOARDING} component={TrainerOnboardingScreen} />
            <AuthScreens.Screen name={TRAINEE_ONBOARDING} component={TraineeOnboardingScreen} />
            <AuthScreens.Screen name={FORGOT_PASSWORD} component={ForgottenPassword} />
            <AuthScreens.Screen name={PASSWORD_RESET} component={PasswordReset} />
        </AuthScreens.Navigator>
    );
}
