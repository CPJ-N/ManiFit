import { getDocs, query, collection, where } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

// Assign a trainee to a trainer
export const assignTraineeToTrainer = async (traineeUid: string, trainerUid: string) => {
    const functions = getFunctions();
    const linkTraineeToTrainer = httpsCallable(functions, 'linkTraineeToTrainer');
    await linkTraineeToTrainer({ traineeUid, trainerUid });
    console.log(`Trainee link requested. Trainer: ${trainerUid}, Trainee: ${traineeUid}`);
};

// Unlink a trainee from a trainer
export const unlinkTraineeFromTrainer = async (traineeUid: string, trainerUid: string) => {
    const functions = getFunctions();
    const unlinkTrainee = httpsCallable(functions, 'unlinkTraineeFromTrainer');
    await unlinkTrainee({ traineeUid, trainerUid });
    console.log(`Trainee unlink requested. Trainer: ${trainerUid}, Trainee: ${traineeUid}`);
};

// Get all unlinked trainees
export const getAllUnlinkedTrainees = async () => {
    const q = query(
        collection(db, firebaseCollection.userDetails),
        where("isTrainer", "==", false),
        where("linkedTrainer", "==", '')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
};

// Get all unlinked trainees
export const getAlllinkedTrainees = async ( trainerUid: string ) => {
    const q = query(
        collection(db, firebaseCollection.userDetails),
        where("isTrainer", "==", false),
        where("linkedTrainer", "==", trainerUid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
};


//get all user with isTrainer = true
export const getAllTrainers = async () => {
    const q = query(
        collection(db, firebaseCollection.userDetails),
        where("isTrainer", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
};
