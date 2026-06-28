import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Dimensions, Animated, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { createUser } from '../../utils/controllers/userController';
import { ROUTES } from '../../constants/navigation';
import { DEFAULT_COACH_VERIFICATION_STATUS, DEFAULT_USER_ROLE } from '../../constants/roles';
import type { UserDetails } from '../../constants/dataModels/userDetails.model';

// Gluestack UI Components
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  placeholder: string;
  keyboardType?: any;
  secureTextEntry?: boolean;
  required: boolean;
  options?: { label: string; value: string; icon?: string }[];
}

const questions: Question[] = [
  {
    id: 'fullName',
    title: 'What\'s your name?',
    subtitle: 'We\'d love to know what to call you',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    id: 'gender',
    title: 'Choose your Gender',
    subtitle: 'This will be used to calibrate your custom plan',
    placeholder: '',
    required: false,
    options: [
      { label: 'Male', value: 'male', icon: 'man' },
      { label: 'Female', value: 'female', icon: 'woman' },
      { label: 'Other', value: 'other', icon: 'people' },
    ],
  },
  {
    id: 'age',
    title: 'How old are you?',
    subtitle: 'This helps us create a personalized experience',
    placeholder: 'Enter your age',
    keyboardType: 'numeric',
    required: false,
  },
  {
    id: 'height',
    title: 'What\'s your height?',
    subtitle: 'In centimeters (e.g., 175)',
    placeholder: 'Enter your height in cm',
    keyboardType: 'numeric',
    required: false,
  },
  {
    id: 'weight',
    title: 'What\'s your weight?',
    subtitle: 'In kilograms (e.g., 70)',
    placeholder: 'Enter your weight in kg',
    keyboardType: 'numeric',
    required: false,
  },
  {
    id: 'email',
    title: 'What\'s your email?',
    subtitle: 'We\'ll use this to create your account',
    placeholder: 'Enter your email address',
    keyboardType: 'email-address',
    required: true,
  },
  {
    id: 'password',
    title: 'Create a password',
    subtitle: 'Choose a secure password (minimum 6 characters)',
    placeholder: 'Enter your password',
    secureTextEntry: true,
    required: true,
  },
];

export default function RegisterScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(-30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    setError('');
    
    // Validate required fields
    if (currentQuestion.required && !answers[currentQuestion.id]?.trim()) {
      setError('This field is required');
      return;
    }

    // Email validation
    if (currentQuestion.id === 'email' && answers.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(answers.email)) {
        setError('Please enter a valid email address');
        return;
    }
    }

    // Password validation
    if (currentQuestion.id === 'password' && answers.password && answers.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (currentIndex < questions.length - 1) {
      animateTransition(() => {
        setCurrentIndex(currentIndex + 1);
      });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      animateTransition(() => {
        setCurrentIndex(currentIndex - 1);
        setError('');
      });
    } else {
      navigation.goBack();
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Registration failed. Please try again.';
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Starting registration process for:', answers.email?.trim());
    setIsSubmitting(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, answers.email.trim(), answers.password);
      console.log('✅ Firebase user created:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      });

      const gender = answers.gender === 'male' || answers.gender === 'female' || answers.gender === 'other'
        ? answers.gender
        : undefined;
      
      const userProfile: UserDetails = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        fullName: answers.fullName?.trim() || '',
        role: DEFAULT_USER_ROLE,
        coachVerificationStatus: DEFAULT_COACH_VERIFICATION_STATUS,
        isTrainer: false,
        isSubscribed: false,
        createdAt: new Date().toISOString(),
        ...(gender ? { gender } : {}),
        ...(answers.age ? { age: parseInt(answers.age) } : {}),
        ...(answers.height ? { height: parseInt(answers.height) } : {}),
        ...(answers.weight ? { weight: parseInt(answers.weight) } : {}),
        linkedTrainer: '',
      };

      console.log('📥 Creating user profile in Firestore...');
      await createUser(userProfile, userCredential.user.uid);
      console.log('✅ Registration completed successfully');
    } catch (error: any) {
      console.error('💥 Registration failed:', {
        code: error.code,
        message: error.message
      });
      setError(getErrorMessage(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    if (error) setError('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.05)', 'transparent', 'rgba(255, 210, 10, 0.02)']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
        {/* Header */}
        <Box style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity 
              onPress={handleBack}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255, 210, 10, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                <Ionicons name="chevron-back" size={24} color="#FFD20A" />
              </TouchableOpacity>

            <Text style={{ color: '#B0B0B0', fontSize: 16, fontWeight: '600' }}>
              Step {currentIndex + 1} of {questions.length}
            </Text>
          </HStack>

          {/* Progress Bar */}
          <Box style={{
            height: 6,
            backgroundColor: '#333333',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <Animated.View
              style={{
                height: 6,
                borderRadius: 3,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }}
            >
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                style={{ flex: 1, borderRadius: 3 }}
              />
            </Animated.View>
          </Box>
        </Box>

        {/* Content */}
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 24,
          }}
        >
          <VStack style={{ flex: 1, justifyContent: 'space-between' }}>
            {/* Question Section */}
            <VStack style={{ flex: 1, justifyContent: 'center', paddingVertical: 40 }}>
              <Heading
                size="3xl"
                style={{
                  color: '#FFFFFF',
                  fontSize: 32,
                  fontWeight: '700',
                  lineHeight: 40,
                  marginBottom: 12,
                }}
              >
                {currentQuestion.title}
              </Heading>
              
              <Text style={{
                color: '#B0B0B0',
                fontSize: 18,
                lineHeight: 24,
                marginBottom: 40,
              }}>
                {currentQuestion.subtitle}
              </Text>

              {/* Input/Options */}
              {currentQuestion.options ? (
                // Multiple choice options
                <VStack space="md">
                  {currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => updateAnswer(option.value)}
                      style={{
                        backgroundColor: answers[currentQuestion.id] === option.value ? 'rgba(255, 210, 10, 0.15)' : '#2A2A2A',
                        borderRadius: 16,
                        padding: 24,
                        borderWidth: 2,
                        borderColor: answers[currentQuestion.id] === option.value ? '#FFD20A' : 'rgba(255, 210, 10, 0.1)',
                        marginBottom: 16,
                      }}
                      activeOpacity={0.8}
                    >
                      <HStack style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {option.icon && (
                    <Ionicons 
                            name={option.icon as any}
                            size={28}
                            color={answers[currentQuestion.id] === option.value ? '#FFD20A' : '#B0B0B0'}
                            style={{ marginRight: 16 }}
                    />
                        )}
                        <Text style={{
                          fontSize: 20,
                          fontWeight: '600',
                          color: answers[currentQuestion.id] === option.value ? '#FFD20A' : '#FFFFFF',
                        }}>
                          {option.label}
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  ))}
                </VStack>
              ) : (
                // Text input
                <View style={{ position: 'relative' }}>
                    <TextInput
                    value={answers[currentQuestion.id] || ''}
                    onChangeText={updateAnswer}
                    placeholder={currentQuestion.placeholder}
                    keyboardType={currentQuestion.keyboardType || 'default'}
                    secureTextEntry={currentQuestion.secureTextEntry && !showPassword}
                    autoCapitalize={currentQuestion.keyboardType === 'email-address' ? 'none' : 'words'}
                    style={{
                      backgroundColor: '#2A2A2A',
                      borderRadius: 16,
                      padding: 20,
                      fontSize: 18,
                      color: '#FFFFFF',
                      borderWidth: 2,
                      borderColor: error ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255, 210, 10, 0.2)',
                      paddingRight: currentQuestion.secureTextEntry ? 60 : 20,
                    }}
                    placeholderTextColor="#666"
                  />
                  
                  {currentQuestion.secureTextEntry && (
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        padding: 4,
                      }}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off" : "eye"} 
                        size={24}
                        color="#B0B0B0"
                      />
                    </TouchableOpacity>
                  )}
                  </View>
              )}

              {/* Error Message */}
              {error ? (
                <Box style={{
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 20,
                  borderLeftWidth: 4,
                  borderLeftColor: '#FF6B6B',
                }}>
                  <HStack style={{ alignItems: 'center' }}>
                    <Ionicons name="alert-circle-outline" size={20} color="#FF6B6B" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#FF6B6B', fontSize: 16, fontWeight: '500', flex: 1 }}>
                      {error}
                  </Text>
                  </HStack>
                </Box>
              ) : null}
                </VStack>

            {/* Bottom Section */}
            <VStack style={{ paddingBottom: 20 }}>
              {/* Continue Button */}
                <TouchableOpacity 
                onPress={handleNext}
                disabled={isSubmitting}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity: isSubmitting ? 0.8 : 1,
                }}
                activeOpacity={0.9}
                >
                  <LinearGradient
                  colors={isSubmitting ? ['#999', '#777'] : ['#FFD20A', '#FFA500']}
                  style={{
                    paddingVertical: 18,
                    alignItems: 'center',
                  }}
                  >
                  {isSubmitting ? (
                    <HStack style={{ alignItems: 'center' }}>
                      <ActivityIndicator size="small" color="#1E1E1E" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#1E1E1E', fontSize: 18, fontWeight: '700' }}>
                        Creating Account...
                      </Text>
                    </HStack>
                  ) : (
                    <Text style={{ color: '#1E1E1E', fontSize: 18, fontWeight: '700' }}>
                      {currentIndex === questions.length - 1 ? 'Create Account' : 'Continue'}
                    </Text>
                  )}
                  </LinearGradient>
                </TouchableOpacity>

              {/* Sign In Link */}
              {currentIndex === 0 && (
            <TouchableOpacity 
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
                  style={{ marginTop: 20, alignItems: 'center' }}
                >
                  <Text style={{ color: '#B0B0B0', fontSize: 16 }}>
                    Already have an account?{' '}
                    <Text style={{ color: '#FFD20A', fontWeight: '600' }}>
                      Sign In
                    </Text>
                    </Text>
                </TouchableOpacity>
              )}
            </VStack>
                  </VStack>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
