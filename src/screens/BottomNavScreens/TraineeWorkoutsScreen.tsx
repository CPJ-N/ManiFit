import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { auth } from '../../config/firebase';
import { getRoutinesByTrainee } from '../../utils/controllers/routineController';
import { Routine, Assignee } from '../../constants/dataModels/routine.model';
import { EXERCISE_LIST } from '../../constants/screenNames';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

interface TraineeWorkout extends Routine {
  assigneeInfo?: Assignee;
}

export default function TraineeWorkoutsScreen({ navigation }: { navigation: any }) {
  const [assignedWorkouts, setAssignedWorkouts] = useState<TraineeWorkout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<TraineeWorkout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  
  const currentUserId = auth.currentUser?.uid;

  const fetchWorkouts = async () => {
    try {
      if (!currentUserId) return;
      
      const routines = await getRoutinesByTrainee(currentUserId);
      
      const assigned: TraineeWorkout[] = [];
      const completed: TraineeWorkout[] = [];
      
      routines.forEach((routine: Routine) => {
        if (routine.assignees) {
          routine.assignees.forEach((assignee: Assignee) => {
            if (assignee.traineeId === currentUserId) {
              const workoutWithAssignee = {
                ...routine,
                assigneeInfo: assignee
              };
              
              if (assignee.status === 'planned') {
                assigned.push(workoutWithAssignee);
              } else if (assignee.status === 'completed') {
                completed.push(workoutWithAssignee);
              }
            }
          });
        }
      });
      
      // Sort assigned by date (upcoming first)
      assigned.sort((a, b) => new Date(a.assigneeInfo!.date).getTime() - new Date(b.assigneeInfo!.date).getTime());
      
      // Sort completed by date (most recent first)
      completed.sort((a, b) => new Date(b.assigneeInfo!.date).getTime() - new Date(a.assigneeInfo!.date).getTime());
      
      setAssignedWorkouts(assigned);
      setCompletedWorkouts(completed);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [currentUserId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const handleWorkoutPress = (workout: TraineeWorkout) => {
    navigation.navigate(EXERCISE_LIST, { routine: workout });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const WorkoutCard = ({ workout, isCompleted = false }: { workout: TraineeWorkout, isCompleted?: boolean }) => (
    <TouchableOpacity onPress={() => handleWorkoutPress(workout)} activeOpacity={0.8}>
      <Card className="mx-4 mb-3" style={{ backgroundColor: '#2A2A2A', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Box className="p-4">
          <HStack className="justify-between items-start mb-3">
            <VStack className="flex-1 mr-3">
              <Heading size="md" style={{ color: '#FFFFFF', marginBottom: 4 }}>
                {workout.name}
              </Heading>
              <Text size="sm" style={{ color: '#B0B0B0', lineHeight: 18 }}>
                {workout.description}
              </Text>
            </VStack>
            <Box style={{ 
              backgroundColor: isCompleted ? '#4CAF50' : '#FFD20A', 
              paddingHorizontal: 8, 
              paddingVertical: 4, 
              borderRadius: 6 
            }}>
              <Text size="xs" style={{ 
                color: isCompleted ? '#FFFFFF' : '#1E1E1E', 
                fontWeight: '600' 
              }}>
                {isCompleted ? 'Completed' : formatDate(workout.assigneeInfo!.date)}
              </Text>
            </Box>
          </HStack>
          
          <HStack className="items-center justify-between">
            <HStack className="items-center">
              <Ionicons name="time-outline" size={16} color="#B0B0B0" />
              <Text size="xs" style={{ color: '#B0B0B0', marginLeft: 4 }}>
                ~{workout.estimatedDuration || 30} min
              </Text>
              <Ionicons name="fitness-outline" size={16} color="#B0B0B0" style={{ marginLeft: 12 }} />
              <Text size="xs" style={{ color: '#B0B0B0', marginLeft: 4 }}>
                {workout.exercises?.length || 0} exercises
              </Text>
            </HStack>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="#FFD20A" 
            />
          </HStack>
        </Box>
      </Card>
    </TouchableOpacity>
  );

  const EmptyState = ({ title, subtitle, iconName }: { title: string, subtitle: string, iconName: any }) => (
    <Box className="mx-4 mb-4">
      <Card style={{ backgroundColor: '#2A2A2A', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
        <Box className="p-6 items-center">
          <Ionicons name={iconName as any} size={48} color="#666" />
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 12, textAlign: 'center' }}>
            {title}
          </Text>
          <Text size="sm" style={{ color: '#B0B0B0', marginTop: 4, textAlign: 'center' }}>
            {subtitle}
          </Text>
        </Box>
      </Card>
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      {/* Header */}
      <Box className="px-4 py-4" style={{ paddingTop: insets.top + 16 }}>
        <Heading size="xl" className="font-bold" style={{ color: 'white' }}>
          My Workouts
        </Heading>
        <Text size="sm" style={{ color: '#B0B0B0', marginTop: 4 }}>
          Track your fitness journey
        </Text>
      </Box>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD20A" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Assigned Workouts Section */}
        <Box className="mt-2">
          <Box className="px-4 mb-3">
            <HStack className="items-center">
              <Ionicons name="calendar-outline" size={20} color="#FFD20A" />
              <Heading size="lg" className="font-bold ml-2" style={{ color: 'white' }}>
                Assigned Workouts
              </Heading>
              {assignedWorkouts.length > 0 && (
                <Box style={{ 
                  backgroundColor: '#FFD20A', 
                  borderRadius: 10, 
                  paddingHorizontal: 8, 
                  paddingVertical: 2, 
                  marginLeft: 8 
                }}>
                  <Text size="xs" style={{ color: '#1E1E1E', fontWeight: '600' }}>
                    {assignedWorkouts.length}
                  </Text>
                </Box>
              )}
            </HStack>
          </Box>
          
          {assignedWorkouts.length === 0 ? (
            <EmptyState 
              title="No assigned workouts"
              subtitle="Your trainer will assign workouts for you"
              iconName="calendar-outline"
            />
          ) : (
            assignedWorkouts.map((workout, index) => (
              <WorkoutCard key={`assigned-${workout.id}-${index}`} workout={workout} />
            ))
          )}
        </Box>

        {/* Completed Workouts Section */}
        <Box className="mt-6">
          <Box className="px-4 mb-3">
            <HStack className="items-center">
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Heading size="lg" className="font-bold ml-2" style={{ color: 'white' }}>
                History
              </Heading>
              {completedWorkouts.length > 0 && (
                <Box style={{ 
                  backgroundColor: '#4CAF50', 
                  borderRadius: 10, 
                  paddingHorizontal: 8, 
                  paddingVertical: 2, 
                  marginLeft: 8 
                }}>
                  <Text size="xs" style={{ color: 'white', fontWeight: '600' }}>
                    {completedWorkouts.length}
                  </Text>
                </Box>
              )}
            </HStack>
          </Box>
          
          {completedWorkouts.length === 0 ? (
            <EmptyState 
              title="No completed workouts yet"
              subtitle="Complete your first workout to see your progress"
              iconName="trophy-outline"
            />
          ) : (
            completedWorkouts.map((workout, index) => (
              <WorkoutCard key={`completed-${workout.id}-${index}`} workout={workout} isCompleted={true} />
            ))
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
} 