import { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import RoutineItem from '../../components/RoutineItem';
import { CONFIGURE_EXERCISES, CREATE_ROUTINE, EXERCISE_LIST } from '../../constants/screenNames';
import { Routine } from '../../constants/dataModels/routine.model';
import { Exercise } from '../../constants/dataModels/exercise.model';
import { getAllRoutines, getRoutinesByTrainee, getRoutinesByTrainer } from '../../utils/controllers/routineController';
import ScreenHeader from '../../components/ScreenHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { auth } from '../../config/firebase';

/*
	1.	Create a New Routine or Select an Existing One:
	•	When a trainer wants to create or edit a routine, they can either start a new routine or choose an existing routine from a list.
	2.	Select Exercises:
	•	Provide a searchable and filterable list of exercises from which the trainer can select. This list should include exercises from both the local database and the open-source repository.
	•	Allow the trainer to add exercises to the routine by clicking on them.
	3.	Configure Exercise Details:
	•	For each selected exercise, provide input fields for additional details like sets, repetitions, duration, and weight.
	•	Allow the trainer to add special instructions if needed.
	4.	Save the Routine:
	•	Save the configured routine to the database with the associated exercise details.
*/

//TODO: manage exercise rendering when selection a routine

export default function RoutineList ({navigation}) {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  function handleRoutinePress(routine) {
    navigation.navigate(EXERCISE_LIST, { routine });
    console.log('Routine selected:', routine.id);
  }

  useEffect(() => {
    const fetchRoutines = async () => {
      // const routines = await getAllRoutines();
      const routines = userInfo?.isTrainer ? 
        await getRoutinesByTrainer(auth.currentUser?.uid) :
        await getRoutinesByTrainee(auth.currentUser?.uid);
      setRoutines(routines);
      setLoading(false);
    };
    
  
    fetchRoutines();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader screenName="Routines" navigation={navigation} />
      <FlatList
        data={routines}
        keyExtractor={(item) => item.routineId ? item.routineId : item.id}
        renderItem={({ item }) => <RoutineItem routine={item} onPress={handleRoutinePress} />}
      />
      {userInfo?.isTrainer &&
        <TouchableOpacity
          style={styles.button} 
          onPress={() => navigation.navigate(CREATE_ROUTINE)}
          >
          <Text style={styles.buttonText}>Create New Routine</Text>
        </TouchableOpacity>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#1E1E1E',
  },
  label: {
    padding: 20,
    fontSize: 16,
    color: '#f4f4f4',
  },
  button: {
    backgroundColor: '#FFD20A',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
})
