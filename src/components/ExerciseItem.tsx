import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../constants/dataModels/exercise.model';
import { Icon } from 'react-native-elements';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getImageUrl } from '../utils/imageHelpers/getImageUrl';
import { bucketName } from '../constants/serverConstant';

interface ExerciseProps {
  exercise: Exercise;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}



// TODO: update the design of exercise details display according to new and old routine & exercise models

export default function ExerciseItem({ exercise, onEdit, onDelete }: ExerciseProps) {
// export default function ExerciseItem({ exercise }: { exercise: Exercise }) {

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (exercise.images) {
      getImageUrl(bucketName.exerciseImages, exercise.images[0])
        .then((url) => {
          setImageUrl(url);
        }
      );
    }
  }
  , [exercise]);

  return (
    <View style={styles.container}>
      {exercise.image && <Image source={{ uri: exercise.image }} style={styles.image} />}
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.name}</Text>
          {/* <View style={styles.icons}>
            <Icon name="edit" type="feather" color="#000" size={20} style={{padding: 10}} onPress={() => onEdit(exercise.id)}/>
            <Icon name="trash-2" type="feather" color="#000" size={20} style={{padding: 10}} onPress={() => onDelete(exercise.id)}/>
          </View> */}
        </View>
      {/* <Text style={styles.detail}>{exercise.description}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
    icons: {
        color: '#000',
        flexDirection: 'row',
        marginLeft: 10,
    }
});