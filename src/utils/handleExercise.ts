import { collection, addDoc } from "firebase/firestore";
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
