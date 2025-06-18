import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar as RNStatusBar,
    Dimensions,
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

const { width } = Dimensions.get('window');
  
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
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Enhanced Header with SafeArea */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
                      <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{category}</Text>
            <Text style={styles.headerSubtitle}>Exercises</Text>
          </View>
        </View>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick & Easy Workouts</Text>
          <Text style={styles.sectionSubtitle}>
            Discover new exercises to elevate your training
          </Text>
        </View>

        {/* Exercise Grid */}
        <View style={styles.exerciseGrid}>
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <ExerciseItem 
                key={`${exercise.id}-${index}`}
                exercise={exercise}
                viewDetails={() => viewDetails(exercise)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={64} color="#FFD20A" />
              <Text style={styles.emptyStateTitle}>No Exercises Found</Text>
              <Text style={styles.emptyStateText}>
                We couldn't find any exercises for this category yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  headerSafeArea: {
    backgroundColor: '#1A1A1A',
  },
  header: {
    backgroundColor: '#1A1A1A',
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD20A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#0F0F0F',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#888',
    fontWeight: '400',
    lineHeight: 22,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    width: '100%',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});