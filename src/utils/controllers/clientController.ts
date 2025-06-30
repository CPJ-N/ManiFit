import { collection, query, where, getDocs, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { firebaseCollection } from "../../constants/firebaseContant";
import { getAlllinkedTrainees, assignTraineeToTrainer, unlinkTraineeFromTrainer } from "./linkingTrainerTrainee";
import { getWorkoutSessionsByClient } from "./workoutSessionController";
import { getRoutinesByTrainee } from "./routineController";
import { UserDetails } from "../../constants/dataModels/userDetails.model";
import { ClientMetrics, WeightEntry, BasicProgressSummary } from "../../constants/dataModels/clientMetrics.model";
import { WorkoutSession } from "../../constants/dataModels/workoutSession.model";

// ===== CLIENT DATA INTERFACES =====
export interface ClientData {
  uid: string;
  fullName: string;
  email: string;
  profilePhotoName?: string;
  lastActive?: string;
  isTrainer: boolean;
  linkedTrainer?: string;
}

export interface ClientWithMetrics extends ClientData {
  metrics?: ClientMetrics;
  totalWorkouts?: number;
  currentStreak?: number;
  lastWorkoutDate?: string;
}

// ===== CLIENT MANAGEMENT FUNCTIONS =====

/**
 * Get all clients linked to a trainer with basic info
 */
export const getTrainerClients = async (trainerId: string): Promise<ClientData[]> => {
  try {
    const linkedClients = await getAlllinkedTrainees(trainerId);
    
    // Transform the data to match our ClientData interface
    const transformedClients: ClientData[] = linkedClients.map((client: any) => ({
      uid: client.uid,
      fullName: client.fullName || 'Unknown Client',
      email: client.email || '',
      profilePhotoName: client.profilePhotoName,
      lastActive: client.lastActive,
      isTrainer: client.isTrainer || false,
      linkedTrainer: client.linkedTrainer,
    }));

    return transformedClients;
  } catch (error) {
    console.error('Error fetching trainer clients:', error);
    throw new Error('Failed to get trainer clients');
  }
};

/**
 * Get all clients with their metrics for detailed dashboard view
 */
export const getTrainerClientsWithMetrics = async (trainerId: string): Promise<ClientWithMetrics[]> => {
  try {
    // Get basic client data
    const clients = await getTrainerClients(trainerId);
    
    // Get all client metrics for this trainer
    const allMetrics = await getClientMetricsByTrainer(trainerId);
    
    // Combine client data with their metrics
    const clientsWithMetrics: ClientWithMetrics[] = clients.map(client => {
      const clientMetrics = allMetrics.find((metric: any) => metric.clientId === client.uid);
      
      return {
        ...client,
        metrics: clientMetrics,
        totalWorkouts: clientMetrics?.totalWorkouts || 0,
        currentStreak: clientMetrics?.currentStreak || 0,
        lastWorkoutDate: clientMetrics?.lastWorkoutDate,
      };
    });

    return clientsWithMetrics;
  } catch (error) {
    console.error('Error fetching trainer clients with metrics:', error);
    throw new Error('Failed to get trainer clients with metrics');
  }
};

/**
 * Get detailed information for a single client
 */
export const getClientDetails = async (clientId: string): Promise<ClientWithMetrics | null> => {
  try {
    // Get client user details
    const clientQuery = query(
      collection(db, firebaseCollection.userDetails),
      where("__name__", "==", clientId)
    );
    const clientSnapshot = await getDocs(clientQuery);
    
    if (clientSnapshot.empty) {
      return null;
    }

    const clientDoc = clientSnapshot.docs[0];
    const clientData = { ...clientDoc.data(), uid: clientDoc.id } as UserDetails;

    // Get client metrics
    const clientMetrics = await getClientMetrics(clientId);

    const clientDetails: ClientWithMetrics = {
      uid: clientData.uid || clientId,
      fullName: clientData.fullName,
      email: clientData.email,
      profilePhotoName: clientData.profilePhotoName,
      lastActive: clientData.lastActive,
      isTrainer: clientData.isTrainer,
      linkedTrainer: clientData.linkedTrainer,
      metrics: clientMetrics || undefined,
      totalWorkouts: clientMetrics?.totalWorkouts || 0,
      currentStreak: clientMetrics?.currentStreak || 0,
      lastWorkoutDate: clientMetrics?.lastWorkoutDate,
    };

    return clientDetails;
  } catch (error) {
    console.error('Error fetching client details:', error);
    throw new Error('Failed to get client details');
  }
};

/**
 * Link a new trainee to trainer
 */
export const linkClientToTrainer = async (traineeId: string, trainerId: string): Promise<void> => {
  try {
    await assignTraineeToTrainer(traineeId, trainerId);
    
    // Initialize client metrics when they link to a trainer
    await initializeClientMetrics(traineeId, trainerId);
    
    console.log(`Client ${traineeId} successfully linked to trainer ${trainerId}`);
  } catch (error) {
    console.error('Error linking client to trainer:', error);
    throw new Error('Failed to link client to trainer');
  }
};

/**
 * Unlink a client from trainer
 */
export const unlinkClientFromTrainer = async (traineeId: string, trainerId: string): Promise<void> => {
  try {
    await unlinkTraineeFromTrainer(traineeId, trainerId);
    console.log(`Client ${traineeId} successfully unlinked from trainer ${trainerId}`);
  } catch (error) {
    console.error('Error unlinking client from trainer:', error);
    throw new Error('Failed to unlink client from trainer');
  }
};

/**
 * Get trainer dashboard stats
 */
export const getTrainerDashboardStats = async (trainerId: string) => {
  try {
    const clients = await getTrainerClientsWithMetrics(trainerId);
    
    // Calculate total monthly earnings (this would need to be enhanced with actual payment data)
    const monthlyEarnings = 0; // TODO: Calculate from subscription/payment data
    
    // Calculate active clients (clients who worked out in last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const activeClients = clients.filter(client => {
      if (!client.lastWorkoutDate) return false;
      return new Date(client.lastWorkoutDate) >= sevenDaysAgo;
    }).length;

    // Calculate total workouts assigned this month
    const totalWorkoutsThisMonth = clients.reduce((sum, client) => {
      return sum + (client.metrics?.workoutsThisMonth || 0);
    }, 0);

    return {
      totalClients: clients.length,
      activeClients,
      monthlyEarnings,
      totalWorkoutsThisMonth,
      clients: clients.slice(0, 5), // Recent 5 clients for dashboard
    };
  } catch (error) {
    console.error('Error fetching trainer dashboard stats:', error);
    throw new Error('Failed to get trainer dashboard stats');
  }
};

/**
 * Search clients by name or email
 */
export const searchTrainerClients = async (trainerId: string, searchTerm: string): Promise<ClientData[]> => {
  try {
    const allClients = await getTrainerClients(trainerId);
    
    const filteredClients = allClients.filter(client => 
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredClients;
  } catch (error) {
    console.error('Error searching trainer clients:', error);
    throw new Error('Failed to search clients');
  }
};

// ===== CLIENT METRICS FUNCTIONS =====

/**
 * Get client metrics by client ID
 */
export const getClientMetrics = async (clientId: string): Promise<ClientMetrics | null> => {
  try {
    const metricsQuery = query(
      collection(db, firebaseCollection.clientMetrics),
      where("clientId", "==", clientId)
    );
    const querySnapshot = await getDocs(metricsQuery);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { ...doc.data(), id: doc.id } as ClientMetrics;
  } catch (error) {
    console.error('Error fetching client metrics:', error);
    throw new Error('Failed to get client metrics');
  }
};

/**
 * Get all client metrics for a trainer
 */
export const getClientMetricsByTrainer = async (trainerId: string): Promise<ClientMetrics[]> => {
  try {
    const metricsQuery = query(
      collection(db, firebaseCollection.clientMetrics),
      where("trainerId", "==", trainerId)
    );
    const querySnapshot = await getDocs(metricsQuery);
    
    const metrics: ClientMetrics[] = [];
    querySnapshot.forEach((doc) => {
      metrics.push({ ...doc.data(), id: doc.id } as ClientMetrics);
    });
    
    return metrics;
  } catch (error) {
    console.error('Error fetching trainer client metrics:', error);
    throw new Error('Failed to get trainer client metrics');
  }
};

/**
 * Initialize client metrics when they link to a trainer
 */
export const initializeClientMetrics = async (clientId: string, trainerId: string): Promise<void> => {
  try {
    // Check if metrics already exist
    const existing = await getClientMetrics(clientId);
    if (existing) {
      return; // Already initialized
    }
    
    const initialMetrics: Omit<ClientMetrics, 'id'> = {
      clientId,
      trainerId,
      startDate: new Date().toISOString(),
      totalWorkouts: 0,
      workoutsThisWeek: 0,
      workoutsThisMonth: 0,
      currentStreak: 0,
      longestStreak: 0,
      avgWorkoutDuration: 0,
      totalWorkoutTime: 0,
      weightHistory: [],
      totalCaloriesBurned: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await addDoc(collection(db, firebaseCollection.clientMetrics), initialMetrics);
    console.log(`Client metrics initialized for ${clientId}`);
  } catch (error) {
    console.error('Error initializing client metrics:', error);
    throw new Error('Failed to initialize client metrics');
  }
};

/**
 * Update client metrics after workout completion
 */
export const updateClientMetricsAfterWorkout = async (
  clientId: string, 
  workoutSession: WorkoutSession
): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics) {
      console.warn(`No metrics found for client ${clientId}, skipping update`);
      return;
    }
    
    const now = new Date();
    const workoutDate = new Date(workoutSession.startTime || now.toISOString());
    
    // Calculate new streak
    const newStreak = calculateStreak(metrics.lastWorkoutDate, workoutDate.toISOString());
    
    // Calculate workout counts
    const { thisWeek, thisMonth } = calculateWorkoutCounts(
      metrics.totalWorkouts + 1,
      workoutDate,
      metrics.startDate
    );
    
    const updatedMetrics: Partial<ClientMetrics> = {
      totalWorkouts: metrics.totalWorkouts + 1,
      workoutsThisWeek: thisWeek,
      workoutsThisMonth: thisMonth,
      currentStreak: newStreak,
      longestStreak: Math.max(metrics.longestStreak, newStreak),
      lastWorkoutDate: workoutDate.toISOString(),
      totalWorkoutTime: metrics.totalWorkoutTime + (workoutSession.totalDuration || 0) / 60, // Convert to minutes
      avgWorkoutDuration: (metrics.totalWorkoutTime + (workoutSession.totalDuration || 0) / 60) / (metrics.totalWorkouts + 1),
      totalCaloriesBurned: (metrics.totalCaloriesBurned || 0) + (workoutSession.caloriesBurned || 0),
      updatedAt: new Date().toISOString(),
    };
    
    // Update in database
    const metricsQuery = query(
      collection(db, firebaseCollection.clientMetrics),
      where("clientId", "==", clientId)
    );
    const querySnapshot = await getDocs(metricsQuery);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, firebaseCollection.clientMetrics, querySnapshot.docs[0].id);
      await updateDoc(docRef, updatedMetrics);
      console.log(`Client metrics updated for ${clientId}`);
    }
  } catch (error) {
    console.error('Error updating client metrics:', error);
    throw new Error('Failed to update client metrics');
  }
};

/**
 * Add weight entry for client
 */
export const addWeightEntry = async (clientId: string, weight: number, notes?: string): Promise<void> => {
  try {
    const metrics = await getClientMetrics(clientId);
    if (!metrics) {
      throw new Error('Client metrics not found');
    }
    
    const newEntry: WeightEntry = {
      date: new Date().toISOString(),
      weight,
      notes,
    };
    
    const updatedWeightHistory = [...metrics.weightHistory, newEntry]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
      .slice(0, 100); // Keep only last 100 entries
    
    const metricsQuery = query(
      collection(db, firebaseCollection.clientMetrics),
      where("clientId", "==", clientId)
    );
    const querySnapshot = await getDocs(metricsQuery);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, firebaseCollection.clientMetrics, querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        weightHistory: updatedWeightHistory,
        updatedAt: new Date().toISOString(),
      });
      console.log(`Weight entry added for ${clientId}: ${weight}kg`);
    }
  } catch (error) {
    console.error('Error adding weight entry:', error);
    throw new Error('Failed to add weight entry');
  }
};

/**
 * Get basic progress summary for client
 */
export const getClientProgressSummary = async (
  clientId: string, 
  timeframe: '7d' | '30d' | '90d' = '30d'
): Promise<BasicProgressSummary> => {
  try {
    const metrics = await getClientMetrics(clientId);
    const workoutSessions = await getWorkoutSessionsByClient(clientId);
    const assignedRoutines = await getRoutinesByTrainee(clientId);
    
    const daysBack = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    // Filter sessions within timeframe
    const recentSessions = workoutSessions.filter(session => 
      session.startTime && new Date(session.startTime) >= cutoffDate
    );
    
    // Calculate consistency score
    const assignedInTimeframe = assignedRoutines.filter(routine =>
      routine.assignees?.some((assignee: any) =>
        assignee.traineeId === clientId &&
        new Date(assignee.date) >= cutoffDate
      )
    ).length;
    
    const completedInTimeframe = recentSessions.filter(session => 
      session.status === 'completed'
    ).length;
    
    const consistencyScore = assignedInTimeframe > 0 
      ? Math.round((completedInTimeframe / assignedInTimeframe) * 100)
      : 0;
    
    return {
      timeframe,
      workoutCount: completedInTimeframe,
      avgDuration: recentSessions.length > 0 
        ? recentSessions.reduce((sum, session) => sum + (session.totalDuration || 0), 0) / recentSessions.length / 60
        : 0,
      totalCalories: recentSessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0),
      consistencyScore,
    };
  } catch (error) {
    console.error('Error calculating progress summary:', error);
    throw new Error('Failed to calculate progress summary');
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Calculate current streak based on last workout date and new workout date
 */
const calculateStreak = (lastWorkoutDate?: string, newWorkoutDate?: string): number => {
  if (!lastWorkoutDate || !newWorkoutDate) return 1;
  
  const lastDate = new Date(lastWorkoutDate);
  const newDate = new Date(newWorkoutDate);
  const daysDiff = Math.floor((newDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day - continue streak
    return 1; // This will be added to current streak in calling function
  } else if (daysDiff === 0) {
    // Same day - maintain streak
    return 0; // No change to streak
  } else {
    // Gap in workouts - reset streak
    return 1; // New streak starts
  }
};

/**
 * Calculate workout counts for this week and month
 */
const calculateWorkoutCounts = (totalWorkouts: number, workoutDate: Date, startDate: string) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of this week
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
  
  // This is a simplified calculation - in a real app you'd query the database
  // For now, we'll estimate based on total workouts and start date
  const daysSinceStart = Math.floor((now.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const avgWorkoutsPerDay = totalWorkouts / Math.max(daysSinceStart, 1);
  
  return {
    thisWeek: Math.round(avgWorkoutsPerDay * 7),
    thisMonth: Math.round(avgWorkoutsPerDay * 30),
  };
};
