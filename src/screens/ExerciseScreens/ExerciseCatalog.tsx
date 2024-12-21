import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { getExercisesByCategory } from '../../utils/controllers/exerciseController';
import { EXERCISE_DETAILS } from '../../constants/screenNames';
import { Exercise } from '../../constants/dataModels/exercise.model';
import ExerciseItem from '../../components/ExerciseItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
  
export default function ExerciseCatalog({route, navigation} : {route: any, navigation: any}) {
  const { category } = route.params || {};
  const [ exercises, setExercises] = useState<any[]>([]);
  const allExercises = useSelector((state: RootState) => state.workout.allExercises);

  useEffect(() => {
    const filterByCategory = () => {
      if (allExercises){
      const filteredExercises = allExercises.filter((exercise: any) => exercise.primaryMuscles.includes(category.toLowerCase()));
      console.log(filteredExercises)
      setExercises(filteredExercises);
      } else {
        setExercises([]);
      }
    }
    filterByCategory()
    console.log('Exercise Catalogue Screen', category);
  }, [category]);

  const viewDetails = (exerciseInfo: Exercise) => {
    navigation.navigate(EXERCISE_DETAILS, { exerciseInfo });
    console.log(`View Exercise Details: ${exerciseInfo.id}`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFD20A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category} Exercises</Text>
      </View>
      <ScrollView contentContainerStyle={styles.videoGrid}>
      <Text style={styles.sectionTitle}>Quick & Easy Workout Exercises</Text>
      <Text style={styles.sectionSubtitle}>Discover New Exercises: Elevate Your Training</Text>
        {exercises.map((video, index) => (
          // <TouchableOpacity key={index} style={styles.videoCard} onPress={() => viewDetails(video)}>
          //   <Image source={{ uri: `${exerciseImageUrlPrefix}/${video.images[0]}`}} style={styles.videoImage} />
            
          //   <View style={styles.videoInfo}>
          //     <Text style={styles.videoTitle}>{video.name}</Text>
          //     {/* <Text style={styles.videoTitle}>{video.title}</Text> */}
          //     {/* <View style={styles.videoMetrics}>
          //       <Ionicons name="time" size={16} color="#8A2BE2" />
          //       <Text style={styles.videoMetricText}>{video.duration}</Text>
          //       <Ionicons name="barbell" size={16} color="#8A2BE2" />
          //       <Text style={styles.videoMetricText}>{video.exercises} Exercises</Text>
          //     </View> */}
          //   </View>
          //   {/* <TouchableOpacity style={styles.playButton}>
          //     <Ionicons name="play" size={24} color="white" />
          //   </TouchableOpacity>
          //   <TouchableOpacity style={styles.favoriteButton}>
          //     <Ionicons name="star-outline" size={20} color="white" />
          //   </TouchableOpacity> */}
          // </TouchableOpacity>
          <ExerciseItem 
            key={index}
            exercise={video}
            viewDetails={() => viewDetails(video)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD20A',
    marginLeft: 16,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 16,
    marginBottom: 16,
  },
});