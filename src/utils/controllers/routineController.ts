import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { firebaseCollection } from "../../constants/firebaseContant";
import { Assignee, Routine } from "../../constants/dataModels/routine.model";


export const addRoutine = async (routine: Routine) => {
    try {
      const docRef = await addDoc(collection(db, firebaseCollection.routines), routine);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
};

export const getRoutine = async (routineId: string) => {
    try {
      const docRef = doc(db, firebaseCollection.routines, routineId);
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
      const querySnapshot = await getDocs(collection(db, firebaseCollection.routines));
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
    const routineRef = doc(db, firebaseCollection.routines, routineId);
  
    // Atomically add a new exercise to the "exercises" array field.
    updateDoc(routineRef, {
      exercises: arrayUnion(exerciseId)
    });
  };

export const deleteRoutine = async (routineId: string) => {
    try {
      await deleteDoc(doc(db, firebaseCollection.routines, routineId));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

//get all routines filtered by it's property named 'createdBy'
export const getRoutinesByTrainer = async (trainerId: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, firebaseCollection.routines));
      const routines: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdBy === trainerId) {
          routines.push({ id: doc.id, ...data });
        }
      });
      return routines;
    } catch (error) {
      console.error("Error getting routines: ", error);
      throw new Error("Failed to get routines");
    }
}

export const assignRoutineToTrainee= async (routineId: string, traineeId: string, assignedDate: string)  => {
    try {
      // Fetch the routine from the database
      const routineRef = doc(db, firebaseCollection.routines, routineId);
      const routineSnapshot = await getDoc(routineRef);
  
      if (!routineSnapshot.exists()) {
        throw new Error('Routine not found');
      }

      const routineData = routineSnapshot.data() as Routine;

      // Ensure assignees is defined
    const assignees = routineData.assignees || [];
  
      // Create the Assignee object
      const newAssignee: Assignee = {
        traineeId,
        date: assignedDate,
        status: 'planned', // Set the initial status
      };
  
      // Update the routine with the new assignee
      const updatedAssignees = [...assignees, newAssignee];
      await updateDoc(routineRef, { assignees: updatedAssignees });
  
      console.log(`Routine assigned to trainee ${traineeId} on ${assignedDate}`);
    } catch (error) {
      console.error('Failed to assign routine:', error);
    }
  }

  //get routines that are assigned to a specific trainee
export const getRoutinesByTrainee = async (traineeId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, firebaseCollection.routines));
    const routines: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const assignees = data.assignees || [];
      const isAssigned = assignees.some((assignee: Assignee) => assignee.traineeId === traineeId);

      if (isAssigned) {
        routines.push({ id: doc.id, ...data });
      }
    });
    return routines;
  } catch (error) {
    console.error("Error getting routines: ", error);
    throw new Error("Failed to get routines");
  }
}

  export async function updateRoutineStatus(routineId: string, traineeId: string, date: string, status: 'planned' | 'completed' | 'missed') {
    try {
      const routineRef = doc(db, firebaseCollection.routines, routineId);
      const routineSnapshot = await getDoc(routineRef);
  
      if (!routineSnapshot.exists()) {
        throw new Error('Routine not found');
      }

      const routineData = routineSnapshot.data() as Routine;

      // Find the assignee and update the status
      const updatedAssignees = routineData.assignees.map(assignee => 
        assignee.traineeId === traineeId && assignee.date === date
          ? { ...assignee, status }
          : assignee
      );
  
      await updateDoc(routineRef, { assignees: updatedAssignees });
  
      console.log(`Routine status updated for trainee ${traineeId} on ${date} to ${status}`);
    } catch (error) {
      console.error('Failed to update routine status:', error);
    }
  }