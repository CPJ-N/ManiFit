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
    console.warn('⚠️ Empty document ID provided');
    return null;
  }

  console.log(`📥 Fetching document: ${collection}/${id}`);

  try {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(`✅ Document found: ${collection}/${id}`);
      return { ...docSnap.data(), id } as T;
    } else {
      console.log(`❌ Document not found: ${collection}/${id}`);
      return null;
    }
  } catch (error: any) {
    console.error(`💥 Firestore error for ${collection}/${id}:`, {
      code: error.code,
      message: error.message
    });
    
    if (isOfflineError(error)) {
      console.warn('🌐 App is offline');
      return null;
    }
    
    if (error.code === 'permission-denied') {
      console.warn('🚫 Permission denied - user may not be authenticated');
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