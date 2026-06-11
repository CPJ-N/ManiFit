import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import RazorpayCheckout from 'react-native-razorpay';
import { auth } from '../config/firebase';
import { generateOrderId, verifyPayment, recordPaymentInFirestore, addSubscription, updateSubscription } from '../utils/controllers/billingController';
import { scheduleTestNotification, requestNotificationPermissions, configureNotifications, scheduleMonthlyNotification } from '../utils/notificationHandler';
import RadioForm from 'react-native-simple-radio-button';
import { useSelector } from 'react-redux';

export default function CheckoutScreen() {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector(state => state.user);
  const [amount, setAmount] = useState(10000 * 100);
  const [paymentDesc, setPaymentDesc] = useState('Personal Training - ₹10000');

  const radio_props = [
    { label: 'Personal Training - ₹10000', value: 10000 },
    { label: 'Exercise Routines - ₹4000', value: 4000 },
    { label: 'Meal Plans - ₹2000', value: 2000 },
    { label: 'Exercise Routine & Meal Plans - ₹5000', value: 5000 }
  ];

  useEffect(() => {
    requestNotificationPermissions();
    configureNotifications();
  }, []);

  const schedulePaymentReminder = async () => {
    try {
      const dueDate = new Date();
      // Schedule the next payment reminder for next month
      await scheduleMonthlyNotification(
        'Payment Reminder',
        `Your ${paymentDesc} payment of ₹${amount/100} is due today.`,
        dueDate
      );
      console.log('Payment reminder scheduled successfully');
    } catch (error) {
      console.error('Error scheduling payment reminder:', error);
    }
  };

  const handleSubscription = async () => {
    try {
      if (userInfo.isSubscribed) {
        // Update existing subscription
        await updateSubscription(userInfo.subscriptionId, {
          plan: paymentDesc,
          amount: amount/100,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        });
        console.log('Subscription updated successfully');
      } else {
        // Create new subscription
        const newSubscription = {
          userId: auth.currentUser?.uid,
          plan: paymentDesc,
          amount: amount/100,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        };
        await addSubscription(newSubscription);
        console.log('Subscription added successfully');
      }
    } catch (error) {
      console.error('Error handling subscription:', error);
    }
  };

  const handlePayment = async () => {
    try {
      console.log('Initiating payment...');
      setLoading(true);
      const orderId = await generateOrderId(amount);
      console.log('Order ID generated:', orderId);

      const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/manifit-41d91.appspot.com/o/manifit-logo%2FManiFit%20Logo.png?alt=media';

      const options = {
        key: Constants.expoConfig.extra.razorpayApiKeyId,
        amount: amount,
        currency: 'INR',
        name: 'ManiFit Gym',
        description: paymentDesc,
        image: imageUrl,
        order_id: orderId,
        prefill: {
          email: auth.currentUser?.email ?? '',
          contact: userInfo?.mobileNumber ?? '',
          name: userInfo?.fullName ?? ''
        },
        theme: { color: '#FFD20A' }
      };

      try {
        const data = await RazorpayCheckout.open(options);
        console.log('Payment successful!');
        Alert.alert('Success', `Payment successful! Payment Amount: ₹${amount/100}`);
        await verifyPayment(data);
        await recordPaymentInFirestore(data, amount, paymentDesc);
        await handleSubscription();
        await schedulePaymentReminder();
      } catch (error) {
        console.error('Payment failed:', error);
        Alert.alert('Error', 'Payment failed');
      }
    } catch (error) {
      console.error('Error initiating payment:', error.message);
      Alert.alert('Error', 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <RadioForm
        radio_props={radio_props}
        initial={0}
        onPress={(value, index) => {
          setAmount(value * 100);
          setPaymentDesc(radio_props[index].label);
        }}
        buttonColor={'#FFD20A'}
        selectedButtonColor={'#FFD20A'}
        labelStyle={{ fontSize: 16, color: '#FFFFFF', marginBottom: 10 }}
        formHorizontal={false}
        animation={true}
      />
      {loading ? 
        <ActivityIndicator size="large" color="#FFD20A" /> :
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  payButton: {
    backgroundColor: '#FFD20A',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  payButtonText: {
    textAlign: 'center',
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});