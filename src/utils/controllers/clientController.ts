import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { firebaseCollection } from "../../constants/firebaseContant";
import { getAlllinkedTrainees, assignTraineeToTrainer, unlinkTraineeFromTrainer } from "./linkingTrainerTrainee";
// import { getClientMetricsByTrainer, getClientMetrics } from "./clientMetricsController";
import { UserDetails } from "../../constants/dataModels/userDetails.model";
import { ClientMetrics } from "../../constants/dataModels/clientMetrics.model";

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
    // const allMetrics = await getClientMetricsByTrainer(trainerId);
    
    // Combine client data with their metrics
    const clientsWithMetrics: ClientWithMetrics[] = clients.map(client => {
      // const clientMetrics = allMetrics.find((metric: any) => metric.clientId === client.uid);
      
      return {
        ...client,
        // metrics: clientMetrics,
        totalWorkouts: 0, // clientMetrics?.totalWorkouts || 0,
        currentStreak: 0, // clientMetrics?.currentStreak || 0,
        lastWorkoutDate: undefined, // clientMetrics?.lastWorkoutDate,
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
    // const clientMetrics = await getClientMetrics(clientId);

    const clientDetails: ClientWithMetrics = {
      uid: clientData.uid || clientId,
      fullName: clientData.fullName,
      email: clientData.email,
      profilePhotoName: clientData.profilePhotoName,
      lastActive: clientData.lastActive,
      isTrainer: clientData.isTrainer,
      linkedTrainer: clientData.linkedTrainer,
      // metrics: clientMetrics || undefined,
      totalWorkouts: 0, // clientMetrics?.totalWorkouts || 0,
      currentStreak: 0, // clientMetrics?.currentStreak || 0,
      lastWorkoutDate: undefined, // clientMetrics?.lastWorkoutDate,
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
