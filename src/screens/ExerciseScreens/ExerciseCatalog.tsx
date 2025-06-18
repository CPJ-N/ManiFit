import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getExercisesByCategory } from '../../utils/controllers/exerciseController';
import { EXERCISE_DETAILS } from '../../constants/screenNames';
import { Exercise } from '../../constants/dataModels/exercise.model';
import ExerciseItem from '../../components/ExerciseItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

const { width } = Dimensions.get('window');

// Enhanced Section Header Component
const SectionHeader = ({ 
  title, 
  subtitle, 
  icon = 'fitness' 
}: { 
  title: string; 
  subtitle: string; 
  icon?: string;
}) => (
  <Box className="px-6 py-4">
    <HStack className="items-center mb-3">
      <LinearGradient
        colors={['#FFD20A', '#FFA500']}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon as any} size={18} color="#1E1E1E" />
      </LinearGradient>
      <VStack className="flex-1">
        <Heading size="lg" className="font-bold" style={{ color: '#FFFFFF', fontSize: 20 }}>
          {title}
        </Heading>
        <Text style={{ color: '#B0B0B0', fontSize: 14, marginTop: 2 }}>
          {subtitle}
        </Text>
      </VStack>
    </HStack>
  </Box>
);

// Enhanced Empty State Component
const EmptyState = () => (
  <Box className="items-center justify-center py-16 px-8">
    <LinearGradient
      colors={['rgba(255, 210, 10, 0.1)', 'transparent']}
      style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      }}
    >
      <Ionicons name="barbell-outline" size={48} color="#FFD20A" />
    </LinearGradient>
    
    <Heading size="md" className="font-bold text-center mb-3" style={{ color: '#FFFFFF' }}>
      No Exercises Found
    </Heading>
    <Text 
      className="text-center" 
      style={{ 
        color: '#B0B0B0', 
        fontSize: 15,
        lineHeight: 22,
        maxWidth: 280,
      }}
    >
      We couldn't find any exercises for this category yet. Check back soon for new additions!
    </Text>
  </Box>
);

export default function ExerciseCatalog({ route, navigation }: { route: any; navigation: any }) {
  const { category } = route.params || {};
  const [exercises, setExercises] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const allExercises = useSelector((state: RootState) => state.workout.allExercises);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const filterByCategory = () => {
      if (allExercises && Array.isArray(allExercises)) {
        const filteredExercises = allExercises.filter((exercise: any) => 
          exercise.primaryMuscles && 
          Array.isArray(exercise.primaryMuscles) &&
          exercise.primaryMuscles.some((muscle: string) => 
            muscle.toLowerCase().includes(category.toLowerCase())
          )
        );
        console.log('Filtered exercises:', filteredExercises);
        setExercises(filteredExercises);
      } else {
        setExercises([]);
      }
    };
    filterByCategory();
  }, [category, allExercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Add refresh logic here if needed
      console.log('Refreshing exercises...');
    } catch (error) {
      console.error('Error refreshing exercises:', error);
    }
    setRefreshing(false);
  };

  const viewDetails = (exerciseInfo: Exercise) => {
    navigation.navigate(EXERCISE_DETAILS, { exerciseInfo });
    console.log(`View Exercise Details: ${exerciseInfo.id}`);
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Enhanced Header Section with Gradient Background */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.04)', 'transparent']}
        style={{ 
          paddingTop: insets.top + 10,
          paddingBottom: 10,
        }}
      >
        <Box className="px-6 py-4">
          <HStack className="items-center">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: 'rgba(255, 210, 10, 0.15)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
                shadowColor: '#FFD20A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            
            <VStack className="flex-1">
              <Heading 
                size="xl" 
                className="font-bold" 
                style={{ 
                  color: '#FFD20A', 
                  fontSize: 26,
                  letterSpacing: -0.5,
                  marginBottom: 2,
                }}
              >
                {category}
              </Heading>
              <Text style={{ color: '#B0B0B0', fontSize: 15, fontWeight: '500' }}>
                Exercise Collection
              </Text>
            </VStack>

            {/* Exercise Count Badge */}
            {exercises.length > 0 && (
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginLeft: 12,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                  {exercises.length} {exercises.length === 1 ? 'Exercise' : 'Exercises'}
                </Text>
              </LinearGradient>
            )}
          </HStack>
        </Box>
      </LinearGradient>

      <ScrollView 
        style={{ backgroundColor: '#1E1E1E' }}
        contentContainerStyle={{ 
          backgroundColor: '#1E1E1E',
          flexGrow: 1,
          paddingBottom: insets.bottom + 20,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD20A" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Section Header */}
        <SectionHeader
          title="Training Library"
          subtitle="Discover exercises to elevate your workout"
          icon="library"
        />

        {/* Exercise Content */}
        {exercises.length > 0 ? (
          <Box className="px-4">
            <VStack space="md" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {exercises.map((exercise, index) => (
                <ExerciseItem 
                  key={`${exercise.id}-${index}`}
                  exercise={exercise}
                  viewDetails={() => viewDetails(exercise)}
                />
              ))}
            </VStack>
          </Box>
        ) : (
          <EmptyState />
        )}

        {/* Additional Info Section */}
        {exercises.length > 0 && (
          <Box className="px-6 py-6 mt-4">
            <LinearGradient
              colors={['rgba(255, 210, 10, 0.05)', 'transparent']}
              style={{
                borderRadius: 20,
                padding: 20,
                alignItems: 'center',
              }}
            >
              <Ionicons name="information-circle" size={24} color="#FFD20A" style={{ marginBottom: 12 }} />
              <Heading size="sm" className="font-bold text-center mb-2" style={{ color: '#FFFFFF' }}>
                Pro Tip
              </Heading>
              <Text 
                style={{ 
                  textAlign: 'center', 
                  color: '#B0B0B0', 
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                Focus on proper form over speed. Quality repetitions lead to better results and injury prevention.
              </Text>
            </LinearGradient>
          </Box>
        )}
      </ScrollView>
    </View>
  );
}