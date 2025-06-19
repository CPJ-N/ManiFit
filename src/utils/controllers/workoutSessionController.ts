import { collection, addDoc, doc, updateDoc, getDocs, deleteDoc, getDoc, query, where, arrayUnion, orderBy } from "firebase/firestore";
import { WorkoutSession, ExerciseProgress } from "../../constants/dataModels/workoutSession.model";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

export const addWorkoutSession = async (session: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const sessionData = {
      ...session,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, firebaseCollection.workoutSessions), sessionData);
    console.log("Workout session created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding workout session: ", e);
    throw new Error("Failed to create workout session");
  }
};

export const updateWorkoutSession = async (sessionId: string, updatedData: Partial<WorkoutSession>): Promise<void> => {
  try {
    const sessionRef = doc(db, firebaseCollection.workoutSessions, sessionId);
    const updateData = {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(sessionRef, updateData);
    console.log("Workout session updated successfully");
  } catch (error) {
    console.error("Error updating workout session: ", error);
    throw new Error("Failed to update workout session");
  }
};

export const getAllWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, firebaseCollection.workoutSessions));
    const sessions: WorkoutSession[] = [];
    querySnapshot.forEach((doc) => {
      const session = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutSession;
      sessions.push(session);
    });
    return sessions;
  } catch (error) {
    console.error("Error getting workout sessions: ", error);
    throw new Error("Failed to get workout sessions");
  }
};

export const getWorkoutSession = async (sessionId: string): Promise<WorkoutSession> => {
  try {
    const docRef = doc(db, firebaseCollection.workoutSessions, sessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const session = {
        id: docSnap.id,
        ...docSnap.data(),
      } as WorkoutSession;
      return session;
    } else {
      throw new Error("No such workout session found");
    }
  } catch (error) {
    console.error("Error getting workout session: ", error);
    throw new Error("Failed to get workout session");
  }
};

export const deleteWorkoutSession = async (sessionId: string): Promise<void> => {
  try {
    console.log("Deleting workout session...", sessionId);
    const docRef = doc(db, firebaseCollection.workoutSessions, sessionId);
    await deleteDoc(docRef);
    console.log("Workout session deleted successfully");
  } catch (error) {
    console.error("Error deleting workout session: ", error);
    throw new Error("Failed to delete workout session");
  }
};

export const getWorkoutSessionsByClient = async (clientId: string): Promise<WorkoutSession[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutSessions), 
      where("clientId", "==", clientId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const sessions: WorkoutSession[] = [];
    querySnapshot.forEach((doc) => {
      const session = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutSession;
      sessions.push(session);
    });
    return sessions;
  } catch (error) {
    console.error("Error getting client workout sessions: ", error);
    throw new Error("Failed to get client workout sessions");
  }
};

export const getWorkoutSessionsByTrainer = async (trainerId: string): Promise<WorkoutSession[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutSessions), 
      where("trainerId", "==", trainerId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const sessions: WorkoutSession[] = [];
    querySnapshot.forEach((doc) => {
      const session = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutSession;
      sessions.push(session);
    });
    return sessions;
  } catch (error) {
    console.error("Error getting trainer workout sessions: ", error);
    throw new Error("Failed to get trainer workout sessions");
  }
};

export const getActiveWorkoutSessions = async (clientId: string): Promise<WorkoutSession[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutSessions), 
      where("clientId", "==", clientId),
      where("status", "in", ["in_progress", "paused"])
    );
    const querySnapshot = await getDocs(q);
    const sessions: WorkoutSession[] = [];
    querySnapshot.forEach((doc) => {
      const session = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutSession;
      sessions.push(session);
    });
    return sessions;
  } catch (error) {
    console.error("Error getting active workout sessions: ", error);
    throw new Error("Failed to get active workout sessions");
  }
};

// ===== SESSION CONTROL FUNCTIONS =====
export const startWorkoutSession = async (sessionId: string): Promise<void> => {
  try {
    await updateWorkoutSession(sessionId, {
      status: "in_progress",
      startTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error starting workout session: ", error);
    throw new Error("Failed to start workout session");
  }
};

export const pauseWorkoutSession = async (sessionId: string): Promise<void> => {
  try {
    await updateWorkoutSession(sessionId, {
      status: "paused",
    });
  } catch (error) {
    console.error("Error pausing workout session: ", error);
    throw new Error("Failed to pause workout session");
  }
};

export const completeWorkoutSession = async (sessionId: string, sessionSummary: Partial<WorkoutSession>): Promise<void> => {
  try {
    await updateWorkoutSession(sessionId, {
      ...sessionSummary,
      status: "completed",
      endTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error completing workout session: ", error);
    throw new Error("Failed to complete workout session");
  }
};

export const updateExerciseProgress = async (sessionId: string, exerciseProgress: ExerciseProgress): Promise<void> => {
  try {
    const sessionRef = doc(db, firebaseCollection.workoutSessions, sessionId);
    await updateDoc(sessionRef, {
      exerciseProgress: arrayUnion(exerciseProgress),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating exercise progress: ", error);
    throw new Error("Failed to update exercise progress");
  }
}; 