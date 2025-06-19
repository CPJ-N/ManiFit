import { collection, addDoc, doc, updateDoc, getDocs, deleteDoc, getDoc, query, where, orderBy, increment } from "firebase/firestore";
import { WorkoutTemplate, ExerciseTemplate } from "../../constants/dataModels/workoutTemplate.model";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

export const addWorkoutTemplate = async (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt' | 'timesUsed' | 'avgRating' | 'ratingCount'>): Promise<string> => {
  try {
    const templateData = {
      ...template,
      timesUsed: 0,
      avgRating: 0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, firebaseCollection.workoutTemplates), templateData);
    console.log("Workout template created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding workout template: ", e);
    throw new Error("Failed to create workout template");
  }
};

export const updateWorkoutTemplate = async (templateId: string, updatedData: Partial<WorkoutTemplate>): Promise<void> => {
  try {
    const templateRef = doc(db, firebaseCollection.workoutTemplates, templateId);
    const updateData = {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(templateRef, updateData);
    console.log("Workout template updated successfully");
  } catch (error) {
    console.error("Error updating workout template: ", error);
    throw new Error("Failed to update workout template");
  }
};

export const getAllWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, firebaseCollection.workoutTemplates));
    const templates: WorkoutTemplate[] = [];
    querySnapshot.forEach((doc) => {
      const template = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutTemplate;
      templates.push(template);
    });
    return templates;
  } catch (error) {
    console.error("Error getting workout templates: ", error);
    throw new Error("Failed to get workout templates");
  }
};

export const getWorkoutTemplate = async (templateId: string): Promise<WorkoutTemplate> => {
  try {
    const docRef = doc(db, firebaseCollection.workoutTemplates, templateId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const template = {
        id: docSnap.id,
        ...docSnap.data(),
      } as WorkoutTemplate;
      return template;
    } else {
      throw new Error("No such workout template found");
    }
  } catch (error) {
    console.error("Error getting workout template: ", error);
    throw new Error("Failed to get workout template");
  }
};

export const deleteWorkoutTemplate = async (templateId: string): Promise<void> => {
  try {
    console.log("Deleting workout template...", templateId);
    const docRef = doc(db, firebaseCollection.workoutTemplates, templateId);
    await deleteDoc(docRef);
    console.log("Workout template deleted successfully");
  } catch (error) {
    console.error("Error deleting workout template: ", error);
    throw new Error("Failed to delete workout template");
  }
};

export const getWorkoutTemplatesByTrainer = async (trainerId: string): Promise<WorkoutTemplate[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutTemplates), 
      where("createdBy", "==", trainerId),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const templates: WorkoutTemplate[] = [];
    querySnapshot.forEach((doc) => {
      const template = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutTemplate;
      templates.push(template);
    });
    return templates;
  } catch (error) {
    console.error("Error getting trainer's workout templates: ", error);
    throw new Error("Failed to get trainer's workout templates");
  }
};

export const getPublicWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutTemplates), 
      where("isPublic", "==", true),
      orderBy("avgRating", "desc")
    );
    const querySnapshot = await getDocs(q);
    const templates: WorkoutTemplate[] = [];
    querySnapshot.forEach((doc) => {
      const template = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutTemplate;
      templates.push(template);
    });
    return templates;
  } catch (error) {
    console.error("Error getting public workout templates: ", error);
    throw new Error("Failed to get public workout templates");
  }
};

export const getWorkoutTemplatesByCategory = async (category: string): Promise<WorkoutTemplate[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutTemplates), 
      where("category", "==", category),
      where("isPublic", "==", true),
      orderBy("avgRating", "desc")
    );
    const querySnapshot = await getDocs(q);
    const templates: WorkoutTemplate[] = [];
    querySnapshot.forEach((doc) => {
      const template = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutTemplate;
      templates.push(template);
    });
    return templates;
  } catch (error) {
    console.error("Error getting workout templates by category: ", error);
    throw new Error("Failed to get workout templates by category");
  }
};

export const getWorkoutTemplatesByDifficulty = async (difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<WorkoutTemplate[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutTemplates), 
      where("difficulty", "==", difficulty),
      where("isPublic", "==", true),
      orderBy("avgRating", "desc")
    );
    const querySnapshot = await getDocs(q);
    const templates: WorkoutTemplate[] = [];
    querySnapshot.forEach((doc) => {
      const template = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutTemplate;
      templates.push(template);
    });
    return templates;
  } catch (error) {
    console.error("Error getting workout templates by difficulty: ", error);
    throw new Error("Failed to get workout templates by difficulty");
  }
};

export const searchWorkoutTemplates = async (searchTerm: string): Promise<WorkoutTemplate[]> => {
  try {
    // Note: Basic search implementation - for production consider Algolia
    const q = query(
      collection(db, firebaseCollection.workoutTemplates),
      where("isPublic", "==", true),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    const templates: WorkoutTemplate[] = [];
    
    querySnapshot.forEach((doc) => {
      const template = {
        ...doc.data(),
        id: doc.id,
      } as WorkoutTemplate;
      
      // Simple client-side filtering
      if (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))) {
        templates.push(template);
      }
    });
    
    return templates;
  } catch (error) {
    console.error("Error searching workout templates: ", error);
    throw new Error("Failed to search workout templates");
  }
};

export const duplicateWorkoutTemplate = async (templateId: string, trainerId: string, newName?: string): Promise<string> => {
  try {
    // Get the original template
    const originalTemplate = await getWorkoutTemplate(templateId);
    
    // Create a copy with new data
    const duplicatedTemplate = {
      ...originalTemplate,
      name: newName || `Copy of ${originalTemplate.name}`,
      createdBy: trainerId,
      isPublic: false, // New copies are private by default
      timesUsed: 0,
      avgRating: 0,
      ratingCount: 0,
    };
    
    // Remove the ID and timestamps
    const { id, createdAt, updatedAt, ...templateWithoutTimestamps } = duplicatedTemplate;
    
    // Create the new template
    const newTemplateId = await addWorkoutTemplate(templateWithoutTimestamps);
    
    // Increment usage count on original template
    await incrementTemplateUsage(templateId);
    
    return newTemplateId;
  } catch (error) {
    console.error("Error duplicating workout template: ", error);
    throw new Error("Failed to duplicate workout template");
  }
};

export const incrementTemplateUsage = async (templateId: string): Promise<void> => {
  try {
    const templateRef = doc(db, firebaseCollection.workoutTemplates, templateId);
    await updateDoc(templateRef, {
      timesUsed: increment(1),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error incrementing template usage: ", error);
    throw new Error("Failed to increment template usage");
  }
};

export const rateWorkoutTemplate = async (templateId: string, rating: number): Promise<void> => {
  try {
    // Get current template data
    const template = await getWorkoutTemplate(templateId);
    
    // Calculate new average rating
    const newRatingCount = template.ratingCount + 1;
    const newAvgRating = ((template.avgRating * template.ratingCount) + rating) / newRatingCount;
    
    // Update template
    await updateWorkoutTemplate(templateId, {
      avgRating: Math.round(newAvgRating * 10) / 10, // Round to 1 decimal place
      ratingCount: newRatingCount,
    });
  } catch (error) {
    console.error("Error rating workout template: ", error);
    throw new Error("Failed to rate workout template");
  }
};

export const getPopularWorkoutTemplates = async (limit: number = 10): Promise<WorkoutTemplate[]> => {
  try {
    const q = query(
      collection(db, firebaseCollection.workoutTemplates),
      where("isPublic", "==", true),
      orderBy("timesUsed", "desc")
    );
    const querySnapshot = await getDocs(q);
    const templates: WorkoutTemplate[] = [];
    
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < limit) {
        const template = {
          ...doc.data(),
          id: doc.id,
        } as WorkoutTemplate;
        templates.push(template);
        count++;
      }
    });
    
    return templates;
  } catch (error) {
    console.error("Error getting popular workout templates: ", error);
    throw new Error("Failed to get popular workout templates");
  }
}; 