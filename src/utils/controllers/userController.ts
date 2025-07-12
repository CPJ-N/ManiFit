import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { firebaseCollection } from '../../constants/firebaseContant';
import { createDocument, getDocument, updateDocument, deleteDocument } from '../firestore';

export const createUser = async (userInfo: UserDetails, userId: string): Promise<void> => {
    console.log('📥 Creating user document:', {
        userId,
        email: userInfo.email,
        fullName: userInfo.fullName
    });
    
    try {
        await createDocument(firebaseCollection.userDetails, userId, userInfo);
        console.log('✅ User document created successfully');
    } catch (error) {
        console.error('💥 Failed to create user document:', error);
        throw error;
    }
};

export const updateUser = async (userId: string, userInfo: Partial<UserDetails>): Promise<void> => {
    console.log('📝 Updating user document:', userId);
    
    try {
        await updateDocument(firebaseCollection.userDetails, userId, userInfo);
        console.log('✅ User document updated successfully');
    } catch (error) {
        console.error('💥 Failed to update user document:', error);
        throw error;
    }
};

export const deleteUserDocument = async (userId: string): Promise<void> => {
    console.log('🗑️ Deleting user document:', userId);
    
    try {
        await deleteDocument(firebaseCollection.userDetails, userId);
        console.log('✅ User document deleted successfully');
    } catch (error) {
        console.error('💥 Failed to delete user document:', error);
        throw error;
    }
};

export const getUser = async (userId: string): Promise<UserDetails | null> => {
    console.log('📥 Fetching user document:', userId);
    
    try {
        const user = await getDocument<UserDetails>(firebaseCollection.userDetails, userId);
        if (user) {
            console.log('✅ User document found:', {
                fullName: user.fullName,
                email: user.email
            });
            return { ...user, uid: userId };
        } else {
            console.log('❌ User document not found');
            return null;
        }
    } catch (error) {
        console.error('💥 Failed to fetch user document:', error);
        throw error;
    }
};

export const getUserByEmail = async (email: string): Promise<UserDetails | null> => {
    console.log('📥 Fetching user by email:', email);
    
    try {
        const user = await getDocument<UserDetails>(firebaseCollection.userDetails, email);
        if (user) {
            console.log('✅ User found by email:', user.fullName);
            return { ...user, uid: user.id };
        } else {
            console.log('❌ User not found by email');
            return null;
        }
    } catch (error) {
        console.error('💥 Failed to fetch user by email:', error);
        throw error;
    }
};


