import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { BOTTOM_TABS, FORGOT_PASSWORD, HOME, REGISTER } from '../../constants/screenNames';
import { StatusBar } from 'expo-status-bar';

export default function Login({navigation} : {navigation: any}) {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Note: Authentication state is now handled at the App level
  // User data fetching and Redux updates are handled there too

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError('');

    // Validation
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
      // Navigation and user data handling will be done automatically by App.tsx auth state listener
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
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.header}>Welcome Back!</Text>
            <Text style={styles.subheader}>
              Sign in to access your personalized workouts and track your progress
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={[
              styles.inputContainer,
              emailFocused && styles.inputContainerFocused,
              error && (userEmail === '' || !validateEmail(userEmail)) && styles.inputContainerError
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={emailFocused ? "#FFD20A" : "#666"} 
                style={styles.inputIcon} 
              />
              <TextInput
                placeholder="Enter your email"
                value={userEmail}
                onChangeText={(text) => {
                  setUserEmail(text);
                  if (error) setError(''); // Clear error on input
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={styles.input}
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={[
              styles.inputContainer,
              passwordFocused && styles.inputContainerFocused,
              error && userPassword === '' && styles.inputContainerError
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={passwordFocused ? "#FFD20A" : "#666"} 
                style={styles.inputIcon} 
              />
              <TextInput
                placeholder="Enter your password"
                value={userPassword}
                onChangeText={(text) => {
                  setUserPassword(text);
                  if (error) setError(''); // Clear error on input
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholderTextColor="#888"
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={passwordFocused ? "#FFD20A" : "#666"}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={() => navigation.navigate(FORGOT_PASSWORD)}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <Animated.View style={styles.loadingSpinner}>
                    <Ionicons name="refresh" size={20} color="#1E1E1E" />
                  </Animated.View>
                  <Text style={styles.buttonText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity 
              style={styles.socialButton} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.signupPrompt}>
              Don't have an account?{' '}
              <Text 
                style={styles.signupLink} 
                onPress={() => navigation.navigate(REGISTER)}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    fontSize: 32,
    color: '#FFD20A',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#B0B0B0',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: '#FFD20A',
    backgroundColor: '#333333',
  },
  inputContainerError: {
    borderColor: '#FF6B6B',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 16,
    paddingLeft: 12,
  },
  inputIcon: {
    padding: 4,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#FFD20A',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: '#FFD20A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FFD20A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginRight: 8,
  },
  buttonText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    color: '#888',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  signupPrompt: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
  },
  signupLink: {
    color: '#FFD20A',
    fontWeight: '600',
  },
});

