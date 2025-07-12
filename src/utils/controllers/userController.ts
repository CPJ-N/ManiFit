import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { firebaseCollection } from '../../constants/firebaseContant';
import { createDocument, getDocument, updateDocument, deleteDocument } from '../firestore';

export const createUser = async (userInfo: UserDetails, userId: string): Promise<void> => {
    await createDocument(firebaseCollection.userDetails, userId, userInfo);
};

export const updateUser = async (userId: string, userInfo: Partial<UserDetails>): Promise<void> => {
    await updateDocument(firebaseCollection.userDetails, userId, userInfo);
};

export const deleteUserDocument = async (userId: string): Promise<void> => {
    await deleteDocument(firebaseCollection.userDetails, userId);
};

export const getUser = async (userId: string): Promise<UserDetails | null> => {
    const user = await getDocument<UserDetails>(firebaseCollection.userDetails, userId);
    return user ? { ...user, uid: userId } : null;
};

export const getUserByEmail = async (email: string): Promise<UserDetails | null> => {
    const user = await getDocument<UserDetails>(firebaseCollection.userDetails, email);
    return user ? { ...user, uid: user.id } : null;
};


