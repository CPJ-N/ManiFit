// ExerciseSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CONFIGURE_EXERCISES } from '../constants/screenNames';
import { Exercise } from '../constants/dataModels/exercise.model'; // Import the Exercise interface
import { getImageUrl } from '../utils/imageHelpers/getImageUrl';
import { getAllExercises } from '../utils/controllers/exerciseController';
import { exerciseImageUrlPrefix } from '../constants/serverConstant';

export default function ExerciseSelectionScreen ({ route, navigation }) {
  const { routineId } = route.params || {};
  const { name, description } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
      const fetchExercises = async () => {
          const fetchedExercises = await getAllExercises();
          // console.log(fetchedExercises);
          setExercises(fetchedExercises);

          // const urls = await Promise.all(
          //   fetchedExercises.map(async (exercise) => {
          //     if (exercise.images && exercise.images.length > 0) {
          //       const url = await getImageUrl(exercise.images[0]);
          //       return { [exercise.id]: url };
          //     }
          //     return {};
          //   })
          // );
    
          // setImageUrls(Object.assign({}, ...urls));
      };
      fetchExercises();
  }, []);

  const addExercise = (exercise) => {
    setSelectedExercises((prev) => [...prev, exercise]);
    // remove the exercise from the list of exercises
    // setExercises((prev) => prev.filter((ex) => ex.id !== exercise && ex.id));

    console.log(exercise.name);
  };

  const removeExercise = (exercise) => {
    setSelectedExercises((prev) => prev.filter((ex) => ex.id !== exercise.id));
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
          <TouchableOpacity style={styles.card} onPress={() => addExercise(item)}>
            {/* {imageUrls[item.id] && <Image source={{ uri: imageUrls[item.id] }} style={styles.image} />} */}
            {<Image source={{ uri: `${exerciseImageUrlPrefix}/${item.images[0]}` }} style={styles.image} />}
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
      backgroundColor: '#fff',
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
      backgroundColor: '#F0F0F0',
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