import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import RazorpayCheckout from 'react-native-razorpay';
import { auth } from '../config/firebase';
import { generateOrderId, verifyPayment, recordPaymentInFirestore } from '../utils/controllers/paymentController';
import RadioForm from 'react-native-simple-radio-button';
import { useSelector } from 'react-redux';

// TODO: Implement functionality to record successful payments in Firebase database

export default function RazorpayCheckoutScreen() {
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

  const handlePayment = async () => {
    try {
      console.log('Initiating payment...');
      setLoading(true);
      const orderId = await generateOrderId(amount);
      console.log('Order ID generated:', orderId);

      const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/manifit-41d91.appspot.com/o/manifit-logo%2FManiFit%20Logo.png?alt=media';

      const options = {
        key: Constants.expoConfig.extra.razorpayApiKeyId,
        amount: amount, // Amount in smallest currency unit in paise
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

      RazorpayCheckout.open(options).then(async (data) => {
        // handle success
        console.log(`Payment successful!`);
        Alert.alert('Success', `Payment successful! Payment Amount: ₹${amount}`);
        await verifyPayment(data);
        await recordPaymentInFirestore(data, amount, paymentDesc);
      }).catch((error) => {
        // handle failure
        console.error('Payment failed:', error);
        Alert.alert('Error', 'Payment failed');
      });
    } catch (error) {
      console.error('Error initiating payment:', error.message);
      Alert.alert('Error', 'Failed to initiate payment');
    } finally {
      setLoading(false);
      console.log('Payment initiation process completed.');
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
};

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