import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { useSelector } from 'react-redux';
import { auth } from '../config/firebase';
import { createSubscriptionIntent } from '../utils/controllers/billingClient';

export default function CheckoutScreen() {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector(state => state.user);

  const handlePayment = async () => {
    if (!userInfo) {
      Alert.alert('Profile required', 'Please sign in again before subscribing.');
      return;
    }

    try {
      setLoading(true);
      const subscription = await createSubscriptionIntent();

      if (!subscription.subscriptionId) {
        throw new Error('Subscription was not created.');
      }

      const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/manifit-41d91.appspot.com/o/manifit-logo%2FManiFit%20Logo.png?alt=media';
      const options = {
        key: Constants.expoConfig?.extra?.razorpayApiKeyId,
        subscription_id: subscription.subscriptionId,
        name: 'ManiFit Gym',
        description: subscription.description || 'ManiFit monthly subscription',
        image: imageUrl,
        prefill: {
          email: auth.currentUser?.email ?? '',
          contact: userInfo?.mobileNumber ?? '',
          name: userInfo?.fullName ?? ''
        },
        theme: { color: '#FFD20A' }
      };

      const { default: RazorpayCheckout } = await import('react-native-razorpay');
      await RazorpayCheckout.open(options);
      Alert.alert(
        'Activation pending',
        'Your mandate was submitted. Access will update once the payment webhook confirms the subscription.'
      );
    } catch (error) {
      console.error('Subscription checkout failed:', error);
      Alert.alert(
        'Subscription unavailable',
        'We could not start subscription checkout. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.description}>
          Your trainer-set monthly plan will be shown in Razorpay before confirmation.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD20A" />
      ) : (
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Subscribe</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 24,
  },
  summary: {
    maxWidth: 360,
    marginBottom: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: '#B0B0B0',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
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
