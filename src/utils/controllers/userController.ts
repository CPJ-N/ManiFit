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
    }
};

// Update user info
export const updateUser = async (userId: string, updatedInfo: Partial<UserDetails>) => {
    try {
        const userDocRef = await doc(db, firebaseCollection.userDetails, userId); 
        await updateDoc(userDocRef, updatedInfo);
        console.log('User updated successfully');
    } catch (error) {
        console.error('Error updating user: ', error);
    }
};

// Delete user info
export const deleteUserDocument = async (userId: string) => {
    try {
        const userDocRef = await doc(db, firebaseCollection.userDetails, userId); 
        await deleteDoc(userDocRef);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user: ', error);
    }
};

// Get user info
export const getUser = async (userId: string) => {
    try {
        const userDocSnap = await getDoc(doc(db, firebaseCollection.userDetails, userId)); 
        if (userDocSnap.exists()) {
            const userInfo = {...userDocSnap.data() as UserDetails, uid: userDocSnap.id};
            console.log('User info: ', userInfo);
            return userInfo;
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error getting user: ', error);
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
    } catch (error) {
        console.error('Error getting user: ', error);
    }
};


