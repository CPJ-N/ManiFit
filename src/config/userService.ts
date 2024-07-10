import { db } from './firebase';
import { User } from '../constants/dataModels/userInfo.model';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Function to save user data
export const saveUser = async (user: User) => {
  const { uid, ...userData } = user;
  await setDoc(doc(db, 'users', uid), userData, { merge: true });
};

// Function to fetch user data
export const getUser = async (uid: string): Promise<User | undefined> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid, ...docSnap.data() } as User;
  }
  return undefined;
};