import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExerciseList from "../components/ExerciseList";
import ExerciseForm from "../components/ExerciseForm";
import EditExercise from "../screens/EditExcercise";
import ExcerciseDetails from "../screens/ExerciseDetails";
import RoutineList from "../screens/RoutineScreens/RoutineList";
import CompleteExerciseList from "../screens/RoutineScreens/CompleteExerciseList";
import ConfigureExercisesScreen from "../screens/RoutineScreens/ConfigureExercisesScreen";
import ExerciseSelectionScreen from "../screens/RoutineScreens/ExerciseSelectionScreen";
import CreateRoutineForm from "../screens/RoutineScreens/CreateRoutineForm";
import ExerciseCatalog from "../screens/ExerciseScreens/ExerciseCatalog";
import { 
    COMPLETE_EXERCISE_LIST, 
    CONFIGURE_EXERCISES, 
    CREATE_ROUTINE, 
    EXERCISE_CATALOG, 
    EXERCISE_DETAILS, 
    EXERCISE_EDIT, 
    EXERCISE_FORM, 
    EXERCISE_LIST, 
    ROUTINE_LIST, 
    SELECT_ROUTINE_EXERCISES 
} from "../constants/screenNames";


const ExerciseTabs = createNativeStackNavigator();

export default function ExerciseNavigation() {
    return (
        <ExerciseTabs.Navigator screenOptions={{headerShown: false}} initialRouteName={ROUTINE_LIST}>
            <ExerciseTabs.Screen name={EXERCISE_LIST} component={ExerciseList} />
            <ExerciseTabs.Screen name={EXERCISE_FORM} component={ExerciseForm}  />
            <ExerciseTabs.Screen name={EXERCISE_EDIT} component={EditExercise} />
            <ExerciseTabs.Screen name={EXERCISE_DETAILS} component={ExcerciseDetails} />
            <ExerciseTabs.Screen name={EXERCISE_CATALOG} component={ExerciseCatalog} />
            <ExerciseTabs.Screen name={COMPLETE_EXERCISE_LIST} component={CompleteExerciseList} />
            <ExerciseTabs.Screen name={CREATE_ROUTINE} component={CreateRoutineForm} />
            <ExerciseTabs.Screen name={CONFIGURE_EXERCISES} component={ConfigureExercisesScreen} />
            <ExerciseTabs.Screen name={SELECT_ROUTINE_EXERCISES} component={ExerciseSelectionScreen} />
            <ExerciseTabs.Screen name={ROUTINE_LIST} component={RoutineList} />
        </ExerciseTabs.Navigator>
    );
}