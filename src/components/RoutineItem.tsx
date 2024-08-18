import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Routine } from '../constants/dataModels/routine.model';

const RoutineItem = ({ routine, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(routine)}>
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
    color: '#f4f4f4',
  },
  details: {
    fontSize: 16,
    color: '#f4f4f4',
  },
});

export default RoutineItem;