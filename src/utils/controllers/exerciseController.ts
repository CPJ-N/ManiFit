import Constants from 'expo-constants';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Exercise } from '../../constants/dataModels/exercise.model';
import { firebaseCollection } from '../../constants/firebaseContant';
import {
  ExerciseCategoryMatch,
  getExerciseCategoryById,
} from '../../constants/exerciseCatalog';
import { fallbackExercises } from '../../constants/fallbackExercises';

const DEFAULT_GITHUB_EXERCISES_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

const DEFAULT_GITHUB_EXERCISE_IMAGE_PREFIX =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

const GITHUB_EXERCISES_URL =
  Constants.expoConfig?.extra?.githubExercisesUrl || DEFAULT_GITHUB_EXERCISES_URL;

const GITHUB_EXERCISE_IMAGE_PREFIX =
  Constants.expoConfig?.extra?.githubExerciseImageUrlPrefix ||
  DEFAULT_GITHUB_EXERCISE_IMAGE_PREFIX;

type PublicExercise = Omit<Exercise, 'equipment' | 'instructions'> & {
  bodyPart?: string;
  target?: string;
  force?: string | null;
  mechanic?: string | null;
  equipment?: string[] | string;
  instructions?: string[] | string;
};

const getDb = async () => {
  const { db } = require('../../config/firebase');
  return db;
};

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
};

export const normalizeExerciseInstructions = (instructions: unknown): string[] => {
  if (Array.isArray(instructions)) {
    return instructions.map(String).filter(Boolean);
  }

  if (typeof instructions === 'string' && instructions.trim()) {
    return instructions
      .split(/\n+|(?<=\.)\s+/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeExercise = (exercise: Record<string, unknown>, index: number): PublicExercise => ({
  ...exercise,
  id: exercise.id ? String(exercise.id) : `github-exercise-${index}`,
  name: exercise.name ? String(exercise.name) : `Exercise ${index + 1}`,
  primaryMuscles: normalizeStringArray(exercise.primaryMuscles),
  secondaryMuscles: normalizeStringArray(exercise.secondaryMuscles),
  equipment: normalizeStringArray(exercise.equipment),
  instructions: normalizeExerciseInstructions(exercise.instructions),
  source: (exercise.source as Exercise['source']) ?? 'github',
  difficulty:
    (exercise.difficulty as Exercise['difficulty']) ??
    (exercise.level === 'expert' ? 'advanced' : exercise.level) ??
    'beginner',
});

const normalizeExercises = (exercises: unknown[]): PublicExercise[] =>
  exercises.map((exercise, index) =>
    normalizeExercise((exercise ?? {}) as Record<string, unknown>, index)
  );

const fieldMatchesTerms = (value: unknown, terms: string[] = []): boolean => {
  const values = normalizeStringArray(value).map(item => item.toLowerCase());
  const normalizedTerms = terms.map(term => term.toLowerCase());

  return values.some(valueItem =>
    normalizedTerms.some(term => valueItem === term || valueItem.includes(term))
  );
};

const exerciseMatchesCategory = (
  exercise: PublicExercise,
  match: ExerciseCategoryMatch
): boolean =>
  fieldMatchesTerms(exercise.primaryMuscles, match.primaryMuscles) ||
  fieldMatchesTerms(exercise.secondaryMuscles, match.secondaryMuscles) ||
  fieldMatchesTerms(exercise.category, match.category) ||
  fieldMatchesTerms(exercise.bodyPart, match.bodyPart) ||
  fieldMatchesTerms(exercise.target, match.target);

const exerciseMatchesSearchTerm = (exercise: PublicExercise, term: string): boolean => {
  const matchTerm = term.toLowerCase();
  return [
    exercise.name,
    exercise.category,
    exercise.bodyPart,
    exercise.target,
    exercise.level,
    exercise.difficulty,
    exercise.primaryMuscles,
    exercise.secondaryMuscles,
    exercise.equipment,
  ].some(value => fieldMatchesTerms(value, [matchTerm]));
};

const sortByName = (exercises: PublicExercise[]): PublicExercise[] =>
  [...exercises].sort((a, b) => a.name.localeCompare(b.name));

export const addExercise = async (exercise: Exercise) => {
  try {
    const db = await getDb();
    const docRef = await addDoc(collection(db, firebaseCollection.exercises), exercise);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateExercise = async (
  exerciseId: string,
  updatedData: Partial<Exercise>
): Promise<void> => {
  try {
    const db = await getDb();
    const exerciseRef = doc(db, firebaseCollection.exercises, exerciseId);
    await updateDoc(exerciseRef, updatedData);
    console.log('Exercise updated successfully');
  } catch (error) {
    console.error('Error updating exercise: ', error);
    throw new Error('Failed to update exercise');
  }
};

export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const db = await getDb();
    const querySnapshot = await getDocs(collection(db, firebaseCollection.exercises));
    const exercises: Exercise[] = [];
    querySnapshot.forEach((docSnapshot: any) => {
      exercises.push({
        ...docSnapshot.data(),
        id: docSnapshot.id,
      } as Exercise);
    });
    return exercises;
  } catch (error) {
    console.error('Error getting exercises: ', error);
    throw new Error('Failed to get exercises');
  }
};

export const getExercise = async (exerciseId: string): Promise<Exercise> => {
  try {
    const db = await getDb();
    const docRef = doc(db, firebaseCollection.exercises, exerciseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Exercise;
    }

    throw new Error('No such document');
  } catch (error) {
    console.error('Error getting exercise: ', error);
    throw new Error('Failed to get exercise');
  }
};

export const deleteExercise = async (exerciseId: string) => {
  try {
    const db = await getDb();
    const docRef = doc(db, `${firebaseCollection.exercises}/${exerciseId}`);
    await deleteDoc(docRef);
    console.log('Exercise deleted successfully');
  } catch (error) {
    console.error('Error deleting exercise: ', error);
    throw new Error('Failed to delete exercise');
  }
};

export const getExercisesByCategory = async (category: string): Promise<Exercise[]> => {
  try {
    const db = await getDb();
    const exercisesQuery = query(
      collection(db, firebaseCollection.exercises),
      where('primaryMuscles', 'array-contains', category)
    );
    const querySnapshot = await getDocs(exercisesQuery);
    const exercises: Exercise[] = [];
    querySnapshot.forEach((docSnapshot: any) => {
      exercises.push({ ...docSnapshot.data(), id: docSnapshot.id } as Exercise);
    });
    return exercises;
  } catch (error) {
    console.error('Error getting documents:', error);
    const detail = error instanceof Error ? `: ${error.message}` : `: ${String(error)}`;
    throw new Error(`Failed to get exercises by category${detail}`);
  }
};

export const getAllExercisesFromUrl = async (): Promise<Exercise[]> => {
  try {
    const response = await fetch(GITHUB_EXERCISES_URL, {
      method: 'GET',
      redirect: 'follow',
    });

    if ('ok' in response && !response.ok) {
      throw new Error(`GitHub exercise request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('GitHub exercise response was not an array');
    }

    return normalizeExercises(data) as Exercise[];
  } catch (error) {
    console.warn(
      'Unable to load GitHub exercise dataset. Using bundled fallback exercises.',
      error
    );
    return normalizeExercises(fallbackExercises) as Exercise[];
  }
};

export const getExercisesByCategoryId = async (categoryId: string): Promise<Exercise[]> => {
  const category = getExerciseCategoryById(categoryId);

  if (!category) {
    return getExercisesByBodyPart(categoryId);
  }

  const allExercises = (await getAllExercisesFromUrl()) as PublicExercise[];
  return sortByName(
    allExercises.filter(exercise => exerciseMatchesCategory(exercise, category.match))
  ) as Exercise[];
};

export const getExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  const allExercises = (await getAllExercisesFromUrl()) as PublicExercise[];
  const term = bodyPart.toLowerCase();

  return sortByName(
    allExercises.filter(exercise => exerciseMatchesSearchTerm(exercise, term))
  ) as Exercise[];
};

export const getExerciseImageUrl = (
  exercise: { images?: string[]; [key: string]: unknown } | null | undefined
): string | undefined => {
  const imagePath = exercise?.images?.[0];
  if (!imagePath) return undefined;
  return `${GITHUB_EXERCISE_IMAGE_PREFIX}/${imagePath}`;
};
