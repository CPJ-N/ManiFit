// ConfigureExercisesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, SafeAreaView, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { ROUTINE_LIST } from '../../constants/screenNames';
import { addRoutine } from '../../utils/controllers/routineController';
import { auth } from '../../config/firebase';
import { exerciseImageUrlPrefix } from '../../constants/serverConstant';
import { ExerciseDetails } from '../../constants/dataModels/exercise.model';
import { Routine } from '../../constants/dataModels/routine.model';

export default function ConfigureExercisesScreen({ route, navigation }){
  const { selectedExercises, name, description } = route.params;
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [exerciseDetails, setExerciseDetails] = useState(
    selectedExercises.map((exercise) => ({
      ...exercise,
      sets: '',
      repetitions: '',
      duration: '',
      weight: '',
      specialInstructions: '',
    }))
  );

  // useEffect(() => {
  //   const fetchExerciseImages = async () => {
  //     const urls = await Promise.all(
  //       selectedExercises.map(async (exercise) => {
  //         if (exercise.images && exercise.images.length > 0) {
  //           const url = await getImageUrl(exercise.images[0]);
  //           return { [exercise.id]: url };
  //         }
  //         return {};
  //       })
  //     );

  //     setImageUrls(Object.assign({}, ...urls));
  //   }
  //   fetchExerciseImages();
  // }, [])

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...exerciseDetails];
    updatedDetails[index][field] = value;
    setExerciseDetails(updatedDetails);
  };

  const saveRoutine = () => {
    // Save the routine with the exercise details to the database
    // Code to save the routine goes here
    const exerciseDetailsConcise: ExerciseDetails[] = exerciseDetails.map((exercise) => ({
      exerciseId: exercise.id,
      sets: exercise.sets,
      repetitions: exercise.repetitions,
      duration: exercise.duration,
      weight: exercise.weight,
      specialInstructions: exercise.specialInstructions,
    }));

    addRoutine({
      name: name,
      description: description,
      exercises: exerciseDetailsConcise,
      createdBy: auth.currentUser?.uid,
    } as Routine)
    console.log('Routine saved', exerciseDetailsConcise);
    navigation.navigate(ROUTINE_LIST);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Configure Exercises</Text>
      <FlatList
        data={exerciseDetails}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.subcontainer}>
            {<Image source={{ uri: `${exerciseImageUrlPrefix}/${item.images[0]}` }} style={styles.image} />}
            <Text style={styles.header}>{item.name}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Sets"
              value={item.sets}
              onChangeText={(value) => handleInputChange(index, 'sets', value)}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Repetitions"
              value={item.repetitions}
              onChangeText={(value) => handleInputChange(index, 'repetitions', value)}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Duration"
              value={item.duration}
              onChangeText={(value) => handleInputChange(index, 'duration', value)}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Weight"
              value={item.weight}
              onChangeText={(value) => handleInputChange(index, 'weight', value)}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Special Instructions"
              value={item.specialInstructions}
              onChangeText={(value) => handleInputChange(index, 'specialInstructions', value)}
            />
          </View>
        )}
      />
      {/* <Button title="Save Routine" onPress={saveRoutine} /> */}
      <TouchableOpacity
        style={styles.button} 
        onPress={saveRoutine}
      >
        <Text style={styles.buttonText}>Save Routine</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#1E1E1E',
  },
  subcontainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      fontWeight: 'bold',
    },
  searchInput: {
      flex: 1,
      fontSize: 14,
      padding: 5,
      margin: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#FFD20A',
  },
  icons: {
      flexDirection: 'row',
      marginLeft: 10,
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