import type { ImageSourcePropType } from 'react-native';

export type ExerciseCategoryMatch = {
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  category?: string[];
  bodyPart?: string[];
  target?: string[];
};

export type ExerciseCategory = {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType;
  match: ExerciseCategoryMatch;
};

export const exerciseCategories: ExerciseCategory[] = [
  {
    id: 'back',
    name: 'Back',
    description: 'Lats, traps, and lower back exercises.',
    image: require('../assets/images/back.png'),
    match: {
      primaryMuscles: ['lats', 'middle back', 'lower back', 'traps'],
      bodyPart: ['back'],
    },
  },
  {
    id: 'arms',
    name: 'Arms',
    description: 'Biceps, triceps, and forearm movements.',
    image: require('../assets/images/upperArms.png'),
    match: {
      primaryMuscles: ['biceps', 'triceps', 'forearms'],
      secondaryMuscles: ['biceps', 'triceps', 'forearms'],
      bodyPart: ['upper arms', 'lower arms', 'arms'],
    },
  },
  {
    id: 'chest',
    name: 'Chest',
    description: 'Presses, flyes, and bodyweight chest work.',
    image: require('../assets/images/chest.png'),
    match: {
      primaryMuscles: ['chest'],
      bodyPart: ['chest'],
    },
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    description: 'Delts, overhead presses, and shoulder stability.',
    image: require('../assets/images/shoulders.png'),
    match: {
      primaryMuscles: ['shoulders'],
      bodyPart: ['shoulders'],
    },
  },
  {
    id: 'legs',
    name: 'Legs',
    description: 'Quads, hamstrings, glutes, calves, and hips.',
    image: require('../assets/images/upperLegs.png'),
    match: {
      primaryMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'],
      secondaryMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'],
      bodyPart: ['upper legs', 'lower legs', 'legs'],
    },
  },
  {
    id: 'core',
    name: 'Core',
    description: 'Abs, obliques, and trunk stability exercises.',
    image: require('../assets/images/waist.png'),
    match: {
      primaryMuscles: ['abdominals'],
      secondaryMuscles: ['abdominals'],
      bodyPart: ['waist', 'core'],
      target: ['abs'],
    },
  },
  {
    id: 'cardio',
    name: 'Cardio',
    description: 'Conditioning drills and heart-rate work.',
    image: require('../assets/images/cardio.png'),
    match: {
      category: ['cardio', 'plyometrics'],
      bodyPart: ['cardio'],
      target: ['cardiovascular system'],
    },
  },
  {
    id: 'neck',
    name: 'Neck',
    description: 'Neck strength and mobility exercises.',
    image: require('../assets/images/neck.png'),
    match: {
      primaryMuscles: ['neck'],
      bodyPart: ['neck'],
    },
  },
];

export const getExerciseCategoryById = (categoryId: string): ExerciseCategory | undefined => {
  const normalizedId = categoryId.toLowerCase();
  return exerciseCategories.find(
    category =>
      category.id.toLowerCase() === normalizedId ||
      category.name.toLowerCase() === normalizedId
  );
};

export const getExerciseCategoryLabel = (categoryId: string): string =>
  getExerciseCategoryById(categoryId)?.name ?? categoryId;
