import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseCollection } from "../../constants/firebaseContant";
import { db } from "../../config/firebase";

// Client-side billing code is read-only. Subscription creation, payment
// verification, and ledger writes must be handled by Cloud Functions.

export const getUserSubscriptions = async (userId: string) => {
    try {
        const subscriptionsRef = collection(db, firebaseCollection.subscriptions);
        const q = query(subscriptionsRef, where("clientId", "==", userId));
        const querySnapshot = await getDocs(q);

        const subscriptions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log('User subscriptions:', subscriptions);
        return subscriptions;
    } catch (error) {
        console.error('Error getting user subscriptions:', error);
        throw error;
    }
};

export const getSubscriptionByUserId = async (userId: string) => {
    try {
        const subscriptionsRef = collection(db, firebaseCollection.subscriptions);
        const q = query(subscriptionsRef, where("clientId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const subscriptionDoc = querySnapshot.docs[0];
        return {
            id: subscriptionDoc.id,
            ...subscriptionDoc.data(),
        };
    } catch (error) {
        console.error("Error getting subscription: ", error);
        throw new Error("Failed to get subscription");
    }
};

export const getSubscriptionsByTrainerId = async (trainerId: string) => {
    try {
        const subscriptionsRef = collection(db, firebaseCollection.subscriptions);
        const q = query(subscriptionsRef, where("trainerId", "==", trainerId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error getting trainer subscriptions: ", error);
        throw new Error("Failed to get trainer subscriptions");
    }
};

export const getTransactionsByTrainerId = async (trainerId: string) => {
    try {
        const transactionsRef = collection(db, firebaseCollection.transactionDetails);
        const q = query(transactionsRef, where("trainerId", "==", trainerId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error getting trainer transactions: ", error);
        throw new Error("Failed to get trainer transactions");
    }
};
