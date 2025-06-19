import { collection, addDoc, doc, updateDoc, getDocs, deleteDoc, getDoc, query, where, orderBy } from "firebase/firestore";
import { Exercise } from "../../constants/dataModels/exercise.model";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

export const addCustomExercise = async (exercise: Omit<Exercise, 'id'>): Promise<string> => {
  try {
    const exerciseData = {
      ...exercise,
      source: 'custom' as const,
    };
    const docRef = await addDoc(collection(db, firebaseCollection.exerciseLibrary), exerciseData);
    console.log("Custom exercise created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding custom exercise: ", e);
    throw new Error("Failed to create custom exercise");
  }
};

export const updateCustomExercise = async (exerciseId: string, updatedData: Partial<Exercise>): Promise<void> => {
  try {
    const exerciseRef = doc(db, firebaseCollection.exerciseLibrary, exerciseId);
    await updateDoc(exerciseRef, updatedData);
    console.log("Custom exercise updated successfully");
  } catch (error) {
    console.error("Error updating custom exercise: ", error);
    throw new Error("Failed to update custom exercise");
  }
};

export const getAllCustomExercises = async (): Promise<Exercise[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, firebaseCollection.exerciseLibrary));
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      const exercise = {
        ...doc.data(),
        id: doc.id,
      } as Exercise;
      exercises.push(exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting custom exercises: ", error);
    throw new Error("Failed to get custom exercises");
  }
};

export const getCustomExercise = async (exerciseId: string): Promise<Exercise> => {
  try {
    const docRef = doc(db, firebaseCollection.exerciseLibrary, exerciseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const exercise = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Exercise;
      return exercise;
    } else {
      throw new Error("No such custom exercise found");
    }
  } catch (error) {
    console.error("Error getting custom exercise: ", error);
    throw new Error("Failed to get custom exercise");
  }
};

export const deleteCustomExercise = async (exerciseId: string): Promise<void> => {
  try {
    console.log("Deleting custom exercise...", exerciseId);
    const docRef = doc(db, firebaseCollection.exerciseLibrary, exerciseId);
    await deleteDoc(docRef);
    console.log("Custom exercise deleted successfully");
  } catch (error) {
    console.error("Error deleting custom exercise: ", error);
    throw new Error("Failed to delete custom exercise");
  }
};

export const getCustomExercisesByTrainer = async (trainerId: string): Promise<Exercise[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.exerciseLibrary), 
      where("createdBy", "==", trainerId),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      const exercise = {
        ...doc.data(),
        id: doc.id,
      } as Exercise;
      exercises.push(exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting trainer's custom exercises: ", error);
    throw new Error("Failed to get trainer's custom exercises");
  }
};

export const getPublicCustomExercises = async (): Promise<Exercise[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.exerciseLibrary), 
      where("isPublic", "==", true),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      const exercise = {
        ...doc.data(),
        id: doc.id,
      } as Exercise;
      exercises.push(exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting public custom exercises: ", error);
    throw new Error("Failed to get public custom exercises");
  }
};

export const getCustomExercisesByCategory = async (category: string): Promise<Exercise[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.exerciseLibrary), 
      where("category", "==", category),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      const exercise = {
        ...doc.data(),
        id: doc.id,
      } as Exercise;
      exercises.push(exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting custom exercises by category: ", error);
    throw new Error("Failed to get custom exercises by category");
  }
};

export const getCustomExercisesByMuscle = async (muscle: string): Promise<Exercise[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.exerciseLibrary), 
      where("primaryMuscles", "array-contains", muscle),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    const exercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      const exercise = {
        ...doc.data(),
        id: doc.id,
      } as Exercise;
      exercises.push(exercise);
    });
    return exercises;
  } catch (error) {
    console.error("Error getting custom exercises by muscle: ", error);
    throw new Error("Failed to get custom exercises by muscle");
  }
};

export const searchCustomExercises = async (searchTerm: string): Promise<Exercise[]> => {
  try {
    // Note: Firestore doesn't support full-text search, so this is a basic name search
    // For production, consider using Algolia or similar service
    const q = query(
      collection(db, firebaseCollection.exerciseLibrary),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    const exercises: Exercise[] = [];
    
    querySnapshot.forEach((doc) => {
      const exercise = {
        ...doc.data(),
        id: doc.id,
      } as Exercise;
      
      // Simple client-side filtering
      if (exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))) {
        exercises.push(exercise);
      }
    });
    
    return exercises;
  } catch (error) {
    console.error("Error searching custom exercises: ", error);
    throw new Error("Failed to search custom exercises");
  }
};

export const toggleExerciseFavorite = async (exerciseId: string, isFavorite: boolean): Promise<void> => {
  try {
    await updateCustomExercise(exerciseId, { isFavorite });
  } catch (error) {
    console.error("Error toggling exercise favorite: ", error);
    throw new Error("Failed to toggle exercise favorite");
  }
}; 