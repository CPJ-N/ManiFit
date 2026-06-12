import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, deleteDoc, getDoc, query, where } from "firebase/firestore";
import Constants from "expo-constants";
import { Exercise } from "../../constants/dataModels/exercise.model";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

const GITHUB_EXERCISE_IMAGE_PREFIX =
  Constants.expoConfig?.extra?.githubExerciseImageUrlPrefix ||
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

export const addExercise = async (exercise: Exercise) => {
  try {
    const docRef = await addDoc(collection(db, firebaseCollection.exercises), exercise);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateExercise = async (exerciseId: string, updatedData: Partial<Exercise>): Promise<void> => {
  try {
    const excerciseRef = doc(db, firebaseCollection.exercises, exerciseId);
    await updateDoc(excerciseRef, updatedData);
    console.log("Exercise updated successfully");
  } catch (error) {
    console.error("Error updating exercise: ", error);
    throw new Error("Failed to update exercise");
  }
};

export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, firebaseCollection.exercises));
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      // Include the document ID in the object
      const exercise = {
        ...doc.data(),
        id: doc.id,
      } as Exercise;
      exercises.push(exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting exercises: ", error);
    throw new Error("Failed to get exercises");
  }
};

export const getExercise = async (exerciseId: string): Promise<Exercise> => {
  try {
    const docRef = doc(db, firebaseCollection.exercises, exerciseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const exercise = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Exercise;
      return exercise;
    } else {
      throw new Error("No such document");
    }
  } catch (error) {
    console.error("Error getting exercise: ", error);
    throw new Error("Failed to get exercise");
  }
};



export const deleteExercise = async (exerciseId: string) => {
  try {
    console.log("Deleting exercise...", exerciseId);
    const docRef = doc(db, `${firebaseCollection.exercises}/${exerciseId}`);
    console.log("Exercise DocRef: ", docRef);
    await deleteDoc(docRef);
    console.log("Exercise deleted successfully");
  } catch (error) {
    console.error("Error deleting exercise: ", error);
    throw new Error("Failed to delete exercise");
  }
}


export const getExercisesByCategory = async (category: string): Promise<Exercise[]> => {
  try {
    const q = query(collection(db, firebaseCollection.exercises), where("primaryMuscles", "array-contains", category));
    const querySnapshot = await getDocs(q);
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      exercises.push({ ...doc.data(), id: doc.id } as Exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw new Error("Failed to get exercises by category");
  }
};


//get all exercise using exercisesUrl
export const getAllExercisesFromUrl = async (): Promise<Exercise[]> => {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };
    
    const response = await fetch(
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json", requestOptions);
   
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting exercises: ", error);
    throw new Error("Failed to get exercises");
  }
};

// Get exercises filtered by a category tile. The tile name comes from the
// dataset's own vocabulary and may refer to EITHER a primaryMuscles value
// (e.g. "calves", "quadriceps") OR a `category` value (e.g. "cardio",
// "stretching"). Matching both lets every tile resolve and supports future
// custom tiles using either vocabulary.
export const getExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const allExercises = await getAllExercisesFromUrl();
    const term = bodyPart.toLowerCase();
    const filteredExercises = allExercises.filter((exercise: any) =>
      exercise.category?.toLowerCase() === term ||
      exercise.bodyPart?.toLowerCase() === term ||
      exercise.primaryMuscles?.some((muscle: string) =>
        muscle.toLowerCase().includes(term)
      )
    );
    return filteredExercises;
  } catch (error) {
    console.error("Error filtering exercises by body part: ", error);
    throw new Error("Failed to get exercises by body part");
  }
};

// Get exercise image URL with GitHub prefix
// Build an exercise image URL from the dataset's own `images` paths
// (e.g. "3_4_Sit-Up/0.jpg"). The folder is named after the exercise id with
// original casing/underscores — NOT a slug of the name — so we must use the
// path the dataset already provides. Returns undefined when no image exists.
export const getExerciseImageUrl = (exercise: { images?: string[]; [key: string]: unknown } | null | undefined): string | undefined => {
  const imagePath = exercise?.images?.[0];
  if (!imagePath) return undefined;
  return `${GITHUB_EXERCISE_IMAGE_PREFIX}/${imagePath}`;
};