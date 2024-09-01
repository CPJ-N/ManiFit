import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Exercise } from '../constants/dataModels/exercise.model';
import { Picker } from '@react-native-picker/picker';


export default function EditExercise({navigation}) {
    // Access the current route
    const route = useRoute();

    // Assuming the data you want is passed as a parameter named 'exerciseData'
    const exerciseInfo = (route.params as { exerciseInfo?: Exercise })?.exerciseInfo;

    const [exercise, setExercise] = useState<Exercise>(exerciseInfo);

  const handleUpdate = () => {
    console.log('Exercise updated:', exerciseInfo);
  };

  const handleChange = (value: string, field: keyof Exercise) => {
    setExercise({ ...exercise, [field]: value });
  };

  return (
    // <SafeAreaView style={styles.container}>
    <ScrollView style={styles.subContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Exercise</Text>
      </View>
      <View style={styles.profileSection}>
        {exercise?.image ? (
         <Image 
            source={{ uri: exercise?.image }} 
            style={styles.profileImage} 
          /> ) : (
        <Image
          source={{ uri: "https://imgs.search.brave.com/IyyDzO6z_54de5Nb2owc_nlj3-AccyAlnXrpvMmm9NQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ZlLzJl/L2NhL2ZlMmVjYTNk/MjM0YmMxZTg0YWFh/ZjAxMWIwNzFkNjg2/LmpwZw"}} // Replace with your image URL
          style={styles.profileImage}
        />)}
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange(text, 'name')}
        value={exercise['name']}
      />
      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange(text, 'description')}
        value={exercise['description']}
      />
      <Text style={styles.label}>Duration</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange(text, 'duration')}
        value={exercise['duration'].toString()}
      />
      <Text style={styles.label}>Repetitions</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange(text, 'repetitions')}
        value={exercise['repetitions'].toString()}
      />
      <Text style={styles.label}>Sets</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange(text, 'sets')}
        value={exercise['sets'].toString()}
      />
      <Text style={styles.label}>Weight (in kg)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange(text, 'weight')}
        value={exercise['weight'].toString()}
      />
      <Text style={styles.label}>Category *</Text>
      <Picker
        selectedValue={exercise.category}
        onValueChange={(itemValue, itemIndex) => handleChange(itemValue.toString(), 'category')}
        style={styles.picker}
      >
          <Picker.Item label="Cardio" value="cardio" />
          <Picker.Item label="Strength" value="strength" />
          <Picker.Item label="Flexibility" value="flexibility" />
          <Picker.Item label="Balance" value="balance" />
        </Picker>
        {/* {Object.keys(exercise).map((key) => (
          <View>
            <Text>{key}</Text>
            <TextInput
                key={key}
                style={styles.input}
                onChangeText={(text) => handleChange(text, key as keyof Exercise)}
                value={exercise[key as keyof Exercise].toString()}
            />
          </View>
        ))} */}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  subContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFD20A',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  backButton: {
    paddingTop: 30,
    paddingLeft: 10,
    position: 'absolute',
    left: 10,
    top: 15,
  },
  headerText: {
    paddingTop: 30,
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
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
  label: {
    marginTop: 5,
    fontSize: 16,
    color: '#000'
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
