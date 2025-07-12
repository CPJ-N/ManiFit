import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface FirestoreError extends Error {
  code: string;
}

export const isOfflineError = (error: any): boolean => {
  return error.code === 'unavailable' || 
         error.code === 'offline' || 
         error.message?.includes('offline');
};

export const createDocument = async <T extends Record<string, any>>(
  collection: string, 
  id: string, 
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collection, id);
    await setDoc(docRef, data);
  } catch (error) {
    throw new Error(`Failed to create document in ${collection}`);
  }
};

export const getDocument = async <T>(
  collection: string, 
  id: string
): Promise<T | null> => {
  if (!id?.trim()) {
    return null;
  }

  try {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { ...docSnap.data(), id } as T;
    }
    
    return null;
  } catch (error: any) {
    console.error(`Firestore error for ${collection}/${id}:`, error.code, error.message);
    
    if (isOfflineError(error)) {
      return null;
    }
    
    if (error.code === 'permission-denied') {
      console.warn('Permission denied - user may not be authenticated');
      return null;
    }
    
    throw new Error(`Failed to get document from ${collection}`);
  }
};

export const updateDocument = async <T extends Record<string, any>>(
  collection: string, 
  id: string, 
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collection, id);
    await updateDoc(docRef, data as any);
  } catch (error) {
    throw new Error(`Failed to update document in ${collection}`);
  }
};

export const deleteDocument = async (
  collection: string, 
  id: string
): Promise<void> => {
  try {
    const docRef = doc(db, collection, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(`Failed to delete document from ${collection}`);
  }
};