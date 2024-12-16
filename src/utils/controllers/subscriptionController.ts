import { addDoc, collection, doc, updateDoc, query, getDocs, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { firebaseCollection } from "../../constants/firebaseContant";
import { Subscription } from "../../constants/dataModels/subscription.model";

// Add a new subscription
export const addSubscription = async (subscription: Subscription) => {
    try {
        const docRef = await addDoc(collection(db, firebaseCollection.subscriptions), subscription);
        const userRef = doc(db, firebaseCollection.userDetails, subscription.userId);
        await updateDoc(userRef, {
            isSubscribed: true,
            subscriptionId: docRef.id
        });
        console.log("Subscription added with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding subscription: ", e);
    }
};

// Update an existing subscription
export const updateSubscription = async (subscriptionId: string, updatedData: Partial<Subscription>): Promise<void> => {
    try {
        const subscriptionRef = doc(db, firebaseCollection.subscriptions, subscriptionId);
        await updateDoc(subscriptionRef, updatedData);
        console.log("Subscription updated successfully");
    } catch (error) {
        console.error("Error updating subscription: ", error);
    }
};

// Get subscription with specific userId
export const getSubscriptionByUserId = async (userId: string) => {
    try {
        const q = query(collection(db, firebaseCollection.subscriptions), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const doc = querySnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        };
    } catch (error) {
        console.error("Error getting subscription: ", error);
        throw new Error("Failed to get subscription");
    }
};
