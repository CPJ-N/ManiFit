import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../../store/reduxStore';
import { ROUTES } from '../../constants/navigation';

type Props = {
  navigation: any;
};

const GOALS = ['Strength', 'Fat Loss', 'Muscle Gain', 'Mobility'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const EQUIPMENT = ['Bodyweight', 'Dumbbells', 'Barbell', 'Machines', 'Bands'];
const DAYS = [3, 4, 5, 6];

const WORKOUT_LIBRARY: Record<string, string[]> = {
  Strength: ['Goblet Squat', 'Push-Up', 'Dumbbell Row', 'Romanian Deadlift', 'Plank'],
  'Fat Loss': ['Jumping Jacks', 'Bodyweight Squat', 'Mountain Climber', 'Reverse Lunge', 'High Knees'],
  'Muscle Gain': ['Incline Press', 'Lat Pulldown', 'Leg Press', 'Shoulder Press', 'Cable Row'],
  Mobility: ['World Greatest Stretch', 'Glute Bridge', 'Dead Bug', 'Cossack Squat', 'Side Plank'],
};

function OptionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon} size={17} color="#FFD20A" />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function AiCoachScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [goal, setGoal] = useState(GOALS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [daysPerWeek, setDaysPerWeek] = useState(DAYS[0]);
  const [equipment, setEquipment] = useState<string[]>(['Bodyweight']);

  const generatedRoutine = useMemo(() => {
    const baseExercises = WORKOUT_LIBRARY[goal] ?? WORKOUT_LIBRARY.Strength;
    const exercises = baseExercises.map((name, index) => ({
      exerciseId: `ai-${goal.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      name,
      order: index + 1,
      sets: level === 'Advanced' ? 4 : 3,
      repetitions: goal === 'Mobility' ? '8-10 controlled' : level === 'Beginner' ? '10-12' : '8-12',
      restTime: goal === 'Fat Loss' ? 35 : 60,
      specialInstructions:
        index === 0
          ? 'Start controlled and keep two reps in reserve.'
          : 'Keep form clean before adding intensity.',
    }));

    return {
      id: `ai-preview-${Date.now()}`,
      name: `${goal} Foundation`,
      description: `${daysPerWeek}-day ${level.toLowerCase()} plan generated for ${userInfo?.fullName?.split(' ')[0] || 'you'}.`,
      exercises,
      createdBy: userInfo?.uid || 'ai-coach',
      source: 'ai_coach',
      assigneeIds: userInfo?.uid ? [userInfo.uid] : [],
      assignees: userInfo?.uid
        ? [
            {
              traineeId: userInfo.uid,
              date: new Date().toISOString(),
              status: 'planned',
              assignedAt: new Date().toISOString(),
            },
          ]
        : [],
      muscleGroup: goal === 'Mobility' ? 'Full Body Mobility' : 'Full Body',
      warmupText: '5 minutes of easy movement, joint circles, and light ramp-up sets.',
      cooldownText: 'Walk slowly for 2 minutes, then stretch the trained areas.',
      difficulty: level.toLowerCase(),
      estimatedDuration: daysPerWeek >= 5 ? 35 : 45,
      isTemplate: false,
      aiMetadata: {
        goal,
        level,
        equipment,
        daysPerWeek,
        generatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [daysPerWeek, equipment, goal, level, userInfo?.fullName, userInfo?.uid]);

  const toggleEquipment = (item: string) => {
    setEquipment(prev => {
      if (prev.includes(item)) {
        const next = prev.filter(value => value !== item);
        return next.length ? next : ['Bodyweight'];
      }
      return [...prev, item];
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
        </View>

        <LinearGradient colors={['rgba(0, 188, 212, 0.18)', 'rgba(255, 210, 10, 0.06)']} style={styles.hero}>
          <View style={styles.aiBadge}>
            <Ionicons name="hardware-chip" size={14} color="#1E1E1E" />
            <Text style={styles.aiBadgeText}>AI Coach</Text>
          </View>
          <Text style={styles.title}>Generate Your Next Routine</Text>
          <Text style={styles.subtitle}>
            Choose the basics and preview a plan. Backend saving will plug into this same routine flow.
          </Text>
        </LinearGradient>

        <Section icon="flag" title="Goal">
          <View style={styles.chipGrid}>
            {GOALS.map(item => (
              <OptionChip key={item} label={item} selected={goal === item} onPress={() => setGoal(item)} />
            ))}
          </View>
        </Section>

        <Section icon="speedometer" title="Training Level">
          <View style={styles.chipGrid}>
            {LEVELS.map(item => (
              <OptionChip key={item} label={item} selected={level === item} onPress={() => setLevel(item)} />
            ))}
          </View>
        </Section>

        <Section icon="calendar" title="Days Per Week">
          <View style={styles.chipGrid}>
            {DAYS.map(item => (
              <OptionChip
                key={item}
                label={`${item} days`}
                selected={daysPerWeek === item}
                onPress={() => setDaysPerWeek(item)}
              />
            ))}
          </View>
        </Section>

        <Section icon="barbell" title="Equipment">
          <View style={styles.chipGrid}>
            {EQUIPMENT.map(item => (
              <OptionChip
                key={item}
                label={item}
                selected={equipment.includes(item)}
                onPress={() => toggleEquipment(item)}
              />
            ))}
          </View>
        </Section>

        <LinearGradient colors={['#2A2A2A', '#202020']} style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.previewEyebrow}>Preview</Text>
              <Text style={styles.previewTitle}>{generatedRoutine.name}</Text>
            </View>
            <View style={styles.durationPill}>
              <Ionicons name="time" size={14} color="#FFD20A" />
              <Text style={styles.durationText}>{generatedRoutine.estimatedDuration} min</Text>
            </View>
          </View>

          <Text style={styles.previewDescription}>{generatedRoutine.description}</Text>

          <View style={styles.exercisePreviewList}>
            {generatedRoutine.exercises.slice(0, 4).map((exercise, index) => (
              <View key={exercise.exerciseId} style={styles.exercisePreviewRow}>
                <Text style={styles.exercisePreviewIndex}>{index + 1}</Text>
                <Text style={styles.exercisePreviewName}>{exercise.name}</Text>
                <Text style={styles.exercisePreviewSets}>{exercise.sets}x</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            style={styles.generateButton}
            onPress={() => navigation.navigate(ROUTES.ASPIRANT_ROUTINE_DETAIL, { routine: generatedRoutine })}
          >
            <LinearGradient colors={['#FFD20A', '#FFA500']} style={styles.generateGradient}>
              <Ionicons name="sparkles" size={18} color="#1E1E1E" />
              <Text style={styles.generateText}>Review Routine</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 60 }} />
      </ScrollView>
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
    marginBottom: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.1)',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFD20A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },
  aiBadgeText: {
    color: '#1E1E1E',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  section: {
    borderRadius: 18,
    backgroundColor: '#242424',
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#303030',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipSelected: {
    backgroundColor: '#FFD20A',
    borderColor: '#FFD20A',
  },
  chipText: {
    color: '#D8D8D8',
    fontSize: 13,
    fontWeight: '800',
  },
  chipTextSelected: {
    color: '#1E1E1E',
  },
  previewCard: {
    borderRadius: 22,
    padding: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.1)',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  previewEyebrow: {
    color: '#FFD20A',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  durationText: {
    color: '#FFD20A',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 5,
  },
  previewDescription: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 20,
  },
  exercisePreviewList: {
    marginTop: 16,
    gap: 9,
  },
  exercisePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  exercisePreviewIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD20A',
    color: '#1E1E1E',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '900',
    marginRight: 10,
  },
  exercisePreviewName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  exercisePreviewSets: {
    color: '#FFD20A',
    fontSize: 13,
    fontWeight: '900',
  },
  generateButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 18,
  },
  generateGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  generateText: {
    color: '#1E1E1E',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },
});
