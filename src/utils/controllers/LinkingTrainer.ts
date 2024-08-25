import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";


// Assign a trainee to a trainer
export const assignTraineeToTrainer = async (traineeUid: string, trainerUid: string) => {
    const trainerRef = doc(db, firebaseCollection.userDetails, trainerUid);
    const traineeRef = doc(db, firebaseCollection.userDetails, traineeUid);

    const traineeDoc = await getDoc(traineeRef);
    if (traineeDoc.exists && !traineeDoc.data().linkedTrainer) {
        await updateDoc(trainerRef,{ 
            linkedTrainees: traineeDoc.data().linkedTrainer.FieldValue.arrayUnion(traineeUid)
        });
        await updateDoc(traineeRef, {
            linkedTrainer: trainerUid
        });
    } else {
        console.error('Trainee is already linked to another trainer or does not exist.');
    }
};

// Unlink a trainee from a trainer
export const unlinkTraineeFromTrainer = async (traineeUid: string, trainerUid: string) => {
    const trainerRef = doc(db, firebaseCollection.userDetails, trainerUid);
    const traineeRef = doc(db, firebaseCollection.userDetails, traineeUid);

    const trainerDoc = await getDoc(trainerRef);
    if (trainerDoc.exists) {
        await updateDoc(trainerRef, {
            linkedTrainees: trainerDoc.data().linkedTrainees.FieldValue.arrayRemove(traineeUid)
        });
    }
    await updateDoc(traineeRef, {
        linkedTrainer: null
    });
};