import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EXERCISE_FORM, EXERCISE_LIST, PROFILE } from "../constants/screenNames";
import ExerciseList from "../components/ExcerciseList";
import ExerciseForm from "../components/ExerciseForm";


const ExerciseTabs = createNativeStackNavigator();

export default function ExerciseNavigation() {
    return (
        <ExerciseTabs.Navigator screenOptions={{headerShown: false}} initialRouteName={PROFILE}>
            <ExerciseTabs.Screen name={EXERCISE_LIST} component={ExerciseList} />
            <ExerciseTabs.Screen name={EXERCISE_FORM} component={ExerciseForm}  />
        </ExerciseTabs.Navigator>
    );
}