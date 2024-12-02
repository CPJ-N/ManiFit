// ExerciseSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CONFIGURE_EXERCISES } from '../../constants/screenNames';
// import { Exercise } from '../constants/dataModels/exercise.model'; // Import the Exercise interface
import { getAllExercises } from '../../utils/controllers/exerciseController';

export default function ExerciseSelectionScreen ({ route, navigation } : { route: any, navigation: any }) {
  const { routineId } = route.params || {};
  const { name, description } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
      const fetchExercises = async () => {
          const fetchedExercises = await getAllExercises();
          
          const exercisesWithSelection = fetchedExercises.map(exercise => ({
            ...exercise,
            isSelected: false,
          }));
          
          setExercises(exercisesWithSelection);

      };
      fetchExercises();
  }, []);

  const addExercise = (exercise: any) => {
    setSelectedExercises((prev) => [...prev, exercise]);
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exercise.id ? { ...ex, isSelected: true } : ex
      )
    );
    console.log(`adding: ${exercise.name}`);
  };

  const removeExercise = (exercise: any) => {
    setSelectedExercises((prev) =>
      prev.filter((ex: any) => ex.id !== exercise.id)
    );
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exercise.id ? { ...ex, isSelected: false } : ex
      )
    );
    console.log(`removing: ${exercise.name}`);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TextInput
                placeholder="Search exercises..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (          
          <TouchableOpacity 
            style={[styles.card, item.isSelected ? { backgroundColor: '#ffd20a' } : { backgroundColor: '#F0F0F0' }]} 
            onPress={() =>
              item.isSelected ? removeExercise(item) : addExercise(item)
            }>
            {/* {imageUrls[item.id] && <Image source={{ uri: imageUrls[item.id] }} style={styles.image} />} */}
            {<Image source={{ uri: `${process.env.GITHUB_EXERCISE_IMAGE_URL_PREFIX}/${item.images[0]}` }} style={styles.image} />}
            <View style={styles.info}>
              <Text style={styles.title}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.button} 
        onPress={() =>
          navigation.navigate(CONFIGURE_EXERCISES, {
            routineId,
            name,
            description,
            selectedExercises,
          })
        }
      >
        <Text style={styles.buttonText}>Next</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  searchInput: {
      flex: 1,
      fontSize: 16,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
  },
  card: {
      flexDirection: 'row',
      padding: 5,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 10,
      elevation: 3,
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    info: {
      flex: 1,
      paddingHorizontal: 10,
      justifyContent: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    details: {
      fontSize: 14,
      color: 'gray',
    },
    icons: {
      color: '#000',
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
})