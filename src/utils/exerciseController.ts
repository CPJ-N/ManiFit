import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { db } from '../config/firebase';  // Your Firebase initialization file
import { Exercise } from "../constants/dataModels/exercise.model";
import { EXERCISES } from "../constants/firebaseCollections";

export const addExercise = async (exercise: Exercise) => {
  try {
    const docRef = await addDoc(collection(db, EXERCISES), exercise);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateExercise = async (exerciseId: string, updatedData: Partial<Exercise>): Promise<void> => {
  try {
    const excerciseRef = doc(db, EXERCISES, exerciseId);
    await updateDoc(excerciseRef, updatedData);
    console.log("Exercise updated successfully");
  } catch (error) {
    console.error("Error updating exercise: ", error);
    throw new Error("Failed to update exercise");
  }
};

export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, EXERCISES));
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
    const docRef = doc(db, EXERCISES, exerciseId);
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
    const docRef = doc(db, `${EXERCISES}/${exerciseId}`);
    console.log(docRef);
    await deleteDoc(docRef);
    console.log("Exercise deleted successfully");
  } catch (error) {
    console.error("Error deleting exercise: ", error);
    throw new Error("Failed to delete exercise");
  }
}