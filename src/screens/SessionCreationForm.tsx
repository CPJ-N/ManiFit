import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Routine } from '../constants/dataModels/routine.model';
import { createSession } from '../utils/controllers/sessionController';

interface SessionFormState {
  name: string;
  date: string;  // Assuming date is entered as a string for simplicity
  status: string;
}

export default function SessionCreationForm() {
  const [form, setForm] = useState<SessionFormState>({ name: '', date: '', status: '' });

  const handleInputChange = (value: string, field: keyof SessionFormState) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleSubmit = () => {
    // Here, you would typically validate the data and then send it to your backend or state management
    // For demonstration, we'll just show an alert
    if (!form.name || !form.date || !form.status) {   
      Alert.alert('Error', 'Please fill out all fields');
    } else {
        // createSession({
        //   sessionId: '',
        //   routines: [],
        //   createdBy: '',
        //   assignees: [],
        //   ...form
        // });
        createSession(
            {
                name: "Morning Workout",
                routines: [routines[0], routines[1]],
                createdBy: "t1",
                assignees: [
                  {
                    traineeId: "tr1",
                    date: "2024-07-20",
                    status: "planned"
                  },
                  {
                    traineeId: "tr2",
                    date: "2024-07-21",
                    status: "missed"
                  }
                ]
              },
        );
      Alert.alert('Success', `Session "${form.name}" created!`);
      // Reset form (optional)
      setForm({ name: '', date: '', status: '' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Session Name:</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleInputChange(text, 'name')}
          placeholder="Enter session name"
        />
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          value={form.date}
          onChangeText={(text) => handleInputChange(text, 'date')}
          placeholder="YYYY-MM-DD"
        />
        <Text style={styles.label}>Status:</Text>
        <TextInput
          style={styles.input}
          value={form.status}
          onChangeText={(text) => handleInputChange(text, 'status')}
          placeholder="Planned, Completed, Missed"
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Create Session"
            onPress={handleSubmit}
            color="#ffd20a"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
  }
});

// Sample Routines
const routines: Routine[] = [
    {
      id: "r1",
      name: "Strength Training",
      description: "A routine focusing on building core muscle strength.",
      exercises: ["e1", "e2"]
    },
    {
      id: "r2",
      name: "Cardio Blast",
      description: "High-intensity cardio routine to boost heart rate.",
      exercises: ["e3", "e4"]
    }
  ];
  