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

import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

const RazorpayCheckout: React.FC = () => {
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webViewContent, setWebViewContent] = useState<string | null>(null);

  // Replace with your actual Razorpay key
  const razorpayKey: string = 'YOUR_RAZORPAY_KEY';

  const generateOrderId = async (): Promise<string> => {
    try {
      const response = await fetch('YOUR_BACKEND_API/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100 * 100, // amount in smallest currency unit (e.g., paise)
          currency: 'INR',
        }),
      });
      const order: OrderResponse = await response.json();
      return order.id;
    } catch (error) {
      console.error('Error generating order:', error);
      throw error;
    }
  };

  const handlePayment = async (): Promise<void> => {
    try {
      const orderId = await generateOrderId();
      setShowWebView(true);

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: '10000', // Amount in smallest currency unit
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Purchase Description',
        order_id: orderId,
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'User Name'
        },
        theme: { color: '#F37254' }
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
            var rzp = new Razorpay(options);
            rzp.open();
            
            rzp.on('payment.success', function(response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'SUCCESS',
                data: response
              }));
            });
            
            rzp.on('payment.error', function(response) {
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
      Alert.alert('Error', 'Failed to initiate payment');
      throw error;
    }
  };

  const handleWebViewMessage = (event: WebViewMessageEvent): void => {
    try {
      const response: WebViewMessage = JSON.parse(event.nativeEvent.data);
      
      if (response.type === 'SUCCESS') {
        const paymentData = response.data as RazorpayResponse;
        Alert.alert('Success', `Payment successful! Payment ID: ${paymentData.razorpay_payment_id}`);
        // Handle successful payment
        setShowWebView(false);
        
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
        <Button title="Pay Now" onPress={() => handlePayment()} />
      ) : (
        webViewContent && (
          <WebView
            source={{ html: webViewContent }}
            onMessage={handleWebViewMessage}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
    width: '100%',
  },
});

export default RazorpayCheckout;