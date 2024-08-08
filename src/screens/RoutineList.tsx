import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import RoutineItem from '../components/RoutineItem';
import { CONFIGURE_EXERCISES, CREATE_ROUTINE, EXERCISE_LIST } from '../constants/screenNames';
import { Routine } from '../constants/dataModels/routine.model';
import { Exercise } from '../constants/dataModels/exercise.model';
import { getAllRoutines } from '../utils/controllers/routineController';

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

export default function RoutineList ({navigation}) {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function handleRoutinePress(exercises:string[]) {
    navigation.navigate(EXERCISE_LIST, { exercises });
    console.log('Routine selected:', exercises);
  }

  useEffect(() => {
    const fetchRoutines = async () => {
      const routines = await getAllRoutines();
      setRoutines(routines);
      console.log(routines);
      setLoading(false);
    };
  
    fetchRoutines();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView>
      <Text>Select a Routine</Text>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.routineId}
        renderItem={({ item }) => <RoutineItem routine={item} onPress={handleRoutinePress} />}
      />
      <TouchableOpacity
        style={styles.button} 
        onPress={() => navigation.navigate(CREATE_ROUTINE)}
      >
        <Text style={styles.buttonText}>Create New Routine</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
