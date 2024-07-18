import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EXERCISE_DETAILS, EXERCISE_EDIT, EXERCISE_FORM, EXERCISE_LIST, ROUTINE_LIST, SESSION_LIST } from "../constants/screenNames";
import ExerciseList from "../components/ExerciseList";
import ExerciseForm from "../components/ExerciseForm";
import EditExercise from "../screens/EditExcercise";
import ExcerciseDetails from "../screens/ExerciseDetails";
import RoutineList from "../screens/RoutineList";
import SessionsList from "../screens/SessionList";


const ExerciseTabs = createNativeStackNavigator();

export default function ExerciseNavigation() {
    return (
        <ExerciseTabs.Navigator screenOptions={{headerShown: false}} initialRouteName={SESSION_LIST}>
            <ExerciseTabs.Screen name={EXERCISE_LIST} component={ExerciseList} />
            <ExerciseTabs.Screen name={EXERCISE_FORM} component={ExerciseForm}  />
            <ExerciseTabs.Screen name={EXERCISE_EDIT} component={EditExercise} />
            <ExerciseTabs.Screen name={EXERCISE_DETAILS} component={ExcerciseDetails} />
            <ExerciseTabs.Screen name={ROUTINE_LIST} component={RoutineList} />
            <ExerciseTabs.Screen name={SESSION_LIST} component={SessionsList} />
        </ExerciseTabs.Navigator>
    );
}