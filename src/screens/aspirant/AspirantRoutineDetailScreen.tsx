import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../../store/reduxStore';
import { ROUTES } from '../../constants/navigation';
import {
  formatRoutineDate,
  formatRoutineStatus,
  getRoutineAssignedDate,
  getRoutineDifficulty,
  getRoutineDuration,
  getRoutineExerciseCount,
  getRoutineSourceLabel,
  getRoutineStatus,
  getRoutineStatusColor,
  normalizeWorkoutExercises,
} from '../../utils/routineDisplay';

type Props = {
  navigation: any;
  route: {
    params: {
      routine: any;
    };
  };
};

function ExerciseRow({ exercise, index }: { exercise: any; index: number }) {
  return (
    <View style={styles.exerciseRow}>
      <View style={styles.exerciseIndex}>
        <Text style={styles.exerciseIndexText}>{index + 1}</Text>
      </View>
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseName}>{exercise?.name || `Exercise ${index + 1}`}</Text>
        <Text style={styles.exerciseMeta}>
          {exercise?.sets || 3} sets • {exercise?.repetitions || exercise?.reps || '10-12'} reps
          {exercise?.restTime ? ` • ${exercise.restTime}s rest` : ''}
        </Text>
        {!!exercise?.specialInstructions && (
          <Text style={styles.exerciseNote}>{exercise.specialInstructions}</Text>
        )}
      </View>
    </View>
  );
}

export default function AspirantRoutineDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const routine = route.params.routine;
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const status = getRoutineStatus(routine, userInfo?.uid);
  const statusColor = getRoutineStatusColor(status);
  const exercises = normalizeWorkoutExercises(routine?.exercises || []);

  const startWorkout = () => {
    navigation.navigate(ROUTES.MAIN_TABS, {
      screen: ROUTES.WORKOUTS,
      params: {
        screen: ROUTES.WORKOUT,
        params: { exercises },
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#161616', '#1E1E1E', '#242424']} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={23} color="#FFD20A" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <View style={[styles.statusPill, { borderColor: statusColor }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{formatRoutineStatus(status)}</Text>
            </View>
          </View>
        </View>

        <LinearGradient colors={['rgba(255, 210, 10, 0.14)', 'rgba(255, 210, 10, 0.04)']} style={styles.hero}>
          <View style={styles.sourceBadge}>
            <Ionicons
              name={routine?.source === 'ai_coach' ? 'hardware-chip' : 'person'}
              size={14}
              color="#1E1E1E"
            />
            <Text style={styles.sourceText}>{getRoutineSourceLabel(routine)}</Text>
          </View>
          <Text style={styles.title}>{routine?.name || 'Untitled Routine'}</Text>
          <Text style={styles.description}>
            {routine?.description || 'A structured workout routine ready for your next session.'}
          </Text>
        </LinearGradient>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Ionicons name="barbell" size={20} color="#FFD20A" />
            <Text style={styles.statNumber}>{getRoutineExerciseCount(routine)}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={20} color="#FFD20A" />
            <Text style={styles.statNumber}>{getRoutineDuration(routine)}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="speedometer" size={20} color="#FFD20A" />
            <Text style={styles.statNumber}>{getRoutineDifficulty(routine)}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={20} color="#FFD20A" />
            <Text style={styles.statDate}>{formatRoutineDate(getRoutineAssignedDate(routine, userInfo?.uid))}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
        </View>

        {!!routine?.warmupText && (
          <View style={styles.infoPanel}>
            <View style={styles.panelHeader}>
              <Ionicons name="flame" size={18} color="#FFD20A" />
              <Text style={styles.panelTitle}>Warmup</Text>
            </View>
            <Text style={styles.panelText}>{routine.warmupText}</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercise Plan</Text>
          <Text style={styles.sectionSubtitle}>{exercises.length} movements</Text>
        </View>

        <View style={styles.exerciseList}>
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <ExerciseRow key={exercise.id ?? `${exercise.name}-${index}`} exercise={exercise} index={index} />
            ))
          ) : (
            <View style={styles.emptyExercises}>
              <Ionicons name="barbell-outline" size={30} color="#FFD20A" />
              <Text style={styles.emptyTitle}>No exercises added</Text>
              <Text style={styles.emptyText}>This routine is missing exercise details.</Text>
            </View>
          )}
        </View>

        {!!routine?.cooldownText && (
          <View style={styles.infoPanel}>
            <View style={styles.panelHeader}>
              <Ionicons name="leaf" size={18} color="#FFD20A" />
              <Text style={styles.panelTitle}>Cooldown</Text>
            </View>
            <Text style={styles.panelText}>{routine.cooldownText}</Text>
          </View>
        )}

        <View style={{ height: 112 }} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={startWorkout}
          disabled={exercises.length === 0}
          style={[styles.startButton, exercises.length === 0 && styles.startButtonDisabled]}
        >
          <LinearGradient
            colors={exercises.length === 0 ? ['#555', '#444'] : ['#FFD20A', '#FFA500']}
            style={styles.startGradient}
          >
            <Ionicons name="play" size={20} color="#1E1E1E" />
            <Text style={styles.startText}>Start Routine</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  content: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  hero: {
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.12)',
    marginBottom: 18,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFD20A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },
  sourceText: {
    color: '#1E1E1E',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  description: {
    color: '#B0B0B0',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  statCard: {
    width: '48.5%',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#272727',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  statDate: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
  },
  statLabel: {
    color: '#9F9F9F',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  infoPanel: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#262626',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.08)',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  panelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  panelText: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 21,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: '#A7A7A7',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  exerciseList: {
    gap: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#292929',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  exerciseIndex: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFD20A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseIndexText: {
    color: '#1E1E1E',
    fontSize: 14,
    fontWeight: '900',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  exerciseMeta: {
    color: '#B0B0B0',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
  exerciseNote: {
    color: '#FFD20A',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  emptyExercises: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#292929',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptyText: {
    color: '#A7A7A7',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: 'rgba(22, 22, 22, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  startButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  startButtonDisabled: {
    opacity: 0.65,
  },
  startGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  startText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },
});
