import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Exercise, ExerciseDetails } from '../constants/dataModels/exercise.model'
import { getExercise } from '../utils/controllers/exerciseController';


const ExerciseCard = ({viewDetails, exerciseDetails }: {  
  viewDetails: (exercise: Exercise) => void,
  exerciseDetails: ExerciseDetails}) => {

  const [exercise, setExercise] = useState<Exercise | null>(null);
    useEffect(() => {  
      const fetchExercises = async () => {
        const fetchedExercise = await getExercise(exerciseDetails.exerciseId);
        setExercise(fetchedExercise);
    };
    fetchExercises();
  }, []);

  return (
    <TouchableOpacity style={styles.card} onPress={()=> exercise && viewDetails(exercise)}>
      {exercise?.image && <Image source={{ uri: exercise.image }} style={styles.image} />}
      {exercise?.images && <Image source={{ uri: `${process.env.GITHUB_EXERCISE_IMAGE_URL_PREFIX}/${exercise.images[0]}`}} style={styles.image} />}
      <View style={styles.info}>
      {/* <View style={styles.icons}>
            <Icon name="edit" type="feather" color="#000" size={20} style={{padding: 5}}/>
            <Icon name="trash-2" type="feather" color="#000" size={20} style={{padding: 5}}/>
          </View> */}
        <Text style={styles.title}>{exercise?.name}</Text>
        {exerciseDetails.duration && <Text style={styles.details}>Duration: {exerciseDetails.duration} mins</Text>}
        {exerciseDetails.weight && <Text style={styles.details}>Weight: {exerciseDetails.weight} kg</Text>}
        {exerciseDetails.sets && <Text style={styles.details}>Sets: {exerciseDetails.sets}</Text>}
        {exerciseDetails.repetitions && <Text style={styles.details}>Reps: {exerciseDetails.repetitions}</Text>}
        {exerciseDetails.specialInstructions && <Text style={styles.details}>Note: {exerciseDetails.specialInstructions}</Text>}
      </View>
    </TouchableOpacity>
  )
}

export default ExerciseCard

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
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
    }
})