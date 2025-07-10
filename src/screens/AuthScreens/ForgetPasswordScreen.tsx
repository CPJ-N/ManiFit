import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text as GluestackText } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

export default function ForgottenPassword({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [focused, setFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for a link to reset your password.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        default:
          errorMessage = 'Failed to send reset email. Please try again.';
      }
      
      Alert.alert('Error', errorMessage);
      console.log(error.code, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#1E1E1E' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.04)', 'transparent']}
        style={{ 
          paddingTop: insets.top + 20,
          paddingBottom: 20,
        }}
      >
        <Box className="px-6">
          <HStack className="items-center mb-4">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 210, 10, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#FFD20A" />
            </TouchableOpacity>
            <Heading size="lg" style={{ color: '#FFFFFF', flex: 1 }}>
              Reset Password
            </Heading>
          </HStack>
        </Box>
      </LinearGradient>

      <Box className="flex-1 px-6">
        <VStack className="flex-1 justify-center">
          {/* Icon */}
          <Box className="items-center mb-8">
            <Box
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(255, 210, 10, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="lock-open" size={40} color="#FFD20A" />
            </Box>
            <Heading size="xl" style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: 8 }}>
              Forgot Password?
            </Heading>
            <GluestackText style={{ color: '#B0B0B0', textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
              Enter your email address and we'll send you a link to reset your password.
            </GluestackText>
          </Box>

          {/* Email Input */}
          <Card 
            className="mb-6 p-0" 
            style={{
              backgroundColor: focused ? '#333333' : '#2A2A2A',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: focused ? '#FFD20A' : 'transparent',
            }}
          >
            <Box className="p-4">
              <HStack className="items-center mb-2">
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: focused ? 'rgba(255, 210, 10, 0.2)' : 'rgba(255, 210, 10, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 8,
                  }}
                >
                  <Ionicons name="mail" size={12} color={focused ? "#FFD20A" : "#888"} />
                </Box>
                <GluestackText style={{ 
                  color: focused ? '#FFD20A' : '#888', 
                  fontSize: 12, 
                  fontWeight: '600',
                }}>
                  Email Address
                </GluestackText>
              </HStack>
              
              <TextInput
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.5)',
                  borderColor: 'rgba(255, 210, 10, 0.1)',
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: '500',
                }}
                placeholderTextColor="#666"
              />
            </Box>
          </Card>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={isLoading}
            style={{
              backgroundColor: '#FFD20A',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 16,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <HStack className="items-center">
              {isLoading && (
                <Box className="mr-2">
                  <Ionicons name="reload" size={16} color="#1E1E1E" />
                </Box>
              )}
              <Text style={{ 
                color: '#1E1E1E', 
                fontSize: 16, 
                fontWeight: '600',
              }}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </HStack>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ 
              color: '#FFD20A', 
              fontSize: 14, 
              fontWeight: '500',
            }}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  );
}