import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Routine } from '../constants/dataModels/routine.model';

interface RoutineItemProps {
  routine: Routine;
  onPress: (routineId: string) => void;
}

const RoutineItem = ({ routine, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(routine.exercises)}>
      <Text style={styles.title}>{routine.name}</Text>
      <Text style={styles.details}>{routine.description}</Text>
      {/* <Text style={styles.details}>Exercises: {routine.numberOfExercises}</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
});

export default RoutineItem;