import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

// Define the type for the Exercise form's data
export interface ExerciseData {
  name: string;
  sets: number;
  reps: number;
}

interface ExerciseFormProps {
  onSubmit: (data: ExerciseData) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = () => {
    // Convert sets and reps to numbers and create the data object
    const exerciseData = {
      name,
      sets: parseInt(sets),
      reps: parseInt(reps),
    };

    // Call the onSubmit function passed by the parent component
    onSubmit(exerciseData);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text style={styles.label}>Sets:</Text>
      <TextInput
        value={sets}
        onChangeText={setSets}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Reps:</Text>
      <TextInput
        value={reps}
        onChangeText={setReps}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Save Exercise" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default ExerciseForm;
