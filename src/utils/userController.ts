import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../constants/dataModels/userInfo.model';

// TO DO: Test out these api calls in  app

// Create user info
const createUser = async (userInfo: User) => {
    try {
        const docRef = await addDoc(collection(db, 'userInfo'), userInfo);
        console.log('User created with ID: ', docRef.id);
    } catch (error) {
        console.error('Error creating user: ', error);
    }
};

// Update user info
const updateUser = async (userId: string, updatedInfo: Partial<User>) => {
    try {
        const userDocRef = await doc(db, 'userInfo', userId); 
        await updateDoc(userDocRef, updatedInfo);
        console.log('User updated successfully');
    } catch (error) {
        console.error('Error updating user: ', error);
    }
};

// Delete user info
const deleteUser = async (userId: string) => {
    try {
        const userDocRef = await doc(db, 'userInfo', userId); 
        await deleteDoc(userDocRef);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user: ', error);
    }
};

// Get user info
const getUser = async (userId: string) => {
    try {
        const userDocSnap = await getDoc(doc(db, 'userInfo', userId)); 
        if (userDocSnap.exists()) {
            const userInfo = userDocSnap.data() as User;
            console.log('User info: ', userInfo);
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error getting user: ', error);
    }
};

export { createUser, updateUser, deleteUser, getUser };


