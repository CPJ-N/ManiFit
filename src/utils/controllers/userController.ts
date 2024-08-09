import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc, } from 'firebase/firestore';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { db } from '../../config/firebase';
import { USER_DETAILS } from '../../constants/firebaseCollections';

// TODO: Test out these api calls in  app

// Create user info
const createUser = async (userInfo: UserDetails, userId: string) => {
    try {
        console.log(userInfo);
        // const docRef = await addDoc(collection(db, USER_DETAILS), userInfo);
        const docRef = await setDoc(doc(collection(db, USER_DETAILS), userId), userInfo);
        console.log('User created with ID: ', docRef);
    } catch (error) {
        console.error('Error creating user: ', error);
    }
};

// Update user info
const updateUser = async (userId: string, updatedInfo: Partial<UserDetails>) => {
    try {
        const userDocRef = await doc(db, USER_DETAILS, userId); 
        await updateDoc(userDocRef, updatedInfo);
        console.log('User updated successfully');
    } catch (error) {
        console.error('Error updating user: ', error);
    }
};

// Delete user info
const deleteUser = async (userId: string) => {
    try {
        const userDocRef = await doc(db, USER_DETAILS, userId); 
        await deleteDoc(userDocRef);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user: ', error);
    }
};

// Get user info
const getUser = async (userId: string) => {
    try {
        const userDocSnap = await getDoc(doc(db, USER_DETAILS, userId)); 
        if (userDocSnap.exists()) {
            const userInfo = userDocSnap.data() as UserDetails;
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
        const userDocSnap = await getDoc(doc(db, USER_DETAILS, email)); 
        if (userDocSnap.exists()) {
            const userInfo = userDocSnap.data() as UserDetails;
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

export { createUser, updateUser, deleteUser, getUser };


