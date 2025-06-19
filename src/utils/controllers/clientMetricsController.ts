import { collection, addDoc, doc, updateDoc, getDocs, deleteDoc, getDoc, query, where, orderBy, arrayUnion, increment } from "firebase/firestore";
import { 
  ClientMetrics, 
  PersonalRecord, 
  Measurement, 
  Goal, 
  Achievement, 
  Badge, 
  WeeklyProgress, 
  ProgressSummary 
} from "../../constants/dataModels/clientMetrics.model";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

export const addClientMetrics = async (metrics: Omit<ClientMetrics, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const metricsData = {
      ...metrics,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, firebaseCollection.clientMetrics), metricsData);
    console.log("Client metrics created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding client metrics: ", e);
    throw new Error("Failed to create client metrics");
  }
};

export const updateClientMetrics = async (metricsId: string, updatedData: Partial<ClientMetrics>): Promise<void> => {
  try {
    const metricsRef = doc(db, firebaseCollection.clientMetrics, metricsId);
    const updateData = {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(metricsRef, updateData);
    console.log("Client metrics updated successfully");
  } catch (error) {
    console.error("Error updating client metrics: ", error);
    throw new Error("Failed to update client metrics");
  }
};

export const getAllClientMetrics = async (): Promise<ClientMetrics[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, firebaseCollection.clientMetrics));
    const metrics: ClientMetrics[] = [];
    querySnapshot.forEach((doc) => {
      const metric = {
        ...doc.data(),
        id: doc.id,
      } as ClientMetrics;
      metrics.push(metric);
    });
    return metrics;
  } catch (error) {
    console.error("Error getting client metrics: ", error);
    throw new Error("Failed to get client metrics");
  }
};

export const getClientMetrics = async (clientId: string): Promise<ClientMetrics | null> => {
  try {
    const q = query(
      collection(db, firebaseCollection.clientMetrics), 
      where("clientId", "==", clientId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as ClientMetrics;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting client metrics: ", error);
    throw new Error("Failed to get client metrics");
  }
};

export const getClientMetricsByTrainer = async (trainerId: string): Promise<ClientMetrics[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.clientMetrics), 
      where("trainerId", "==", trainerId),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const metrics: ClientMetrics[] = [];
    querySnapshot.forEach((doc) => {
      const metric = {
        ...doc.data(),
        id: doc.id,
      } as ClientMetrics;
      metrics.push(metric);
    });
    return metrics;
  } catch (error) {
    console.error("Error getting trainer's client metrics: ", error);
    throw new Error("Failed to get trainer's client metrics");
  }
};

export const deleteClientMetrics = async (metricsId: string): Promise<void> => {
  try {
    console.log("Deleting client metrics...", metricsId);
    const docRef = doc(db, firebaseCollection.clientMetrics, metricsId);
    await deleteDoc(docRef);
    console.log("Client metrics deleted successfully");
  } catch (error) {
    console.error("Error deleting client metrics: ", error);
    throw new Error("Failed to delete client metrics");
  }
};

// ===== WORKOUT TRACKING FUNCTIONS =====
export const incrementWorkoutCount = async (clientId: string): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const metricsRef = doc(db, firebaseCollection.clientMetrics, metrics.id);
    await updateDoc(metricsRef, {
      totalWorkouts: increment(1),
      workoutsThisWeek: increment(1),
      workoutsThisMonth: increment(1),
      lastWorkoutDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error incrementing workout count: ", error);
    throw new Error("Failed to increment workout count");
  }
};

export const updateWorkoutStreak = async (clientId: string, isConsecutive: boolean): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const newStreak = isConsecutive ? metrics.currentStreak + 1 : 1;
    const longestStreak = Math.max(newStreak, metrics.longestStreak);

    await updateClientMetrics(metrics.id, {
      currentStreak: newStreak,
      longestStreak: longestStreak,
    });
  } catch (error) {
    console.error("Error updating workout streak: ", error);
    throw new Error("Failed to update workout streak");
  }
};

// ===== PERSONAL RECORDS =====
export const addPersonalRecord = async (clientId: string, record: Omit<PersonalRecord, 'id'>): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const recordWithId = {
      ...record,
      id: `${record.exerciseId}_${Date.now()}`,
    };

    const metricsRef = doc(db, firebaseCollection.clientMetrics, metrics.id);
    await updateDoc(metricsRef, {
      personalRecords: arrayUnion(recordWithId),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding personal record: ", error);
    throw new Error("Failed to add personal record");
  }
};

export const getPersonalRecords = async (clientId: string): Promise<PersonalRecord[]> => {
  try {
    const metrics = await getClientMetrics(clientId);
    return metrics?.personalRecords || [];
  } catch (error) {
    console.error("Error getting personal records: ", error);
    throw new Error("Failed to get personal records");
  }
};

// ===== MEASUREMENTS =====
export const addMeasurementEntry = async (clientId: string, measurement: Omit<Measurement, 'id'>): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const measurementWithId = {
      ...measurement,
      id: `measurement_${Date.now()}`,
    };

    const metricsRef = doc(db, firebaseCollection.clientMetrics, metrics.id);
    await updateDoc(metricsRef, {
      measurements: arrayUnion(measurementWithId),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding measurement: ", error);
    throw new Error("Failed to add measurement");
  }
};

export const getMeasurements = async (clientId: string): Promise<Measurement[]> => {
  try {
    const metrics = await getClientMetrics(clientId);
    return metrics?.measurements || [];
  } catch (error) {
    console.error("Error getting measurements: ", error);
    throw new Error("Failed to get measurements");
  }
};

// ===== GOALS =====
export const addGoal = async (clientId: string, goal: Omit<Goal, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const goalWithId = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const metricsRef = doc(db, firebaseCollection.clientMetrics, metrics.id);
    await updateDoc(metricsRef, {
      goals: arrayUnion(goalWithId),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding goal: ", error);
    throw new Error("Failed to add goal");
  }
};

export const updateGoalProgress = async (clientId: string, goalId: string, currentValue: number): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const updatedGoals = metrics.goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue }
        : goal
    );

    await updateClientMetrics(metrics.id, {
      goals: updatedGoals,
    });
  } catch (error) {
    console.error("Error updating goal progress: ", error);
    throw new Error("Failed to update goal progress");
  }
};

// ===== ACHIEVEMENTS & BADGES =====
export const addAchievement = async (clientId: string, achievement: Omit<Achievement, 'id' | 'dateEarned'>): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const achievementWithId = {
      ...achievement,
      id: `achievement_${Date.now()}`,
      dateEarned: new Date().toISOString(),
    };

    const metricsRef = doc(db, firebaseCollection.clientMetrics, metrics.id);
    await updateDoc(metricsRef, {
      achievements: arrayUnion(achievementWithId),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding achievement: ", error);
    throw new Error("Failed to add achievement");
  }
};

export const addBadge = async (clientId: string, badge: Omit<Badge, 'id' | 'dateEarned'>): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics || !metrics.id) {
      throw new Error("Client metrics not found");
    }

    const badgeWithId = {
      ...badge,
      id: `badge_${Date.now()}`,
      dateEarned: new Date().toISOString(),
    };

    const metricsRef = doc(db, firebaseCollection.clientMetrics, metrics.id);
    await updateDoc(metricsRef, {
      badges: arrayUnion(badgeWithId),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding badge: ", error);
    throw new Error("Failed to add badge");
  }
};

// ===== ANALYTICS =====
export const calculateProgressSummary = async (clientId: string, timeframe: '7d' | '30d' | '90d' | '1y'): Promise<ProgressSummary> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics) {
      throw new Error("Client metrics not found");
    }

    // Calculate date range
    const now = new Date();
    const daysBack = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Filter data by timeframe
    const recentRecords = metrics.personalRecords.filter(
      record => new Date(record.date) >= startDate
    );

    // Calculate basic stats
    const workoutCount = timeframe === '7d' ? metrics.workoutsThisWeek : 
                        timeframe === '30d' ? metrics.workoutsThisMonth : 
                        metrics.totalWorkouts;

    return {
      timeframe,
      workoutCount,
      avgDuration: metrics.avgWorkoutDuration,
      totalCalories: metrics.totalCaloriesBurned || 0,
      strengthImprovement: calculateStrengthImprovement(recentRecords),
      consistencyScore: calculateConsistencyScore(metrics, daysBack),
      topExercises: getTopExercises(recentRecords),
    };
  } catch (error) {
    console.error("Error calculating progress summary: ", error);
    throw new Error("Failed to calculate progress summary");
  }
};

// ===== HELPER FUNCTIONS =====
const calculateStrengthImprovement = (records: PersonalRecord[]): number => {
  if (records.length < 2) return 0;

  const sortedRecords = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const oldest = sortedRecords[0];
  const newest = sortedRecords[sortedRecords.length - 1];

  if (oldest.weight === 0) return 0;
  return Math.round(((newest.weight - oldest.weight) / oldest.weight) * 100);
};

const calculateConsistencyScore = (metrics: ClientMetrics, daysBack: number): number => {
  const expectedWorkouts = Math.floor(daysBack / 7) * 3; // Assuming 3 workouts per week target
  const actualWorkouts = daysBack <= 7 ? metrics.workoutsThisWeek : 
                         daysBack <= 30 ? metrics.workoutsThisMonth : 
                         metrics.totalWorkouts;

  return Math.min(100, Math.round((actualWorkouts / expectedWorkouts) * 100));
};

const getTopExercises = (records: PersonalRecord[]): any[] => {
  const exerciseMap = new Map();
  
  records.forEach(record => {
    if (!exerciseMap.has(record.exerciseId)) {
      exerciseMap.set(record.exerciseId, {
        exerciseId: record.exerciseId,
        exerciseName: record.exerciseName,
        timesPerformed: 0,
        avgWeight: 0,
        maxWeight: 0,
        totalVolume: 0,
        improvement: 0,
      });
    }
    
    const exercise = exerciseMap.get(record.exerciseId);
    exercise.timesPerformed++;
    exercise.maxWeight = Math.max(exercise.maxWeight, record.weight);
    exercise.totalVolume += record.weight * record.reps;
  });

  return Array.from(exerciseMap.values())
    .sort((a, b) => b.timesPerformed - a.timesPerformed)
    .slice(0, 5);
}; 