import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc, } from 'firebase/firestore';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { db } from '../../config/firebase';
import { firebaseCollection } from '../../constants/firebaseContant';

// Create user info
export const createUser = async (userInfo: UserDetails, userId: string) => {
    try {
        console.log(userInfo);
        // const docRef = await addDoc(collection(db, firebaseCollection.userDetails), userInfo);
        const docRef = await setDoc(doc(collection(db, firebaseCollection.userDetails), userId), userInfo);
        console.log('User created with ID: ', docRef);
    } catch (error) {
        console.error('Error creating user: ', error);
        throw error;
    }
};

// Update user info
export const updateUser = async (userId: string, userInfo: Partial<UserDetails>) => {
    try {
        const userDocRef = doc(db, firebaseCollection.userDetails, userId);
        await updateDoc(userDocRef, userInfo);
        console.log('User updated: ', userId);
    } catch (error) {
        console.error('Error updating user: ', error);
        throw error;
    }
};

// Delete user document
export const deleteUserDocument = async (userId: string) => {
    try {
        const userDocRef = doc(db, firebaseCollection.userDetails, userId);
        await deleteDoc(userDocRef);
        console.log('User document deleted: ', userId);
    } catch (error) {
        console.error('Error deleting user document: ', error);
        throw error;
    }
};

// Get user info with better error handling
export const getUser = async (userId: string): Promise<UserDetails | null> => {
    try {
        const userDocSnap = await getDoc(doc(db, firebaseCollection.userDetails, userId)); 
        if (userDocSnap.exists()) {
            const userInfo = {...userDocSnap.data() as UserDetails, uid: userDocSnap.id};
            console.log('User info retrieved: ', userInfo);
            return userInfo;
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error: any) {
        console.error('Error getting user: ', error);
        
        // Handle offline errors more gracefully  
        if (error.code === 'unavailable' || error.message.includes('offline')) {
            console.warn('Firebase is offline, user data may not be current');
            // You could return cached data here if you implement caching
            return null;
        }
        
        // Re-throw other errors
        throw error;
    }
};

//get user using their email this is inside the doc
export const getUserByEmail = async (email: string) => {
    try {
        const userDocSnap = await getDoc(doc(db, firebaseCollection.userDetails, email)); 
        if (userDocSnap.exists()) {
            const userInfo = {...userDocSnap.data() as UserDetails, uid: userDocSnap.id};
            console.log('User info: ', userInfo);
            return userInfo;
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error: any) {
        console.error('Error getting user: ', error);
        
        // Handle offline errors more gracefully  
        if (error.code === 'unavailable' || error.message.includes('offline')) {
            console.warn('Firebase is offline, user data may not be current');
            return null;
        }
        
        throw error;
    }
};


