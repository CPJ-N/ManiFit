import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Exercise } from '../constants/dataModels/exercise.model'
import { Icon } from 'react-native-elements';
import { getExercise } from '../utils/exerciseController';

interface ExerciseProps {
  exerciseId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  viewDetails: (exercise: Exercise) => void;
}



const ExerciseCard = ({ exerciseId, viewDetails }: { exerciseId: string, viewDetails: (exercise: Exercise) => void}) => {

  const [exercise, setExercise] = useState<Exercise>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            const fetchedExercise = await getExercise(exerciseId);
            console.log(fetchedExercise);
            setExercise(fetchedExercise);
        };
        fetchExercises();
    }, []);

  return (
    <TouchableOpacity style={styles.card} onPress={()=>viewDetails(exercise)}>
      {exercise?.image && <Image source={{ uri: exercise.image }} style={styles.image} />}
      <View style={styles.info}>
      {/* <View style={styles.icons}>
            <Icon name="edit" type="feather" color="#000" size={20} style={{padding: 5}}/>
            <Icon name="trash-2" type="feather" color="#000" size={20} style={{padding: 5}}/>
          </View> */}
        <Text style={styles.title}>{exercise?.name}</Text>
        <Text style={styles.details}>{`${exercise?.duration} Minutes · ${exercise?.sets} Kcal · ${exercise?.repetitions} Exercises`}</Text>
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