import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { assignRoutineToTrainee, getRoutinesByTrainer } from '../../utils/controllers/routineController';
import { auth } from '../../config/firebase';
import { Routine } from '../../constants/dataModels/routine.model';
import { getAlllinkedTrainees } from '../../utils/controllers/linkingTrainerTrainee';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function AssignRoutineScreen({navigation}) {
  const [selectedRoutine, setSelectedRoutine] = useState<string | undefined>(undefined);
  const [selectedTrainee, setSelectedTrainee] = useState<string | undefined>(undefined);
  const [trainees, setTrainees] = useState<any[] | undefined>(undefined);
  const [routines, setRoutines] = useState<Routine[] | undefined>(undefined);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    const fetchTrainees = async () => {
      const linkedTrainees = await getAlllinkedTrainees(auth.currentUser?.uid);
      setTrainees(linkedTrainees);
    }
    const fetchRoutines = async () => {
      const trainerRoutines = await getRoutinesByTrainer(auth.currentUser?.uid);
      setRoutines(trainerRoutines);
    }
    fetchRoutines()
    fetchTrainees()
  }, []);

  const handleAssignRoutine = async () => {
    if (selectedRoutine && selectedTrainee) {
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      await assignRoutineToTrainee(selectedRoutine, selectedTrainee, formattedDate);
    } else {
      console.log('Please select a routine and a trainee.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Ionicons name="chevron-back" size={24} color="#1e1e1e" onPress={() => navigation.goBack()}/>
          <Text style={styles.headerText}>Assign Routine</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Select a Routine</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedRoutine}
              onValueChange={(itemValue) => setSelectedRoutine(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Routine" value={undefined} />
              {routines?.map((routine) => (
                <Picker.Item key={routine.id} label={routine.name} value={routine.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Select a Trainee</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTrainee}
              onValueChange={(itemValue) => setSelectedTrainee(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Trainee" value={undefined} />
              {trainees?.map((trainee) => (
                <Picker.Item key={trainee.uid} label={trainee.fullName} value={trainee.uid} />
              ))}
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Select Date</Text>
          

            {/* <View style={{ alignItems: 'center', justifyContent: 'center', flex:1, flexDirection: 'row'  }}> */}
          {showDatePicker ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setShowDatePicker(false);
                setDate(currentDate);
              }}
              themeVariant='dark'
              style={{
                borderColor: '#ffd20a',
                borderRadius: 8,  
                justifyContent: 'center',  
                alignSelf: 'center',
                borderWidth: 1,
            }}
            />) : 
            (
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
            </TouchableOpacity>
            )}
          {/* </View> */}

          {selectedRoutine && selectedTrainee && <TouchableOpacity style={styles.assignButton} onPress={handleAssignRoutine}>
            <Text style={styles.assignButtonText}>Assign Routine</Text>
          </TouchableOpacity>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd20a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginLeft: 16,
  },
  formContainer: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    color: '#ffd20a',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    marginBottom: 100,
    height: 50,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  assignButton: {
    backgroundColor: '#ffd20a',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 100,
    alignSelf: 'center',
    marginTop: 30,
  },
  assignButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});