import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Exercise } from '../constants/dataModels/exercise.model';
import { EXERCISE_EDIT } from '../constants/screenNames';
import { exerciseImageUrlPrefix } from '../constants/serverConstant';
import { Ionicons } from '@expo/vector-icons'; 
import { useState } from 'react';

export default function ExcerciseDetails ({route, navigation}) {

  // Access the current route
  // const route = useRoute();

  // Assuming the data you want is passed as a parameter named 'exerciseData'
  const exerciseInfo = (route.params as { exerciseInfo?: Exercise })?.exerciseInfo;
  const [imageNum, setImageNum] = useState(0);

  const toggleImageNum = () => {
    setImageNum(prevNum => prevNum === 0 ? 1 : 0);
  };

  const handleEdit = (exerciseInfo: Exercise) => {
    navigation.navigate(EXERCISE_EDIT, { exerciseInfo });
    console.log(`Edit Exercise: ${exerciseInfo.id}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.subContainer}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{exerciseInfo.name}</Text>
        {/* <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>15 Minutes</Text>
          {exerciseInfo.category && <Text style={styles.detailsText}>{exerciseInfo.category}</Text>}
          <Text style={styles.detailsText}>150 Cal</Text>
        </View> */}
      </View>

      <TouchableOpacity style={styles.imageContainer} onPress={toggleImageNum}>
        {/* {exerciseInfo.image ? 
        (<Image source={{ uri: exerciseInfo.image }} style={styles.image} />):
        (<Image
          source={{ uri: 'https://via.placeholder.com/350x200' }} // Replace with your image URL
          style={styles.image}
        />)} */}
        {exerciseInfo?.images && <Image source={{ uri: `${exerciseImageUrlPrefix}/${exerciseInfo.images[imageNum]}`}} style={styles.image} />}
         {/* {exerciseInfo.image && (<Image source={{ uri: exerciseInfo.image }} style={styles.image} />)}: */}
         {/* {exerciseInfo.images && (<Image source={{ uri: `${exerciseImageUrlPrefix}/${exerciseInfo.images[0]}` }} style={styles.image} />)}: */}
      </TouchableOpacity>


      {(exerciseInfo.duration || exerciseInfo.weight || exerciseInfo.sets || exerciseInfo.repetitions) 
        && <View style={styles.section}>
        {/* <Text style={styles.sectionTitle}>Details</Text> */}
        {exerciseInfo.duration && <Text style={styles.ingredientText}>Duration: {exerciseInfo.duration} mins</Text>}
        {exerciseInfo.weight && <Text style={styles.ingredientText}>Weight: {exerciseInfo.weight} kg</Text>}
        {exerciseInfo.sets && <Text style={styles.ingredientText}>Sets: {exerciseInfo.sets}</Text>}
        {exerciseInfo.repetitions && <Text style={styles.ingredientText}>Reps: {exerciseInfo.repetitions}</Text>}
      </View>}

      {exerciseInfo.description && <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {exerciseInfo.description}
        </Text>
      </View>}
      
      {exerciseInfo.instructions && 
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {exerciseInfo.instructions.map((instruction, index) => (
          <Text key={index} style={styles.description}>
            {instruction + '\n'} 
          </Text>
        ))}
        
          <Text style={styles.description}>
            {exerciseInfo.description}
          </Text>
      </View>}

      {/* <TouchableOpacity style={styles.saveButton} onPress={()=>handleEdit(exerciseInfo)}>
        <Text style={styles.saveButtonText}>Edit Exercise</Text>
      </TouchableOpacity> */}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd20a',
  },
  subContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    backgroundColor: '#FFD20A',
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25  ,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#FFD20A',
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    color: 'white',
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
