import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ROUTES } from '../../constants/navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Card } from '../../../components/ui/card';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const processedEmail = email.toLowerCase(); // Only lowercase, no trimming
      const trimmedPassword = password.trim(); // Still trim password for security
      
      console.log('🔑 Attempting login with email:', `"${processedEmail}"`);
      console.log('🔑 Original email input:', `"${email}"`);
      await signInWithEmailAndPassword(auth, processedEmail, trimmedPassword);
      console.log('✅ User signed in successfully');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // More specific error messages
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.05)', 'transparent', 'rgba(255, 210, 10, 0.02)']}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header Section */}
        <Box style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <VStack space="md" style={styles.headerContent}>
            {/* Welcome Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FFD20A', '#FFA500']}
                style={styles.iconGradient}
              >
                <Ionicons name="fitness" size={32} color="#1E1E1E" />
              </LinearGradient>
            </View>

            <VStack space="xs" style={styles.titleContainer}>
              <Heading size="2xl" style={styles.title}>
                Welcome Back
              </Heading>
              <Text style={styles.subtitle}>
                Sign in to continue your fitness journey
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Form Section */}
        <Box style={styles.formSection}>
          <Card style={styles.formCard}>
            <VStack space="lg" style={styles.formContent}>
              {/* Email Input */}
              <VStack space="xs">
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputContainer,
                  emailFocused && styles.inputContainerFocused
                ]}>
                  <Ionicons 
                    name="mail" 
                    size={20} 
                    color={emailFocused ? "#FFD20A" : "#666"} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </VStack>
              
              {/* Password Input */}
              <VStack space="xs">
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  passwordFocused && styles.inputContainerFocused
                ]}>
                  <Ionicons 
                    name="lock-closed" 
                    size={20} 
                    color={passwordFocused ? "#FFD20A" : "#666"} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </VStack>

              {/* Login Button */}
              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ['#999', '#777'] : ['#FFD20A', '#FFA500']}
                  style={styles.buttonGradient}
                >
                  <HStack space="sm" style={styles.buttonContent}>
                    {loading && (
                      <Ionicons name="refresh" size={20} color="#1E1E1E" />
                    )}
                    <Text style={styles.loginButtonText}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </HStack>
                </LinearGradient>
              </TouchableOpacity>

              {/* Forgot Password Link */}
              <TouchableOpacity style={styles.forgotPasswordLink}>
                <Text style={styles.forgotPasswordText}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </VStack>
          </Card>
        </Box>

        {/* Bottom Section */}
        <Box style={styles.bottomSection}>
          {/* Divider */}
          <HStack style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </HStack>

          {/* Register Link */}
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate(ROUTES.REGISTER)}
            activeOpacity={0.8}
          >
            <Card style={styles.registerCard}>
              <HStack space="sm" style={styles.registerContent}>
                <Ionicons name="person-add" size={20} color="#FFD20A" />
                <VStack space="xs">
                  <Text style={styles.registerMainText}>
                    New to ManiFit?
                  </Text>
                  <Text style={styles.registerSubText}>
                    Create your account and start your journey
                  </Text>
                </VStack>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </HStack>
            </Card>
          </TouchableOpacity>
        </Box>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flex: 0.35,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD20A',
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    flex: 0.45,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formContent: {
    padding: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainerFocused: {
    borderColor: '#FFD20A',
    backgroundColor: '#3A3A3A',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  loginButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPasswordLink: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#FFD20A',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSection: {
    flex: 0.2,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  dividerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 16,
  },
  registerButton: {
    borderRadius: 12,
  },
  registerCard: {
    backgroundColor: 'rgba(255, 210, 10, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.2)',
  },
  registerContent: {
    padding: 16,
    alignItems: 'center',
  },
  registerMainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerSubText: {
    color: '#B0B0B0',
    fontSize: 13,
  },
}); 