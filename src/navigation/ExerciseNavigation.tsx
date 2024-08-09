import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COMPLETE_EXERCISE_LIST, CONFIGURE_EXERCISES, CREATE_ROUTINE, EXERCISE_DETAILS, EXERCISE_EDIT, EXERCISE_FORM, EXERCISE_LIST, ROUTINE_LIST, SELECT_ROUTINE_EXERCISES, SESSION_FORM, SESSION_LIST } from "../constants/screenNames";
import ExerciseList from "../components/ExerciseList";
import ExerciseForm from "../components/ExerciseForm";
import EditExercise from "../screens/EditExcercise";
import ExcerciseDetails from "../screens/ExerciseDetails";
import RoutineList from "../screens/RoutineList";
import SessionsList from "../screens/SessionList";
import SessionCreationForm from "../screens/SessionCreationForm";
import CompleteExerciseList from "../screens/CompleteExerciseList";
import ConfigureExercisesScreen from "../screens/ConfigureExercisesScreen";
import ExerciseSelectionScreen from "../screens/ExerciseSelectionScreen";
import CreateRoutineForm from "../screens/CreateRoutineForm";


const ExerciseTabs = createNativeStackNavigator();

export default function ExerciseNavigation() {
    return (
        <ExerciseTabs.Navigator screenOptions={{headerShown: false}} initialRouteName={ROUTINE_LIST}>
            <ExerciseTabs.Screen name={EXERCISE_LIST} component={ExerciseList} />
            <ExerciseTabs.Screen name={EXERCISE_FORM} component={ExerciseForm}  />
            <ExerciseTabs.Screen name={EXERCISE_EDIT} component={EditExercise} />
            <ExerciseTabs.Screen name={EXERCISE_DETAILS} component={ExcerciseDetails} />
            <ExerciseTabs.Screen name={COMPLETE_EXERCISE_LIST} component={CompleteExerciseList} />
            <ExerciseTabs.Screen name={CREATE_ROUTINE} component={CreateRoutineForm} />
            <ExerciseTabs.Screen name={CONFIGURE_EXERCISES} component={ConfigureExercisesScreen} />
            <ExerciseTabs.Screen name={SELECT_ROUTINE_EXERCISES} component={ExerciseSelectionScreen} />
            <ExerciseTabs.Screen name={ROUTINE_LIST} component={RoutineList} />
            <ExerciseTabs.Screen name={SESSION_LIST} component={SessionsList} />
            <ExerciseTabs.Screen name={SESSION_FORM} component={SessionCreationForm} />
        </ExerciseTabs.Navigator>
    );
}