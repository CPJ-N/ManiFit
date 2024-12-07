import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { auth } from '../config/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reduxStore';
import * as Notifications from 'expo-notifications';
import { generateOrderId } from '../utils/controllers/paymentController';
import { RAZORPAY_API_KEY_ID } from '@env'

// Types for Razorpay
interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
}

interface WebViewMessage {
  type: 'SUCCESS' | 'ERROR';
  data: RazorpayResponse | PaymentErrorResponse;
}

interface OrderResponse {
  id: string;
  // Add other order properties as needed
}

// Function to schedule monthly notifications
const scheduleMonthlyNotification = async (title: string, body: string, dueDate: Date) => {
  const trigger = new Date(dueDate);
  trigger.setMonth(trigger.getMonth() + 1); // Schedule for next month

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      date: trigger,
      repeats: true,
    },
  });
};

const RazorpayCheckout: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePayment = async (): Promise<void> => {
    try {
      console.log('Initiating payment...');
      setLoading(true);
      const orderId = await generateOrderId();
      console.log('Order ID generated:', orderId);
      setShowWebView(true);

      const options: RazorpayOptions = {
        key: RAZORPAY_API_KEY_ID,
        amount: '10000', // Amount in smallest currency unit
        currency: 'INR',
        name: 'ManiFit Gym',
        description: 'Base Subscription',
        order_id: orderId,
        prefill: {
          email: auth.currentUser?.email ?? '',
          contact: userInfo.mobileNumber ?? '',
          name: userInfo.fullName ?? ''
        },
        theme: { color: '#FFD20A' }
      };

      const webViewContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </head>
        <body>
          <script>
            var options = ${JSON.stringify(options)};
            console.log('Razorpay options:', options);
            var rzp = new Razorpay(options);
            rzp.open();
            
            rzp.on('payment.success', function(response) {
              console.log('Payment successful:', response);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'SUCCESS',
                data: response
              }));
            });
            
            rzp.on('payment.error', function(response) {
              console.log('Payment failed:', response);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ERROR',
                data: response
              }));
            });
          </script>
        </body>
        </html>
      `;

      setWebViewContent(webViewContent);
    } catch (error) {
      console.error('Error initiating payment:', error.message);
      Alert.alert('Error', 'Failed to initiate payment');
      throw error;
    } finally {
      setLoading(false);
      console.log('Payment initiation process completed.');
    }
  };

  const handleWebViewMessage = async (event: WebViewMessageEvent): Promise<void> => {
    try {
      const response: WebViewMessage = JSON.parse(event.nativeEvent.data);
      
      if (response.type === 'SUCCESS') {
        const paymentData = response.data as RazorpayResponse;
        Alert.alert('Success', `Payment successful! Payment ID: ${paymentData.razorpay_payment_id}`);
        // Handle successful payment
        setShowWebView(false);

        // Schedule monthly notification
        const dueDate = new Date(); // Set the due date to the current date
        await scheduleMonthlyNotification(
          'Payment Reminder',
          'Your subscription payment is due today.',
          dueDate
        );

        // You might want to verify the payment on your backend
        verifyPayment(paymentData);
      } else if (response.type === 'ERROR') {
        const errorData = response.data as PaymentErrorResponse;
        Alert.alert('Error', `Payment failed: ${errorData.description}`);
        // Handle payment failure
        setShowWebView(false);
      }
    } catch (error) {
      console.error('Error processing payment response:', error);
    }
  };

  const verifyPayment = async (paymentData: RazorpayResponse): Promise<void> => {
    try {
      const response = await fetch('YOUR_BACKEND_API/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      const result = await response.json();
      if (!result.success) {
        Alert.alert('Warning', 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      Alert.alert('Error', 'Failed to verify payment');
    }
  };

  return (
    <View style={styles.container}>
      {!showWebView ? (
        <TouchableOpacity style={styles.payButton} onPress={() => handlePayment()}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      ) : (
        webViewContent && (
          <WebView
            source={{ html: webViewContent }}
            onMessage={handleWebViewMessage}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FFD20A" />
              </View>
            )}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
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
  webview: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RazorpayCheckout;