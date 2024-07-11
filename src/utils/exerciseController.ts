import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';  // Your Firebase initialization file
import { Exercise } from "../constants/dataModels/excercise.model";

export const addExercise = async (exercise: Exercise) => {
  try {
    const docRef = await addDoc(collection(db, "exercises"), exercise);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
export const addExerciseToRoutine = (routineId: string, exerciseId: string) => {
    const routineRef = doc(db, "routines", routineId);
  
    // Atomically add a new exercise to the "exercises" array field.
    updateDoc(routineRef, {
      exercises: arrayUnion(exerciseId)
    });
  };


export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "Exercise"));
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      exercises.push(doc.data() as Exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting exercises: ", error);
    throw new Error("Failed to get exercises");
  }
};

// const updateExercise = async (exerciseId: string, updatedData: Partial<Exercise>): Promise<void> => {
//   try {
//     await db.collection('exercises').doc(exerciseId).update(updatedData);
//     console.log("Exercise updated successfully");
//   } catch (error) {
//     console.error("Error updating exercise: ", error);
//     throw new Error("Failed to update exercise");
//   }
// };