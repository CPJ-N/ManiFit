import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { Exercise } from "../../constants/dataModels/exercise.model";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

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

// Get exercises filtered by body part/category
export const getExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const allExercises = await getAllExercisesFromUrl();
    const filteredExercises = allExercises.filter((exercise: any) => 
      exercise.bodyPart?.toLowerCase() === bodyPart.toLowerCase() ||
      exercise.primaryMuscles?.some((muscle: string) => 
        muscle.toLowerCase().includes(bodyPart.toLowerCase())
      )
    );
    return filteredExercises;
  } catch (error) {
    console.error("Error filtering exercises by body part: ", error);
    throw new Error("Failed to get exercises by body part");
  }
};

// Get exercise image URL with GitHub prefix
export const getExerciseImageUrl = (exerciseName: string): string => {
  const baseUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
  const sanitizedName = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  return `${baseUrl}/${sanitizedName}/0.jpg`;
};