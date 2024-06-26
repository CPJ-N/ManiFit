import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ExerciseForm, { ExerciseData } from './ExerciseForm'; // Adjust the path as necessary

const ExerciseManager = () => {
  const [exercises, setExercises] = useState<ExerciseData[]>([]);

  const handleFormSubmit = (data: ExerciseData) => {
    setExercises(currentExercises => [...currentExercises, data]);
    Alert.alert("Exercise Added", `Added ${data.name} to the list.`);
  };

  return (
    <View style={styles.container}>
      <ExerciseForm onSubmit={handleFormSubmit} />

      {exercises.length > 0 && (
        <View style={styles.exercisesList}>
          <Text style={styles.header}>Exercises</Text>
          {exercises.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>
              {exercise.name} - {exercise.sets} sets of {exercise.reps} reps
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0'
  },
  exercisesList: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

export default ExerciseManager;
