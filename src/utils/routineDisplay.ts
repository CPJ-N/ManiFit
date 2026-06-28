import { getExerciseImageUrl } from './controllers/exerciseController';

export const fallbackExerciseImage = require('../assets/images/cardio.png');

export const getRoutineExerciseCount = (routine: any): number =>
  Array.isArray(routine?.exercises) ? routine.exercises.length : 0;

export const getRoutineDuration = (routine: any): number =>
  Number(routine?.estimatedDuration) || Math.max(getRoutineExerciseCount(routine) * 6, 20);

export const getRoutineDifficulty = (routine: any): string =>
  routine?.difficulty ? String(routine.difficulty) : 'beginner';

export const getRoutineSourceLabel = (routine: any): string => {
  switch (routine?.source) {
    case 'ai_coach':
      return 'AI Coach';
    case 'human_coach':
      return 'Coach';
    case 'self':
      return 'Self';
    default:
      return routine?.createdBy ? 'Coach' : 'ManiFit';
  }
};

export const getRoutineAssignment = (routine: any, userId?: string) => {
  const assignees = Array.isArray(routine?.assignees) ? routine.assignees : [];
  if (!userId) return assignees[0];
  return assignees.find((assignee: any) => assignee?.traineeId === userId) ?? assignees[0];
};

export const getRoutineStatus = (routine: any, userId?: string): string =>
  getRoutineAssignment(routine, userId)?.status ?? 'planned';

export const getRoutineAssignedDate = (routine: any, userId?: string): string | undefined =>
  getRoutineAssignment(routine, userId)?.date ?? routine?.createdAt;

export const formatRoutineDate = (date?: string): string => {
  if (!date) return 'No date set';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatRoutineStatus = (status?: string): string => {
  if (!status) return 'Planned';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getRoutineStatusColor = (status?: string): string => {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'missed':
      return '#FF6B6B';
    default:
      return '#FFD20A';
  }
};

const normalizeInstructions = (instructions: unknown): string[] => {
  if (Array.isArray(instructions)) {
    return instructions.map(String);
  }

  if (typeof instructions === 'string' && instructions.trim()) {
    return instructions
      .split(/\n+|(?<=\.)\s+/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const getExerciseImageSource = (exercise: any) => {
  const imageUrl = exercise?.gifUrl || exercise?.image || getExerciseImageUrl(exercise);
  return imageUrl ? { uri: imageUrl } : fallbackExerciseImage;
};

export const normalizeWorkoutExercise = (exercise: any, index = 0) => {
  const primaryMuscles = Array.isArray(exercise?.primaryMuscles)
    ? exercise.primaryMuscles
    : exercise?.target
      ? [exercise.target]
      : [];

  return {
    ...exercise,
    id: exercise?.id ?? exercise?.exerciseId ?? `routine-exercise-${index}`,
    name: exercise?.name ?? `Exercise ${index + 1}`,
    target: exercise?.target ?? primaryMuscles[0] ?? exercise?.muscleGroup ?? 'full body',
    primaryMuscles,
    instructions: normalizeInstructions(exercise?.instructions ?? exercise?.specialInstructions),
    sets: Number(exercise?.sets) || 3,
    repetitions: exercise?.repetitions ?? exercise?.reps ?? '10-12',
    restTime: Number(exercise?.restTime) || 60,
  };
};

export const normalizeWorkoutExercises = (exercises: any[] = []) =>
  exercises.map((exercise, index) => normalizeWorkoutExercise(exercise, index));
