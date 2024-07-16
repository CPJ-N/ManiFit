import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { db } from '../config/firebase';  // Your Firebase initialization file
import { ROUTINES } from "../constants/firebaseCollections";

export const addRoutine = async (routine: any) => {
    try {
      const docRef = await addDoc(collection(db, ROUTINES), routine);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
};

export const getRoutine = async (routineId: string) => {
    try {
      const docRef = doc(db, ROUTINES, routineId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("No such document");
      }
    } catch (error) {
      console.error("Error getting routine: ", error);
      throw new Error("Failed to get routine");
    }
  };

export const getAllRoutines = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, ROUTINES));
      const routines: any[] = [];
      querySnapshot.forEach((doc) => {
        routines.push({ id: doc.id, ...doc.data() });
      });
      return routines;
    } catch (error) {
      console.error("Error getting routines: ", error);
      throw new Error("Failed to get routines");
    }
};

export const addExerciseToRoutine = (routineId: string, exerciseId: string) => {
    const routineRef = doc(db, ROUTINES, routineId);
  
    // Atomically add a new exercise to the "exercises" array field.
    updateDoc(routineRef, {
      exercises: arrayUnion(exerciseId)
    });
  };

export const deleteRoutine = async (routineId: string) => {
    try {
      await deleteDoc(doc(db, ROUTINES, routineId));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

