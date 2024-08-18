import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { CONFIGURE_EXERCISES, ROUTINE_LIST, SELECT_ROUTINE_EXERCISES } from '../../constants/screenNames';
import { auth } from '../../config/firebase';
import { Routine } from '../../constants/dataModels/routine.model';
import ScreenHeader from '../../components/ScreenHeader';

export default function CreateRoutineForm({ navigation }) {
  const [routine, setRoutine] = useState({
    name: '',
    description: ''
  });

  const handleChange = (name: keyof Routine, value: string | number) => {
    setRoutine(prev => ({ ...prev, [name]: value }));
  };

  const goBack = () => {
    navigation.navigate(ROUTINE_LIST);
  }

  const handleSubmit = async () => {
    if (!routine.name || !routine.description) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
    
    // await addRoutine(routine);
    const rotuineInfo = routine;
    setRoutine({
      name: '',
      description: ''
    })
    navigation.navigate(SELECT_ROUTINE_EXERCISES, rotuineInfo);
    // console.log('Success', 'Exercise added successfully.');
    // Alert.alert('Success', 'Exercise added successfully.');
  };

  return (
    <SafeAreaView style={{backgroundColor: '#1E1E1E', flex: 1}}>
      <ScreenHeader screenName='Create Routine' back={goBack} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={routine.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder='Enter routine name'
        />
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.input}
          value={routine.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder='Enter routine description'
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Select Exercises</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#1E1E1E',
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
    color: '#FFD20A'
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