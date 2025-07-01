import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { registerUser, getAuthErrorMessage } from '../../utils/authController';
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

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerUser(email, password, fullName);
      console.log('✅ User registered and profile created successfully');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      const errorMessage = getAuthErrorMessage(error);
      Alert.alert('Registration Failed', errorMessage);
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
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <Box style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <VStack space="md" style={styles.headerContent}>
              {/* Back Button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={24} color="#FFD20A" />
              </TouchableOpacity>

              {/* Welcome Icon */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={styles.iconGradient}
                >
                  <Ionicons name="person-add" size={32} color="#1E1E1E" />
                </LinearGradient>
              </View>

              <VStack space="xs" style={styles.titleContainer}>
                <Heading size="2xl" style={styles.title}>
                  Join ManiFit
                </Heading>
                <Text style={styles.subtitle}>
                  Create your account and start your fitness journey
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Form Section */}
          <Box style={styles.formSection}>
            <Card style={styles.formCard}>
              <VStack space="lg" style={styles.formContent}>
                {/* Full Name Input */}
                <VStack space="xs">
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={[
                    styles.inputContainer,
                    nameFocused && styles.inputContainerFocused
                  ]}>
                    <Ionicons 
                      name="person" 
                      size={20} 
                      color={nameFocused ? "#FFD20A" : "#666"} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter your full name"
                      placeholderTextColor="#888"
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                    />
                  </View>
                </VStack>

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
                      placeholder="Min 6 characters"
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
                  <Text style={styles.passwordHint}>
                    Must be at least 6 characters long
                  </Text>
                </VStack>

                {/* Register Button */}
                <TouchableOpacity 
                  style={[styles.registerButton, loading && styles.buttonDisabled]}
                  onPress={handleRegister}
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
                      <Text style={styles.registerButtonText}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Text>
                    </HStack>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Terms Text */}
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
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

            {/* Login Link */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              activeOpacity={0.8}
            >
              <Card style={styles.loginCard}>
                <HStack space="sm" style={styles.loginContent}>
                  <Ionicons name="log-in" size={20} color="#FFD20A" />
                  <VStack space="xs">
                    <Text style={styles.loginMainText}>
                      Already have an account?
                    </Text>
                    <Text style={styles.loginSubText}>
                      Sign in to your existing account
                    </Text>
                  </VStack>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </HStack>
              </Card>
            </TouchableOpacity>
          </Box>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    paddingHorizontal: 24,
    marginBottom: 20,
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
  passwordHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  registerButton: {
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
  registerButtonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#FFD20A',
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
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
  loginButton: {
    borderRadius: 12,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 210, 10, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.2)',
  },
  loginContent: {
    padding: 16,
    alignItems: 'center',
  },
  loginMainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSubText: {
    color: '#B0B0B0',
    fontSize: 13,
  },
}); 