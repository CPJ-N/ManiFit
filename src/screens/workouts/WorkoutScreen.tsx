import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getExerciseImageSource, normalizeWorkoutExercises } from '../../utils/routineDisplay';

interface Props {
  navigation: any;
  route: {
    params: {
      exercises: any[];
    };
  };
}

export default function WorkoutScreen({ navigation, route }: Props) {
  const exercises = normalizeWorkoutExercises(route.params.exercises || []);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [workoutStartTime] = useState(new Date());
  
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const totalSets = currentExercise?.sets || 3;
  
  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isResting && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (isResting && timer === 0) {
      setIsResting(false);
    }
    
    return () => clearInterval(interval);
  }, [isResting, timer]);

  const handleCompleteSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setTimer(currentExercise?.restTime || 60);
    } else {
      // Exercise completed, move to next
      handleCompleteExercise();
    }
  };

  const handleCompleteExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(true);
      setTimer(90); // 90 second rest between exercises
    } else {
      // Workout completed
      handleCompleteWorkout();
    }
  };

  const handleCompleteWorkout = () => {
    const workoutDuration = Math.round((new Date().getTime() - workoutStartTime.getTime()) / 1000 / 60);
    
    Alert.alert(
      'Workout Complete! 🎉',
      `Great job! You completed your workout in ${workoutDuration} minutes.`,
      [
        {
          text: 'Finish',
          onPress: () => navigation.navigate('Categories'),
        },
      ]
    );
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setTimer(0);
  };

  const progress = totalExercises > 0
    ? ((currentExerciseIndex + (currentSet / totalSets)) / totalExercises) * 100
    : 0;

  if (!currentExercise) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <StatusBar style="light" />
        <Text style={styles.emptyTitle}>No exercises found</Text>
        <TouchableOpacity style={styles.completeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.completeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Exercise {currentExerciseIndex + 1} of {totalExercises} • Set {currentSet} of {totalSets}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Current Exercise */}
        <View style={styles.exerciseContainer}>
          <View style={styles.exerciseImageContainer}>
            <Image 
              source={getExerciseImageSource(currentExercise)}
              style={styles.exerciseImage}
              defaultSource={require('../../assets/images/cardio.png')}
            />
          </View>
          
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <Text style={styles.exerciseTarget}>
            Target: {currentExercise.target}
          </Text>
          <Text style={styles.exercisePrescription}>
            {totalSets} sets • {currentExercise.repetitions} reps
          </Text>
          
          {/* Exercise Instructions */}
          {currentExercise.instructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instructions:</Text>
              {currentExercise.instructions.slice(0, 3).map((instruction: string, index: number) => (
                <Text key={index} style={styles.instruction}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Rest Timer */}
        {isResting && (
          <View style={styles.restContainer}>
            <Text style={styles.restTitle}>Rest Time</Text>
            <Text style={styles.restTimer}>{timer}s</Text>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipRest}>
              <Text style={styles.skipButtonText}>Skip Rest</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Set Info */}
        {!isResting && (
          <View style={styles.setContainer}>
            <Text style={styles.setTitle}>Set {currentSet} of {totalSets}</Text>
            <Text style={styles.setInstruction}>
              Complete this set and tap "Set Complete"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomContainer}>
        {!isResting ? (
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteSet}>
            <Text style={styles.completeButtonText}>
              {currentSet < totalSets ? 'Set Complete' : 'Exercise Complete'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.restingIndicator}>
            <Text style={styles.restingText}>Resting... {timer}s remaining</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.skipExerciseButton} 
          onPress={() => {
            Alert.alert(
              'Skip Exercise',
              'Are you sure you want to skip this exercise?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Skip', onPress: handleCompleteExercise },
              ]
            );
          }}
        >
          <Text style={styles.skipExerciseButtonText}>Skip Exercise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  emptyContainer: {
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
  },
  progressContainer: {
    padding: 20,
    paddingTop: 60,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD20A',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  exerciseImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    marginBottom: 20,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  exerciseTarget: {
    fontSize: 16,
    color: '#FFD20A',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  exercisePrescription: {
    fontSize: 15,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 8,
  },
  restContainer: {
    backgroundColor: '#2A2A2A',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  restTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  restTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD20A',
    marginBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD20A',
  },
  skipButtonText: {
    color: '#FFD20A',
    fontSize: 14,
    fontWeight: '600',
  },
  setContainer: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  setTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  setInstruction: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 20,
  },
  completeButton: {
    backgroundColor: '#FFD20A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeButtonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restingIndicator: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  restingText: {
    color: '#FFD20A',
    fontSize: 16,
    fontWeight: '600',
  },
  skipExerciseButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipExerciseButtonText: {
    color: '#888',
    fontSize: 14,
  },
}); 
