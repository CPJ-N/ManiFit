import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Animated, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { LOGIN } from '../../constants/screenNames';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getUser } from '../../utils/controllers/userController';
import Constants from 'expo-constants';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

// Compact Form Field Component
const FormField = ({ 
  label,
  value, 
  onChangeText, 
  placeholder, 
  icon,
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  focused,
  onFocus,
  onBlur,
  error = false,
  animatedValue,
  index = 0
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  error?: boolean;
  animatedValue: Animated.Value;
  index?: number;
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [{ 
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [20 + (index * 5), 0]
        })
      }]
    }}
  >
    <Card 
      className="mb-3 p-0" 
      style={{
        backgroundColor: focused ? '#333333' : '#2A2A2A',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: error ? '#FF6B6B' : focused ? '#FFD20A' : 'transparent',
        shadowColor: focused ? '#FFD20A' : '#000',
        shadowOffset: { width: 0, height: focused ? 4 : 2 },
        shadowOpacity: focused ? 0.2 : 0.1,
        shadowRadius: focused ? 8 : 4,
        elevation: focused ? 4 : 2,
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
            <Ionicons 
              name={icon as any} 
              size={12} 
              color={focused ? "#FFD20A" : "#888"} 
            />
          </Box>
          <Text style={{ 
            color: focused ? '#FFD20A' : '#888', 
            fontSize: 12, 
            fontWeight: '600',
            flex: 1,
          }}>
            {label}
          </Text>
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={onTogglePassword}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 210, 10, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={12}
                color={focused ? "#FFD20A" : "#888"}
              />
            </TouchableOpacity>
          )}
        </HStack>
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
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
  </Animated.View>
);

// Compact Error Message Component
const ErrorMessage = ({ 
  message, 
  animatedValue 
}: {
  message: string;
  animatedValue: Animated.Value;
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [{ 
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0]
        })
      }]
    }}
  >
    <LinearGradient
      colors={['rgba(255, 107, 107, 0.15)', 'rgba(255, 107, 107, 0.05)']}
      style={{
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#FF6B6B',
      }}
    >
      <HStack className="items-center">
        <Box
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
          }}
        >
          <Ionicons name="alert-circle" size={12} color="#FF6B6B" />
        </Box>
        <Text style={{ color: '#FF6B6B', fontSize: 13, fontWeight: '500', flex: 1 }}>
          {message}
        </Text>
      </HStack>
    </LinearGradient>
  </Animated.View>
);

// Compact Action Button Component
const ActionButton = ({ 
  title, 
  onPress, 
  isLoading = false, 
  loadingText = 'Loading...', 
  variant = 'primary',
  animatedValue,
  disabled = false 
}: {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary';
  animatedValue: Animated.Value;
  disabled?: boolean;
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [{ 
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1]
        })
      }]
    }}
  >
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: variant === 'primary' ? '#FFD20A' : '#666',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: variant === 'primary' ? 0.2 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        opacity: (isLoading || disabled) ? 0.7 : 1,
        marginBottom: 12,
      }}
      activeOpacity={0.9}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={['#FFD20A', '#FFA500']}
          style={{
            padding: 16,
            alignItems: 'center',
          }}
        >
          <HStack className="items-center">
            {isLoading && (
              <Animated.View 
                style={{ 
                  marginRight: 8,
                  transform: [{ rotate: '360deg' }] 
                }}
              >
                <Ionicons name="refresh" size={16} color="#1E1E1E" />
              </Animated.View>
            )}
            <Text style={{ color: '#1E1E1E', fontSize: 15, fontWeight: '700' }}>
              {isLoading ? loadingText : title}
            </Text>
          </HStack>
        </LinearGradient>
      ) : (
        <View
          style={{
            backgroundColor: '#2A2A2A',
            borderWidth: 1,
            borderColor: '#444',
            padding: 16,
            alignItems: 'center',
          }}
        >
          <HStack className="items-center">
            <Ionicons name="logo-google" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
              {title}
            </Text>
          </HStack>
        </View>
      )}
    </TouchableOpacity>
  </Animated.View>
);

export default function SignUp({ navigation }: { navigation: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const insets = useSafeAreaInsets();

  // Enhanced Animation values
  const fadeAnim = new Animated.Value(0);
  const errorAnim = new Animated.Value(0);

  useEffect(() => {
    // Simple fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (error) {
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      errorAnim.setValue(0);
    }
  }, [error]);

  // Google Auth configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleWebClientId,
    iosClientId: Constants.expoConfig?.extra?.firebaseIosClientId,
    androidClientId: Constants.expoConfig?.extra?.firebaseAndroidClientId,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        setIsLoading(true);
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then(async (userCredential) => {
            const user = userCredential.user;
            console.log('✅ Google sign-in successful:', user.email);
            
            // Check if user profile exists
            const userInfo = await getUser(user.uid);
            if (!userInfo) {
              console.log('📝 User needs to complete profile - auth flow will handle navigation');
              // The auth state change in App.tsx will handle navigation to UserDetailsForm
            } else {
              console.log('✅ User profile found, navigation will be handled by auth state change');
            }
          })
          .catch((error: any) => {
            console.error('💥 Error during Google sign-in:', error);
            let errorMessage = 'Google Sign-Up failed. Try again later.';
            
            switch (error.code) {
              case 'auth/account-exists-with-different-credential':
                errorMessage = 'An account already exists with this email using a different sign-in method.';
                break;
              case 'auth/invalid-credential':
                errorMessage = 'Invalid Google credentials. Please try again.';
                break;
              case 'auth/operation-not-allowed':
                errorMessage = 'Google sign-in is not enabled. Please contact support.';
                break;
              default:
                errorMessage = 'Google Sign-Up failed. Please try again.';
            }
            
            setError(errorMessage);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else if (response?.type === 'error') {
      console.error('❌ Google sign-in error:', response.error);
      setError('Google Sign-Up was cancelled or failed. Please try again.');
      setIsLoading(false);
    }
  }, [response]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    setError('');

    if (!userEmail.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(userEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!userPassword.trim()) {
      setError('Password is required');
      return;
    }

    if (!validatePassword(userPassword)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      const user = userCredential.user;
      console.log('Account created successfully, auth state change will handle navigation');
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Try logging in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = 'Failed to create account. Please try again.';
      }
      
      setError(errorMessage);
      console.log(errorCode, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpWithGoogle = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Error during Google sign-up:', error);
      setError('Google Sign-Up failed. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ 
        flex: 1, 
        backgroundColor: '#1E1E1E',
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />
      
      {/* Compact Header Section */}
      <Animated.View
        style={{
          opacity: fadeAnim,
        }}
      >
        <LinearGradient
          colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.04)', 'transparent']}
          style={{ 
            paddingTop: insets.top + 20,
            paddingBottom: 20,
          }}
        >
          <Box className="px-6">
            <VStack className="items-center">
              {/* Compact Logo */}
              <Box
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                  shadowColor: '#FFD20A',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="person-add" size={30} color="#1E1E1E" />
                </LinearGradient>
              </Box>

              <Heading 
                size="xl" 
                className="font-bold text-center mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: 28,
                  letterSpacing: -0.5,
                }}
              >
                Create Account
              </Heading>
              <Text 
                size="sm" 
                className="text-center" 
                style={{ 
                  color: '#B0B0B0', 
                  lineHeight: 20,
                  paddingHorizontal: 20,
                  fontSize: 14,
                }}
              >
                Join us and start your fitness transformation
              </Text>
            </VStack>
          </Box>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
        }}
      >
        <ScrollView 
          style={{ backgroundColor: '#1E1E1E' }}
          contentContainerStyle={{ 
            backgroundColor: '#1E1E1E',
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 10,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Compact Form Section */}
          <Box className="py-4">
            <View>
              <HStack className="items-center mb-4">
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 210, 10, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 8,
                  }}
                >
                  <Ionicons name="person-add" size={12} color="#FFD20A" />
                </Box>
                <Heading size="md" className="font-bold" style={{ color: '#FFFFFF' }}>
                  Create Your Account
                </Heading>
              </HStack>
            </View>

            {/* Email Input */}
            <FormField
              label="Email Address"
              value={userEmail}
              onChangeText={(text) => {
                setUserEmail(text);
                if (error) setError('');
              }}
              placeholder="Enter your email address"
              icon="mail"
              keyboardType="email-address"
              focused={emailFocused}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              error={Boolean(error && (userEmail === '' || !validateEmail(userEmail)))}
              animatedValue={fadeAnim}
              index={0}
            />

            {/* Password Input */}
            <FormField
              label="Password"
              value={userPassword}
              onChangeText={(text) => {
                setUserPassword(text);
                if (error) setError('');
              }}
              placeholder="Create a secure password"
              icon="lock-closed"
              secureTextEntry={!showPassword}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              focused={passwordFocused}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              error={Boolean(error && (userPassword === '' || !validatePassword(userPassword)))}
              animatedValue={fadeAnim}
              index={1}
            />



            {/* Error Message */}
            {error && (
              <ErrorMessage message={error} animatedValue={errorAnim} />
            )}

            {/* Sign Up Button */}
            <ActionButton
              title="Create Account"
              onPress={handleSignUp}
              isLoading={isLoading}
              loadingText="Creating Account..."
              variant="primary"
              animatedValue={fadeAnim}
              disabled={isLoading}
            />

            {/* Divider */}
            <View>
              <HStack className="items-center mb-4">
                <Box style={{ flex: 1, height: 1, backgroundColor: '#444' }} />
                <Text style={{ color: '#888', fontSize: 12, paddingHorizontal: 12 }}>
                  or continue with
                </Text>
                <Box style={{ flex: 1, height: 1, backgroundColor: '#444' }} />
              </HStack>
            </View>

            {/* Google Sign Up Button */}
            <ActionButton
              title="Continue with Google"
              onPress={handleSignUpWithGoogle}
              variant="secondary"
              animatedValue={fadeAnim}
              disabled={isLoading}
            />

            {/* Compact Footer */}
            <View>
              <Box className="py-4">
                <HStack className="items-center justify-center">
                  <Text 
                    style={{ 
                      color: '#B0B0B0', 
                      fontSize: 14,
                      marginRight: 8,
                    }}
                  >
                    Already have an account?
                  </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate(LOGIN)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#FFD20A',
                    }}
                  >
                    <Text style={{ color: '#FFD20A', fontWeight: '600', fontSize: 13 }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </Box>
            </View>
          </Box>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
