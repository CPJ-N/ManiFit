import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, deleteDoc, getDoc, query, where } from "firebase/firestore";
import Constants from 'expo-constants';
import { encode } from 'base-64';
import CryptoJS from 'crypto-js';
import { firebaseCollection } from "../../constants/firebaseContant";
import { auth } from "../../config/firebase";
import { db } from "../../config/firebase";

interface OrderResponse {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    notes: Record<string, string>;
    created_at: number;
}

export const generateOrderId = async (amount: number): Promise<string> => {
    try {
        const response = await fetch(`${Constants.expoConfig?.extra?.razorpayApiUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encode(`${Constants.expoConfig?.extra?.razorpayApiKeyId}:${Constants.expoConfig?.extra?.razorpayApiKeySecret}`)}`,
            },
            body: JSON.stringify({
                amount: amount, // amount in smallest currency unit (e.g., paise)
                currency: 'INR',
                receipt: 'receipt#1',
                notes: {
                    key1: 'value3',
                    key2: 'value2',
                },
            }),
        });

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
            console.error(`Server error ${response.status}: ${responseText}`);
            throw new Error(`Server error ${response.status}: ${responseText}`);
        }

        const order: OrderResponse = JSON.parse(responseText);
        console.log('Order response:', order);
        return order.id;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error generating order:', error.message);
        } else {
            console.error('Error generating order:', error);
        }
        throw error;
    }
};

export const verifyPayment = async (paymentData: any): Promise<void> => {
    try {
        const razorpayOrderId = paymentData.razorpay_order_id;
        const razorpayPaymentId = paymentData.razorpay_payment_id;
        const razorpaySignature = paymentData.razorpay_signature

        const secret = Constants.expoConfig?.extra?.razorpayApiKeySecret;
        const payload = `${razorpayOrderId}|${razorpayPaymentId}`;

        console.log('Payload:', payload);
        console.log('Using Razorpay Secret:', secret);
        console.log('Razorpay Signature:', razorpaySignature);

        const generatedSignature = CryptoJS.HmacSHA256(payload, secret).toString(CryptoJS.enc.Hex);
        console.log('Generated Signature:', generatedSignature);

        if (generatedSignature === razorpaySignature) {
            console.log('Payment verified successfully!');
        } else {
            throw new Error('Payment verification failed! Invalid signature.');
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};

export const recordPaymentInFirestore = async (paymentData: any, amount: number, paymentDesc: string) => {
    try {
      const transactionRef = collection(db, firebaseCollection.transactionDetails);
      await addDoc(transactionRef, {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        amount: amount,
        currency: 'INR',
        paymentId: paymentData.razorpay_payment_id,
        orderId: paymentData.razorpay_order_id,
        description: paymentDesc,
        status: 'success',
        timestamp: new Date(),
      });
      console.log('Payment recorded in Firestore');
    } catch (error) {
      console.error('Error recording payment in Firestore:', error);
    }
};

export const getUserSubscriptions = async (userId: string) => {
    try {
        const subscriptionsRef = collection(db, firebaseCollection.subscriptions);
        const q = query(subscriptionsRef, where("userId", "==", userId));
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