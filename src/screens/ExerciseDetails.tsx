import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Exercise } from '../constants/dataModels/exercise.model';
import { EXERCISE_EDIT } from '../constants/screenNames';

export default function ExcerciseDetails ({navigation}) {

  // Access the current route
  const route = useRoute();

  // Assuming the data you want is passed as a parameter named 'exerciseData'
  const exerciseInfo = (route.params as { exerciseInfo?: Exercise })?.exerciseInfo;

  const handleEdit = (exerciseInfo: Exercise) => {
    navigation.navigate(EXERCISE_EDIT, { exerciseInfo });
    console.log(`Edit Exercise: ${exerciseInfo.id}`);
};
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exerciseInfo.name}</Text>
        <View style={styles.detailsContainer}>
          {/* <Text style={styles.detailsText}>15 Minutes</Text> */}
          {exerciseInfo.category && <Text style={styles.detailsText}>{exerciseInfo.category}</Text>}
          {/* <Text style={styles.detailsText}>150 Cal</Text> */}
        </View>
      </View>

      <View style={styles.imageContainer}>
        {exerciseInfo.image ? 
        (<Image source={{ uri: exerciseInfo.image }} style={styles.image} />):
        (<Image
          source={{ uri: 'https://via.placeholder.com/350x200' }} // Replace with your image URL
          style={styles.image}
        />)}
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        {exerciseInfo.duration && <Text style={styles.ingredientText}>Duration: {exerciseInfo.duration} mins</Text>}
        {exerciseInfo.weight && <Text style={styles.ingredientText}>Weight: {exerciseInfo.weight} kg</Text>}
        {exerciseInfo.sets && <Text style={styles.ingredientText}>Sets: {exerciseInfo.sets}</Text>}
        {exerciseInfo.repetitions && <Text style={styles.ingredientText}>Reps: {exerciseInfo.repetitions}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {exerciseInfo.description}
        </Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={()=>handleEdit(exerciseInfo)}>
        <Text style={styles.saveButtonText}>Edit Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 70,
    backgroundColor: '#FFD20A',
    padding: 20,
    alignItems: 'center',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25  ,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 5,
  },
  detailsText: {
    fontSize: 16,
    color: 'black',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: 'grey',
  },
  saveButton: {
    backgroundColor: '#FFD20A',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
