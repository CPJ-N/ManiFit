import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { BOTTOM_TABS, FORGOT_PASSWORD, HOME, REGISTER } from '../../constants/screenNames';
import { useDispatch } from 'react-redux';
import { setUser, setUserImageUrl } from '../../store/userSlice';
import { getUser } from '../../utils/controllers/userController';
import { StatusBar } from 'expo-status-bar';
import { getImageUrl } from '../../utils/controllers/imageController';
import { firebaseBucketName } from '../../constants/firebaseContant';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { FormControl, FormControlError, FormControlErrorText, FormControlErrorIcon } from '@/components/ui/form-control';

export default function LoginImproved({navigation} : {navigation: any}) {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const dispatch = useDispatch();

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.replace(BOTTOM_TABS, { screen: HOME })
      }
    })
    return unsubscribe
  }, [])

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
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
      const user = userCredential.user;
      const userInfo = await getUser(user.uid);

      if (userInfo) {
        dispatch(setUser(userInfo));
      }

      if(userInfo?.profilePhotoName) {
        const imageUrl = await getImageUrl(firebaseBucketName.userImages, userInfo.profilePhotoName);
        console.log('Image URL:', imageUrl);
        console.log('UserImage:', userInfo.profilePhotoName);
        dispatch(setUserImageUrl(imageUrl));
      }

      navigation.navigate(BOTTOM_TABS, {screen: HOME});
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
      className="flex-1 bg-background-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="min-h-full"
      >
        <Animated.View 
          className="flex-1 px-6 py-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Header Section */}
          <VStack className="items-center mt-12 mb-8 space-y-4">
            <Heading size="2xl" className="text-typography-0 font-bold text-center">
              Welcome Back!
            </Heading>
            <Text size="md" className="text-typography-400 text-center max-w-sm">
              Sign in to access your personalized workouts and track your progress
            </Text>
          </VStack>

          {/* Form Section */}
          <VStack className="space-y-6 flex-1">
            {/* Email Input */}
            <FormControl isInvalid={!!error && (userEmail === '' || !validateEmail(userEmail))}>
              <Input
                variant="outline"
                size="lg"
                className="bg-background-900 border-outline-300 focus:border-primary-400"
              >
                <InputSlot className="pl-3">
                  <Ionicons name="mail-outline" size={20} color="#6B7280" />
                </InputSlot>
                <InputField
                  placeholder="Enter your email"
                  value={userEmail}
                  onChangeText={(text) => {
                    setUserEmail(text);
                    if (error) setError('');
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="text-typography-0 pl-2"
                />
              </Input>
            </FormControl>

            {/* Password Input */}
            <FormControl isInvalid={!!error && userPassword === ''}>
              <Input
                variant="outline"
                size="lg"
                className="bg-background-900 border-outline-300 focus:border-primary-400"
              >
                <InputSlot className="pl-3">
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                </InputSlot>
                <InputField
                  placeholder="Enter your password"
                  value={userPassword}
                  onChangeText={(text) => {
                    setUserPassword(text);
                    if (error) setError('');
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="text-typography-0 pl-2"
                />
                <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </InputSlot>
              </Input>
            </FormControl>

            {/* Forgot Password */}
            <HStack className="justify-end">
              <TouchableOpacity onPress={() => navigation.navigate(FORGOT_PASSWORD)}>
                <Text size="sm" className="text-primary-400 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </HStack>

            {/* Error Message */}
            {error ? (
              <Box className="bg-error-50 border border-error-200 rounded-lg p-3">
                <HStack className="items-center space-x-2">
                  <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                  <Text size="sm" className="text-error-600 flex-1">
                    {error}
                  </Text>
                </HStack>
              </Box>
            ) : null}

            {/* Login Button */}
            <Button
              size="lg"
              variant="solid"
              action="primary"
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-primary-500 hover:bg-primary-600 mt-4"
            >
              {isLoading && <ButtonSpinner className="mr-2" />}
              <ButtonText className="text-typography-0 font-semibold">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </ButtonText>
            </Button>

            {/* Divider */}
            <HStack className="items-center space-x-4 my-6">
              <Box className="flex-1 h-px bg-outline-300" />
              <Text size="sm" className="text-typography-500">
                or continue with
              </Text>
              <Box className="flex-1 h-px bg-outline-300" />
            </HStack>

            {/* Google Sign In Button */}
            <Button
              size="lg"
              variant="outline"
              disabled={isLoading}
              className="border-outline-400 bg-transparent"
            >
              <HStack className="items-center space-x-2">
                <Ionicons name="logo-google" size={20} color="#fff" />
                <ButtonText className="text-typography-0 font-medium">
                  Google
                </ButtonText>
              </HStack>
            </Button>
          </VStack>

          {/* Footer Section */}
          <VStack className="items-center mt-8 mb-4">
            <HStack className="items-center space-x-1">
              <Text size="sm" className="text-typography-500">
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate(REGISTER)}>
                <Text size="sm" className="text-primary-400 font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </HStack>
          </VStack>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 