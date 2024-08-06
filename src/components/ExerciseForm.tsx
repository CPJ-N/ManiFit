import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Exercise } from '../constants/dataModels/exercise.model';
import { addExercise } from '../utils/exerciseController';
import { ROUTINE_LIST } from '../constants/screenNames';
import { auth } from '../config/firebase';

export default function ExerciseForm({ navigation }) {
  const [exercise, setExercise] = useState<Exercise>({
    name: '',
    description: '',
    duration: undefined,
    repetitions: undefined,
    sets: undefined,
    weight: undefined,
    image: '',
    video: '',
    trainerId: auth.currentUser?.uid,
    category: ''
  });

  const handleChange = (name: keyof Exercise, value: string | number) => {
    setExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!exercise.name || !exercise.description) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
    
    await addExercise(exercise);
    navigation.navigate(ROUTINE_LIST);
    console.log('Success', 'Exercise added successfully.');
    // Alert.alert('Success', 'Exercise added successfully.');
  };

  return (
    <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={exercise.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.input}
          value={exercise.description}
          onChangeText={(text) => handleChange('description', text)}
        />
        <Text style={styles.label}>Duration (in minutes)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={exercise.duration?.toString()}
          onChangeText={(text) => handleChange('duration', Number(text))}
        />
        <Text style={styles.label}>Repetitions</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={exercise.repetitions?.toString()}
          onChangeText={(text) => handleChange('repetitions', Number(text))}
        />
        <Text style={styles.label}>Sets</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={exercise.sets?.toString()}
          onChangeText={(text) => handleChange('sets', Number(text))}
        />
        <Text style={styles.label}>Weight (in kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={exercise.weight?.toString()}
          onChangeText={(text) => handleChange('weight', Number(text))}
        />
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={exercise.category}
          onValueChange={(itemValue, itemIndex) => handleChange('category', itemValue.toString())}
          style={styles.picker}
        >
          <Picker.Item label="Cardio" value="cardio" />
          <Picker.Item label="Strength" value="strength" />
          <Picker.Item label="Flexibility" value="flexibility" />
          <Picker.Item label="Balance" value="balance" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Exercise</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff'
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
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
});