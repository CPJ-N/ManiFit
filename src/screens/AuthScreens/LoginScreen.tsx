import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Animated, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FORGOT_PASSWORD, REGISTER } from '../../constants/screenNames';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

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

export default function Login({navigation} : {navigation: any}) {
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
  const slideAnim = new Animated.Value(30);
  const headerAnim = new Animated.Value(0);
  const formAnim = new Animated.Value(0);
  const buttonAnim = new Animated.Value(0);
  const errorAnim = new Animated.Value(0);

  useEffect(() => {
    // Faster entrance animation sequence
    Animated.sequence([
      // Header animation first
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Form fields
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Buttons last
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Overall fade and slide animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
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

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword);
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (errorCode) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials. Please check your email and password.';
          break;
        default:
          errorMessage = 'Failed to sign in. Please check your credentials.';
      }
      
      setError(errorMessage);
      console.log(errorCode, error.message);
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
          opacity: headerAnim,
          transform: [{ 
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }]
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
                   <Ionicons name="person-circle" size={30} color="#1E1E1E" />
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
                Welcome Back!
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
                Sign in to continue your fitness journey
              </Text>
            </VStack>
          </Box>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
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
            <Animated.View
              style={{
                opacity: formAnim,
                transform: [{ 
                  translateY: formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}
            >
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
                  <Ionicons name="log-in" size={12} color="#FFD20A" />
                </Box>
                <Heading size="md" className="font-bold" style={{ color: '#FFFFFF' }}>
                  Sign In to Your Account
                </Heading>
              </HStack>
            </Animated.View>

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
              animatedValue={formAnim}
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
              placeholder="Enter your password"
              icon="lock-closed"
              secureTextEntry={!showPassword}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              focused={passwordFocused}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              error={Boolean(error && userPassword === '')}
              animatedValue={formAnim}
              index={1}
            />

            {/* Forgot Password */}
            <Animated.View
              style={{
                opacity: formAnim,
                transform: [{ 
                  translateY: formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }}
            >
              <TouchableOpacity 
                onPress={() => navigation.navigate(FORGOT_PASSWORD)}
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: 16,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: '#FFD20A', fontSize: 13, fontWeight: '600' }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Error Message */}
            {error && (
              <ErrorMessage message={error} animatedValue={errorAnim} />
            )}

            {/* Sign In Button */}
            <ActionButton
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              loadingText="Signing In..."
              variant="primary"
              animatedValue={buttonAnim}
              disabled={isLoading}
            />

            {/* Divider */}
            <Animated.View
              style={{
                opacity: buttonAnim,
                transform: [{ 
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}
            >
              <HStack className="items-center mb-4">
                <Box style={{ flex: 1, height: 1, backgroundColor: '#444' }} />
                <Text style={{ color: '#888', fontSize: 12, paddingHorizontal: 12 }}>
                  or continue with
                </Text>
                <Box style={{ flex: 1, height: 1, backgroundColor: '#444' }} />
              </HStack>
            </Animated.View>

            {/* Google Sign In Button */}
            <ActionButton
              title="Continue with Google"
              onPress={() => {}}
              variant="secondary"
              animatedValue={buttonAnim}
              disabled={isLoading}
            />

            {/* Compact Footer */}
            <Animated.View
              style={{
                opacity: buttonAnim,
                transform: [{ 
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}
            >
              <Box className="py-4">
                <HStack className="items-center justify-center">
                  <Text 
                    style={{ 
                      color: '#B0B0B0', 
                      fontSize: 14,
                      marginRight: 8,
                    }}
                  >
                    Don't have an account?
                  </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate(REGISTER)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#FFD20A',
                    }}
                  >
                    <Text style={{ color: '#FFD20A', fontWeight: '600', fontSize: 13 }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </Box>
            </Animated.View>
          </Box>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

