import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Dimensions, Animated, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { auth } from '../../config/firebase';
import { createUser } from '../../utils/controllers/userController';
import { setUser } from '../../store/userSlice';
import { UserDetails } from '../../constants/dataModels/userDetails.model';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';

// Navigation imports removed - App.tsx handles navigation automatically

const { width } = Dimensions.get('window');

const userTypes = [
  {
    id: 'trainer',
    title: 'Personal Trainer',
    subtitle: 'I train others',
    description: 'Share your expertise and help others achieve their fitness goals',
    icon: 'barbell-outline',
    isTrainer: true,
    gradient: ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
    bgColor: 'rgba(255, 210, 10, 0.1)',
  },
  {
    id: 'trainee',
    title: 'Looking for Training',
    subtitle: 'I want to get fit',
    description: 'Get personalized workouts and professional guidance',
    icon: 'fitness-outline',
    isTrainer: false,
    gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]],
    bgColor: 'rgba(76, 175, 80, 0.1)',
  },
];

// Modern Form Field Component with Animation
const FormField = ({ 
  icon, 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType = 'default',
  animatedValue,
  index = 0,
  error = false
}: {
  icon: string;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  animatedValue: Animated.Value;
  index?: number;
  error?: boolean;
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [{ 
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [30 + (index * 8), 0]
        })
      }]
    }}
  >
    <Card 
      className="mb-4 p-0" 
      style={{
        backgroundColor: '#2A2A2A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: error ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 210, 10, 0.1)',
        shadowColor: error ? '#FF6B6B' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Box className="p-4">
        <HStack className="items-center mb-3">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: error ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 210, 10, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name={icon as any} size={16} color={error ? '#FF6B6B' : '#FFD20A'} />
          </Box>
          <Text style={{ 
            color: error ? '#FF6B6B' : '#FFD20A', 
            fontSize: 14, 
            fontWeight: '600' 
          }}>
            {label}
          </Text>
        </HStack>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          style={{
            backgroundColor: '#1E1E1E',
            borderColor: error ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 210, 10, 0.2)',
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#FFFFFF',
            fontSize: 16,
            minHeight: 48,
          }}
          placeholderTextColor="#888"
        />
      </Box>
    </Card>
  </Animated.View>
);

// Enhanced User Type Selection Card
const UserTypeCard = ({ 
  type, 
  isSelected, 
  onPress,
  animatedValue,
  index = 0
}: {
  type: typeof userTypes[0];
  isSelected: boolean;
  onPress: () => void;
  animatedValue: Animated.Value;
  index?: number;
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [{ 
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [40 + (index * 15), 0]
        })
      }]
    }}
  >
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card 
        className="mb-4 p-0" 
        style={{
          backgroundColor: '#2A2A2A',
          borderRadius: 20,
          borderWidth: isSelected ? 3 : 1,
          borderColor: isSelected ? type.gradient[0] : 'rgba(255, 255, 255, 0.05)',
          shadowColor: isSelected ? type.gradient[0] : 'transparent',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isSelected ? 0.3 : 0,
          shadowRadius: 16,
          elevation: isSelected ? 12 : 0,
          transform: [{ scale: isSelected ? 1.02 : 1 }],
        }}
      >
        {/* Background gradient for selected state */}
        {isSelected && (
          <LinearGradient
            colors={[type.bgColor, 'transparent']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
            }}
          />
        )}
        
        <Box className="p-6">
          <HStack className="items-center">
            {/* Icon Container */}
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                marginRight: 16,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: isSelected ? type.gradient[0] : 'rgba(255, 210, 10, 0.2)',
              }}
            >
              <LinearGradient
                colors={isSelected ? type.gradient : ['#333333', '#2A2A2A']}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons 
                  name={type.icon as any} 
                  size={28} 
                  color={isSelected ? '#FFFFFF' : type.gradient[0]} 
                />
              </LinearGradient>
            </View>
            
            <VStack className="flex-1">
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: isSelected ? type.gradient[0] : '#FFFFFF',
                  marginBottom: 4,
                  letterSpacing: -0.2,
                }}
              >
                {type.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isSelected ? type.gradient[0] : '#B0B0B0',
                  marginBottom: 8,
                  opacity: 0.9,
                }}
              >
                {type.subtitle}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#B0B0B0',
                  lineHeight: 18,
                }}
              >
                {type.description}
              </Text>
            </VStack>
            
            {/* Selection Indicator */}
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: isSelected ? type.gradient[0] : 'transparent',
                borderWidth: 2,
                borderColor: isSelected ? type.gradient[0] : '#666',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              )}
            </Box>
          </HStack>
        </Box>
      </Card>
    </TouchableOpacity>
  </Animated.View>
);

// Enhanced Profile Image Section
const ProfileImageSection = ({ 
  userDetails,
  animatedValue
}: {
  userDetails: UserDetails;
  animatedValue: Animated.Value;
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [{ 
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1]
        })
      }]
    }}
  >
    <Box className="items-center mb-8">
      <Box style={{ position: 'relative' }}>
        <TouchableOpacity
          style={{
            shadowColor: '#FFD20A',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 15,
          }}
          activeOpacity={0.8}
        >
          <Avatar size="2xl" style={{ width: 120, height: 120, borderWidth: 4, borderColor: '#FFD20A' }}>
            <LinearGradient
              colors={['#FFD20A', '#FFA500']}
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: 60, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              <AvatarFallbackText 
                className="font-bold"
                style={{ color: '#1E1E1E', fontSize: 28 }}
              >
                {userDetails.fullName ? userDetails.fullName.split(' ').map(name => name[0]).join('') : 'U'}
              </AvatarFallbackText>
            </LinearGradient>
          </Avatar>
        </TouchableOpacity>
        
        {/* Camera Icon */}
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: '#1E1E1E',
          }}
        >
          <LinearGradient
            colors={['#FFD20A', '#FFA500']}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="camera" size={16} color="#1E1E1E" />
          </LinearGradient>
        </Box>
      </Box>
      
      <VStack className="items-center mt-4">
        <Text style={{ color: '#B0B0B0', fontSize: 13, textAlign: 'center', marginTop: 8 }}>
          Complete your profile to get started
        </Text>
      </VStack>
    </Box>
  </Animated.View>
);

export default function UserDetailsForm({navigation, route} : {navigation: any, route?: any}) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Get user data from navigation params or current auth user
  const passedUserData = route?.params?.user;
  const currentUser = auth.currentUser;
  
  // Debug logging
  useEffect(() => {
    console.log('UserDetailsForm loaded with params:', passedUserData);
    console.log('Current auth user:', currentUser?.uid);
    console.log('Will use user data from:', passedUserData ? 'route params' : 'current auth user');
  }, [passedUserData, currentUser]);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    uid: passedUserData?.uid || currentUser?.uid || '',
    fullName: '',
    email: passedUserData?.email || currentUser?.email || '',
    mobileNumber: '',
    dateOfBirth: '',
    weight: 0,
    height: 0,
    isTrainer: false,
    profilePhotoName: '',
  });

  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const userTypeAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Complex entrance animation sequence
    Animated.sequence([
      // Header animation first
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Profile section
      Animated.timing(profileAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Form fields
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      // User type selection
      Animated.timing(userTypeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Button last
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Overall fade and slide animation
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

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 0.75, // 75% progress (optional step)
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: boolean} = {};
    
    if (!userDetails.fullName.trim()) newErrors.fullName = true;
    if (!userDetails.mobileNumber?.trim()) newErrors.mobileNumber = true;
    if (!userDetails.dateOfBirth?.trim()) newErrors.dateOfBirth = true;
    if (!userDetails.weight || userDetails.weight <= 0) newErrors.weight = true;
    if (!userDetails.height || userDetails.height <= 0) newErrors.height = true;
    if (!selectedUserType) newErrors.userType = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedType = userTypes.find(type => type.id === selectedUserType);
      const finalUserDetails = {
        ...userDetails,
        uid: passedUserData?.uid || currentUser?.uid || '',
        isTrainer: selectedType?.isTrainer || false,
      };

      const currentUserId = currentUser?.uid;
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }
      console.log('🔄 Creating user with details:', finalUserDetails);
      await createUser(finalUserDetails, currentUserId);
      console.log('✅ User created successfully in Firestore');
      
      dispatch(setUser(finalUserDetails));
      console.log('✅ User details dispatched to Redux store');
      
      // Give Firestore a moment to save the data, then trigger auth state refresh
      setTimeout(() => {
        // Force auth state to refresh by calling the current user again
        console.log('🔄 Triggering auth state refresh after profile creation');
        auth.currentUser?.reload();
      }, 500);
      
      // Add exit animation before automatic navigation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // No manual navigation - let App.tsx auth state handle the redirect
        // After user data is saved and Redux is updated, App.tsx will automatically 
        // show the main app (BOTTOM_TABS) since user is authenticated and has complete profile
        console.log('✅ User profile completed successfully. App.tsx will handle navigation to main app.');
      });
    } catch (error) {
      console.error('Error creating user:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string, field: keyof UserDetails) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const formFields = [
    { key: 'fullName', label: 'Full Name', icon: 'person-outline', placeholder: 'Enter your full name' },
    { key: 'mobileNumber', label: 'Mobile Number', icon: 'call-outline', placeholder: 'Enter your mobile number', keyboardType: 'phone-pad' },
    { key: 'dateOfBirth', label: 'Date of Birth', icon: 'calendar-outline', placeholder: 'DD/MM/YYYY' },
    { key: 'weight', label: 'Weight (kg)', icon: 'fitness-outline', placeholder: '70', keyboardType: 'numeric' },
    { key: 'height', label: 'Height (cm)', icon: 'resize-outline', placeholder: '175', keyboardType: 'numeric' },
  ];

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      // Create minimal trainee profile with defaults
      const minimalUserDetails: UserDetails = {
        uid: passedUserData?.uid || currentUser?.uid || '',
        fullName: currentUser?.displayName || 'User',
        email: passedUserData?.email || currentUser?.email || '',
        mobileNumber: '',
        dateOfBirth: '',
        weight: 0,
        height: 0,
        isTrainer: false, // Default to trainee when skipping
        profilePhotoName: '',
      };

      const currentUserId = currentUser?.uid;
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }
      
      console.log('⏩ Skipping profile form, creating minimal trainee profile:', minimalUserDetails);
      await createUser(minimalUserDetails, currentUserId);
      console.log('✅ Minimal trainee profile created successfully');
      
      dispatch(setUser(minimalUserDetails));
      console.log('✅ Minimal user details dispatched to Redux store');
      
      // Give Firestore a moment to save the data, then trigger auth state refresh
      setTimeout(() => {
        console.log('🔄 Triggering auth state refresh after profile skip');
        auth.currentUser?.reload();
      }, 500);
      
      // Add exit animation before automatic navigation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log('✅ Profile skipped successfully. App.tsx will handle navigation to main app.');
      });
    } catch (error) {
      console.error('Error creating minimal profile:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <StatusBar style="light" />
      
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {/* Enhanced Header */}
        <SafeAreaView style={{ paddingTop: insets.top }}>
          <Animated.View
            style={{
              opacity: headerAnim,
              transform: [{ 
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0]
                })
              }]
            }}
          >
            <LinearGradient
              colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.04)', 'transparent']}
              style={{ paddingBottom: 20 }}
            >
              <VStack className="px-6 py-4">
                <HStack className="justify-between items-center mb-6">
                  <VStack className="flex-1">
                    <Text style={{ color: '#B0B0B0', fontSize: 14, fontWeight: '600' }}>
                      Optional Setup
                    </Text>
                    <Heading 
                      size="2xl" 
                      className="font-bold" 
                      style={{ 
                        color: '#FFD20A', 
                        fontSize: 28, 
                        marginTop: 4,
                        letterSpacing: -0.5,
                      }}
                    >
                      Complete Your Profile
                    </Heading>
                    <Text style={{ 
                      color: '#B0B0B0', 
                      fontSize: 15, 
                      marginTop: 4,
                      lineHeight: 20,
                    }}>
                      Share details now or skip and complete later in settings
                    </Text>
                  </VStack>
                  
                  {/* Skip Button */}
                  <TouchableOpacity
                    onPress={handleSkip}
                    disabled={isSubmitting}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: isSubmitting ? 'rgba(176, 176, 176, 0.05)' : 'rgba(176, 176, 176, 0.1)',
                      borderWidth: 1,
                      borderColor: isSubmitting ? 'rgba(176, 176, 176, 0.1)' : 'rgba(176, 176, 176, 0.3)',
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ 
                      color: isSubmitting ? '#888' : '#B0B0B0', 
                      fontSize: 14, 
                      fontWeight: '600' 
                    }}>
                      {isSubmitting ? 'Please wait...' : 'Skip for now'}
                    </Text>
                  </TouchableOpacity>
                </HStack>

                {/* Enhanced Progress Bar */}
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
              </VStack>
            </LinearGradient>
          </Animated.View>
        </SafeAreaView>

        {/* Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingBottom: insets.bottom + 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Image Section */}
          <ProfileImageSection
            userDetails={userDetails}
            animatedValue={profileAnim}
          />

          {/* Form Fields Section */}
          <VStack className="mb-8">
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
              <HStack className="items-center mb-6">
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(255, 210, 10, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="information-circle" size={16} color="#FFD20A" />
                </Box>
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
                  Personal Information
                </Text>
              </HStack>
            </Animated.View>

            {formFields.map((field, index) => (
              <FormField
                key={field.key}
                icon={field.icon}
                label={field.label}
                placeholder={field.placeholder}
                value={(userDetails[field.key as keyof UserDetails] ?? '').toString()}
                onChangeText={(text) => handleChange(text, field.key as keyof UserDetails)}
                keyboardType={field.keyboardType || 'default'}
                animatedValue={formAnim}
                index={index}
                error={errors[field.key]}
              />
            ))}
          </VStack>

          {/* User Type Selection */}
          <VStack className="mb-8">
            <Animated.View
              style={{
                opacity: userTypeAnim,
                transform: [{ 
                  translateY: userTypeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }}
            >
              <HStack className="items-center mb-6">
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(255, 210, 10, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="people" size={16} color="#FFD20A" />
                </Box>
                <VStack className="flex-1">
                  <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                    I am a...
                  </Text>
                  <Text style={{ 
                    color: errors.userType ? '#FF6B6B' : '#B0B0B0', 
                    fontSize: 14, 
                    lineHeight: 20 
                  }}>
                    {errors.userType ? 'Please select your role to continue' : 'Choose your role to customize your experience'}
                  </Text>
                </VStack>
              </HStack>
            </Animated.View>
            
            {userTypes.map((type, index) => (
              <UserTypeCard
                key={type.id}
                type={type}
                isSelected={selectedUserType === type.id}
                onPress={() => {
                  setSelectedUserType(type.id);
                  if (errors.userType) {
                    setErrors(prev => ({ ...prev, userType: false }));
                  }
                }}
                animatedValue={userTypeAnim}
                index={index}
              />
            ))}
          </VStack>
        </ScrollView>

        {/* Enhanced Bottom Button */}
        <SafeAreaView style={{ paddingBottom: insets.bottom }}>
          <Animated.View
            style={{
              opacity: buttonAnim,
              transform: [{ 
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }}
          >
            <Box className="px-6 py-4">
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  opacity: isSubmitting ? 0.8 : 1,
                  shadowColor: '#FFD20A',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={{
                    paddingVertical: 18,
                    alignItems: 'center',
                  }}
                >
                  <HStack className="items-center">
                    {isSubmitting ? (
                      <>
                        <ActivityIndicator size="small" color="#1E1E1E" style={{ marginRight: 12 }} />
                        <Text style={{ color: '#1E1E1E', fontSize: 18, fontWeight: '800' }}>
                          Creating Profile...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ 
                          color: '#1E1E1E', 
                          fontSize: 18, 
                          fontWeight: '800', 
                          marginRight: 8,
                          letterSpacing: 0.2,
                        }}>
                          Enter ManiFit
                        </Text>
                        <Ionicons name="chevron-forward" size={22} color="#1E1E1E" />
                      </>
                    )}
                  </HStack>
                </LinearGradient>
              </TouchableOpacity>

              {/* Form validation hint */}
              {Object.keys(errors).length > 0 && !isSubmitting && (
                <Box className="mt-4">
                  <LinearGradient
                    colors={['rgba(255, 107, 107, 0.1)', 'transparent']}
                    style={{
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center',
                    }}
                  >
                    <HStack className="items-center">
                      <Ionicons name="alert-circle" size={16} color="#FF6B6B" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#FF6B6B', fontSize: 13, textAlign: 'center' }}>
                        Please fill in all required fields to continue
                      </Text>
                    </HStack>
                  </LinearGradient>
                </Box>
              )}
            </Box>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}


