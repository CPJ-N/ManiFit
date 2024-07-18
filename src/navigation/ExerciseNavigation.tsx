import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EXERCISE_FORM, EXERCISE_LIST, EXERCISE_SCREEN } from "../constants/screenNames";
import ExerciseList from "../components/ExcerciseList";
import ExerciseForm from "../components/ExerciseForm";
import ExerciseScreen from "../screens/ExerciseScreen";


const ExerciseTabs = createNativeStackNavigator();

export default function ExerciseNavigation() {
    return (
        <ExerciseTabs.Navigator screenOptions={{headerShown: false}} initialRouteName={EXERCISE_SCREEN}>
            <ExerciseTabs.Screen name={EXERCISE_SCREEN} component={ExerciseScreen} />
            <ExerciseTabs.Screen name={EXERCISE_LIST} component={ExerciseList} />
            <ExerciseTabs.Screen name={EXERCISE_FORM} component={ExerciseForm}  />
        </ExerciseTabs.Navigator>
    );
}