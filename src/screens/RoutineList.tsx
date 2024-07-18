import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import RoutineItem from '../components/RoutineItem';
import { getAllRoutines } from '../utils/routineController';
import { EXERCISE_LIST } from '../constants/screenNames';
import { Routine } from '../constants/dataModels/routine.model';
import { Exercise } from '../constants/dataModels/exercise.model';

export default function RoutineList ({navigation}) {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoutineItem routine={item} onPress={handleRoutinePress} />}
      />
    </SafeAreaView>
  );

  function handleRoutinePress(exercises:string[]) {
    navigation.navigate(EXERCISE_LIST, { exercises });
    console.log('Routine selected:', exercises);
  }
};
