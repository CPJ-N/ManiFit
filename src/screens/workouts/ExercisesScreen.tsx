import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getExercisesByBodyPart, getExerciseImageUrl } from '../../utils/controllers/exerciseController';
import { ROUTES } from '../../constants/navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Card } from '../../../components/ui/card';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: {
    params: {
      categoryName: string;
      categoryImage: any;
    };
  };
}

// Enhanced Exercise Card Component
const ExerciseCard = ({ 
  exercise, 
  isSelected, 
  onPress 
}: { 
  exercise: any; 
  isSelected: boolean; 
  onPress: () => void;
}) => (
  <TouchableOpacity 
    onPress={onPress} 
    activeOpacity={0.8} 
    style={[styles.exerciseCardWrapper, isSelected && styles.exerciseCardWrapperSelected]}
  >
    <Card style={[styles.exerciseCard, isSelected && styles.exerciseCardSelected]}>
      <LinearGradient
        colors={isSelected ? ['#FFD20A', '#FFA500'] : ['#2A2A2A', '#333']}
        style={styles.exerciseCardGradient}
      >
        <HStack space="md" style={styles.exerciseCardContent}>
          {/* Exercise Image */}
          <View style={[styles.exerciseImageContainer, isSelected && styles.exerciseImageContainerSelected]}>
            <Image 
              source={{ uri: getExerciseImageUrl(exercise.name) }} 
              style={styles.exerciseImage}
              defaultSource={require('../../assets/images/cardio.png')}
            />
            {isSelected && (
              <View style={styles.selectedOverlay}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
            )}
          </View>
          
          {/* Exercise Info */}
          <VStack space="xs" style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, isSelected && styles.exerciseNameSelected]}>
              {exercise.name}
            </Text>
            <HStack space="xs" style={styles.exerciseMetaRow}>
              <View style={[styles.metaTag, isSelected && styles.metaTagSelected]}>
                <Ionicons 
                  name="body" 
                  size={12} 
                  color={isSelected ? "#1E1E1E" : "#FFD20A"} 
                />
                <Text style={[styles.metaText, isSelected && styles.metaTextSelected]}>
                  {exercise.bodyPart || exercise.target}
                </Text>
              </View>
            </HStack>
            <HStack space="xs" style={styles.exerciseMetaRow}>
              <View style={[styles.metaTag, isSelected && styles.metaTagSelected]}>
                <Ionicons 
                  name="fitness" 
                  size={12} 
                  color={isSelected ? "#1E1E1E" : "#4CAF50"} 
                />
                <Text style={[styles.metaText, isSelected && styles.metaTextSelected]}>
                  {exercise.equipment?.[0] || 'Body weight'}
                </Text>
              </View>
            </HStack>
            {exercise.primaryMuscles && (
              <Text style={[styles.exerciseMuscles, isSelected && styles.exerciseMusclesSelected]}>
                Targets: {exercise.primaryMuscles.slice(0, 2).join(', ')}
              </Text>
            )}
          </VStack>
          
          {/* Selection Indicator */}
          <View style={styles.selectionIndicator}>
            {isSelected ? (
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.selectedIndicatorGradient}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </LinearGradient>
            ) : (
              <View style={styles.unselectedIndicator}>
                <Ionicons name="add" size={16} color="#666" />
              </View>
            )}
          </View>
        </HStack>
      </LinearGradient>
    </Card>
  </TouchableOpacity>
);

export default function ExercisesScreen({ navigation, route }: Props) {
  const { categoryName } = route.params;
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await getExercisesByBodyPart(categoryName);
        setExercises(data);
        setFilteredExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [categoryName]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exercise.bodyPart && exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exercise.target && exercise.target.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);

  const toggleExerciseSelection = (exercise: any) => {
    setSelectedExercises(prev => {
      const isSelected = prev.find(e => e.id === exercise.id);
      if (isSelected) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const selectAllExercises = () => {
    setSelectedExercises(filteredExercises);
  };

  const clearSelection = () => {
    setSelectedExercises([]);
  };

  const startWorkout = () => {
    if (selectedExercises.length === 0) {
      // If no exercises selected, use all exercises
      navigation.navigate(ROUTES.WORKOUT, { exercises: filteredExercises });
    } else {
      navigation.navigate(ROUTES.WORKOUT, { exercises: selectedExercises });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['rgba(255, 210, 10, 0.1)', 'transparent', 'rgba(255, 210, 10, 0.05)']}
          style={StyleSheet.absoluteFill}
        />
        <VStack space="md" style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#FFD20A" />
          <Text style={styles.loadingText}>Loading exercises...</Text>
          <Text style={styles.loadingSubtext}>Finding the best workouts for {categoryName}</Text>
        </VStack>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.08)', 'transparent', 'rgba(255, 210, 10, 0.03)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Enhanced Header */}
      <Box style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <VStack space="md">
          {/* Navigation Header */}
          <HStack style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            <VStack space="xs" style={styles.headerTitleContainer}>
              <Heading size="lg" style={styles.categoryTitle}>
                {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Exercises
              </Heading>
            </VStack>
            <View style={styles.headerSpacer} />
          </HStack>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Stats & Controls */}
          <HStack style={styles.controlsRow}>
            <VStack space="xs" style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {filteredExercises.length} exercises • {selectedExercises.length} selected
              </Text>
            </VStack>
            <HStack space="sm">
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={selectAllExercises}
              >
                <Text style={styles.controlButtonText}>Select All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={clearSelection}
              >
                <Text style={styles.controlButtonText}>Clear</Text>
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>
      </Box>

      {/* Exercises List */}
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredExercises.length > 0 ? (
          <VStack space="sm">
            {filteredExercises.map((exercise: any, index: number) => {
              const isSelected = selectedExercises.find(e => e.id === exercise.id);
              
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isSelected={!!isSelected}
                  onPress={() => toggleExerciseSelection(exercise)}
                />
              );
            })}
          </VStack>
        ) : (
          <Card style={styles.emptyStateCard}>
            <LinearGradient
              colors={['#2A2A2A', '#333']}
              style={styles.emptyStateGradient}
            >
              <VStack space="md" style={styles.emptyStateContent}>
                <Ionicons name="search" size={48} color="#666" />
                <Text style={styles.emptyStateText}>No exercises found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your search or check back later
                </Text>
              </VStack>
            </LinearGradient>
          </Card>
        )}
        
        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Enhanced Start Workout Button */}
      {filteredExercises.length > 0 && (
        <Box style={styles.bottomContainer}>
          <Card style={styles.startButtonCard}>
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={startWorkout}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD20A', '#FFA500']}
                style={styles.startButtonGradient}
              >
                <HStack space="sm" style={styles.startButtonContent}>
                  <Ionicons name="play" size={20} color="#1E1E1E" />
                  <Text style={styles.startButtonText}>
                    Start Workout
                    {selectedExercises.length > 0 && ` (${selectedExercises.length})`}
                  </Text>
                </HStack>
              </LinearGradient>
            </TouchableOpacity>
          </Card>
        </Box>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 4,
  },
  controlsRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  statsContainer: {
    flex: 1,
  },
  statsText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  controlButton: {
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD20A',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  exerciseCardWrapper: {
    marginBottom: 12,
  },
  exerciseCardWrapperSelected: {
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  exerciseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exerciseCardSelected: {
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  exerciseCardGradient: {
    padding: 16,
    borderRadius: 16,
  },
  exerciseCardContent: {
    alignItems: 'center',
  },
  exerciseImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#444',
    overflow: 'hidden',
    position: 'relative',
  },
  exerciseImageContainerSelected: {
    backgroundColor: '#FFD20A',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    lineHeight: 22,
  },
  exerciseNameSelected: {
    color: '#1E1E1E',
  },
  exerciseMetaRow: {
    flexWrap: 'wrap',
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  metaTagSelected: {
    backgroundColor: 'rgba(30, 30, 30, 0.2)',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFD20A',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  metaTextSelected: {
    color: '#1E1E1E',
  },
  exerciseMuscles: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  exerciseMusclesSelected: {
    color: '#333',
  },
  selectionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 40,
  },
  emptyStateGradient: {
    padding: 40,
    borderRadius: 16,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  startButtonCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButton: {
    borderRadius: 16,
  },
  startButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  startButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
}); 