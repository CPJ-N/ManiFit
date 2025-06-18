import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { BOTTOM_TABS, HOME, LOGIN, USER_DETAILS_FORM } from '../../constants/screenNames';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getUser } from '../../utils/controllers/userController';
import Constants from 'expo-constants'

WebBrowser.maybeCompleteAuthSession();

export default function SignUp({ navigation }: { navigation: any }) {
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

  // Updated code: clientId removed from the configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleWebClientId,
    iosClientId: Constants.expoConfig?.extra?.firebaseIosClientId,
    androidClientId: Constants.expoConfig?.extra?.firebaseAndroidClientId,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then(async (userCredential) => {
            const user = userCredential.user;
            const userInfo = await getUser(user.uid);
            if (!userInfo) {
              // User doesn't exist in Firestore, navigate to user details form
              const newUser = {
                uid: user.uid,
                email: user.email
              };
              navigation.navigate(USER_DETAILS_FORM, { user: newUser });
            }
            // If user exists, authentication state will be handled by App.tsx
          })
          .catch((error) => {
            console.error('Error during Firebase sign-in:', error);
            setError('Google Sign-In failed. Try again later.');
          });
      }
    }
  }, [response, navigation]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
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

    if (!validatePassword(userPassword)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      const user = userCredential.user;
      const newUser = {
        uid: user.uid,
        email: user.email,
      };
      navigation.navigate(USER_DETAILS_FORM, { user: newUser });
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
      console.error('Error during Google sign-in:', error);
      setError('Google Sign-In failed. Try again later.');
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
            <Text style={styles.header}>Create Your Account</Text>
            <Text style={styles.subheader}>
              Sign up now to get access to personalized workouts and achieve your fitness goals.
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
              error && (userPassword === '' || !validatePassword(userPassword)) && styles.inputContainerError
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={passwordFocused ? "#FFD20A" : "#666"} 
                style={styles.inputIcon} 
              />
              <TextInput
                placeholder="Create a password"
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

            {/* Password Requirements */}
            <Text style={styles.passwordHint}>
              Password must be at least 6 characters long
            </Text>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <Animated.View style={styles.loadingSpinner}>
                    <Ionicons name="refresh" size={20} color="#1E1E1E" />
                  </Animated.View>
                  <Text style={styles.buttonText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign Up Button */}
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={handleSignUpWithGoogle}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.loginPrompt}>
              Already have an account?{' '}
              <Text 
                style={styles.loginLink} 
                onPress={() => navigation.navigate(LOGIN)}
              >
                Sign In
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
  passwordHint: {
    color: '#888',
    fontSize: 12,
    marginBottom: 24,
    marginLeft: 4,
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
  loginPrompt: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
  },
  loginLink: {
    color: '#FFD20A',
    fontWeight: '600',
  },
});
