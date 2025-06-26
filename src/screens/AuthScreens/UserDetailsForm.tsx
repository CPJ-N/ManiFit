import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Dimensions, Animated, SafeAreaView, Platform, ActivityIndicator, KeyboardTypeOptions } from 'react-native';
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

const { width, height } = Dimensions.get('window');

const userTypes = [
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
];

// Slide-based questionnaire structure
const slides = [
  {
    id: 'fullName',
    title: "What's your name?",
    subtitle: 'Let us know what to call you',
    icon: 'person-outline',
    type: 'text',
    placeholder: 'Enter your full name',
    field: 'fullName'
  },
  {
    id: 'mobile',
    title: "What's your phone number?",
    subtitle: 'We may need to contact you about your workouts',
    icon: 'call-outline',
    type: 'text',
    placeholder: 'Enter your phone number',
    field: 'mobileNumber',
    keyboardType: 'phone-pad' as KeyboardTypeOptions
  },
  {
    id: 'dateOfBirth',
    title: "What's your date of birth?",
    subtitle: 'This helps us personalize your fitness plan',
    icon: 'calendar-outline',
    type: 'text',
    placeholder: 'DD/MM/YYYY',
    field: 'dateOfBirth'
  },
  {
    id: 'weight',
    title: "What's your weight?",
    subtitle: 'This helps us calculate your fitness metrics',
    icon: 'fitness-outline',
    type: 'text',
    placeholder: 'Enter weight in kg',
    field: 'weight',
    keyboardType: 'numeric' as KeyboardTypeOptions
  },
  {
    id: 'height',
    title: "What's your height?",
    subtitle: 'This helps us calculate your fitness metrics',
    icon: 'resize-outline',
    type: 'text',
    placeholder: 'Enter height in cm',
    field: 'height',
    keyboardType: 'numeric' as KeyboardTypeOptions
  },
  {
    id: 'userType',
    title: 'I am a...',
    subtitle: 'Choose your role to customize your experience',
    icon: 'people',
    type: 'userType'
  }
];

// Individual slide components
const UserTypeSlide = ({ 
  selectedUserType, 
  setSelectedUserType, 
  fadeAnim 
}: {
  selectedUserType: string;
  setSelectedUserType: (type: string) => void;
  fadeAnim: Animated.Value;
}) => (
  <Animated.View
    style={{
      flex: 1,
      opacity: fadeAnim,
      paddingHorizontal: 24,
      justifyContent: 'center',
    }}
  >
    <VStack style={{ gap: 20 }}>
      {userTypes.map((type, index) => (
        <TouchableOpacity
          key={type.id}
          onPress={() => setSelectedUserType(type.id)}
          activeOpacity={0.8}
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: selectedUserType === type.id ? 3 : 1,
            borderColor: selectedUserType === type.id ? type.gradient[0] : 'rgba(255, 255, 255, 0.1)',
            backgroundColor: '#2A2A2A',
            shadowColor: selectedUserType === type.id ? type.gradient[0] : 'transparent',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: selectedUserType === type.id ? 0.3 : 0,
            shadowRadius: 16,
            elevation: selectedUserType === type.id ? 12 : 0,
            transform: [{ scale: selectedUserType === type.id ? 1.02 : 1 }],
          }}
        >
          {selectedUserType === type.id && (
            <LinearGradient
              colors={[type.bgColor, 'transparent']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}
          
          <Box style={{ padding: 24 }}>
            <HStack style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  marginRight: 16,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: selectedUserType === type.id ? type.gradient[0] : 'rgba(255, 210, 10, 0.2)',
                }}
              >
                <LinearGradient
                  colors={selectedUserType === type.id ? type.gradient : ['#333333', '#2A2A2A']}
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
                    color={selectedUserType === type.id ? '#FFFFFF' : type.gradient[0]} 
                  />
                </LinearGradient>
              </View>
              
              <VStack style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: selectedUserType === type.id ? type.gradient[0] : '#FFFFFF',
                    marginBottom: 4,
                  }}
                >
                  {type.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: selectedUserType === type.id ? type.gradient[0] : '#B0B0B0',
                    marginBottom: 8,
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
              
              <Box
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: selectedUserType === type.id ? type.gradient[0] : 'transparent',
                  borderWidth: 2,
                  borderColor: selectedUserType === type.id ? type.gradient[0] : '#666',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {selectedUserType === type.id && (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                )}
              </Box>
            </HStack>
          </Box>
        </TouchableOpacity>
      ))}
    </VStack>
  </Animated.View>
);

const TextInputSlide = ({ 
  slide, 
  value, 
  onChangeText, 
  fadeAnim 
}: {
  slide: typeof slides[0];
  value: string;
  onChangeText: (text: string) => void;
  fadeAnim: Animated.Value;
}) => (
  <Animated.View
    style={{
      flex: 1,
      opacity: fadeAnim,
      paddingHorizontal: 24,
      justifyContent: 'center',
    }}
  >
    <VStack style={{ alignItems: 'center' }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'rgba(255, 210, 10, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 32,
          borderWidth: 2,
          borderColor: 'rgba(255, 210, 10, 0.3)',
        }}
      >
        <Ionicons name={slide.icon as any} size={32} color="#FFD20A" />
      </View>
      
      <Card 
        style={{
          backgroundColor: '#2A2A2A',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 210, 10, 0.2)',
          width: '100%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Box style={{ padding: 24 }}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={slide.placeholder}
            keyboardType={slide.keyboardType || 'default'}
            style={{
              backgroundColor: '#1E1E1E',
              borderColor: 'rgba(255, 210, 10, 0.3)',
              borderWidth: 2,
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingVertical: 16,
              color: '#FFFFFF',
              fontSize: 18,
              textAlign: 'center',
              minHeight: 56,
            }}
            placeholderTextColor="#888"
            autoFocus={true}
          />
        </Box>
      </Card>
    </VStack>
  </Animated.View>
);

const PhysicalStatsSlide = ({ 
  weight, 
  height, 
  onWeightChange, 
  onHeightChange, 
  fadeAnim 
}: {
  weight: string;
  height: string;
  onWeightChange: (text: string) => void;
  onHeightChange: (text: string) => void;
  fadeAnim: Animated.Value;
}) => (
  <Animated.View
    style={{
      flex: 1,
      opacity: fadeAnim,
      paddingHorizontal: 24,
      justifyContent: 'center',
    }}
  >
    <VStack style={{ alignItems: 'center', gap: 24 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'rgba(255, 210, 10, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
          borderWidth: 2,
          borderColor: 'rgba(255, 210, 10, 0.3)',
        }}
      >
        <Ionicons name="fitness-outline" size={32} color="#FFD20A" />
      </View>
      
      <HStack style={{ gap: 16, width: '100%' }}>
        <Card style={{
          backgroundColor: '#2A2A2A',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 210, 10, 0.2)',
          flex: 1,
        }}>
          <Box style={{ padding: 20 }}>
            <Text style={{ 
              color: '#FFD20A', 
              fontSize: 14, 
              fontWeight: '600', 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              Weight (kg)
            </Text>
            <TextInput
              value={weight}
              onChangeText={onWeightChange}
              placeholder="70"
              keyboardType="numeric"
              style={{
                backgroundColor: '#1E1E1E',
                borderColor: 'rgba(255, 210, 10, 0.3)',
                borderWidth: 2,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: '#FFFFFF',
                fontSize: 18,
                textAlign: 'center',
                minHeight: 48,
              }}
              placeholderTextColor="#888"
            />
          </Box>
        </Card>
        
        <Card style={{
          backgroundColor: '#2A2A2A',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 210, 10, 0.2)',
          flex: 1,
        }}>
          <Box style={{ padding: 20 }}>
            <Text style={{ 
              color: '#FFD20A', 
              fontSize: 14, 
              fontWeight: '600', 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              Height (cm)
            </Text>
            <TextInput
              value={height}
              onChangeText={onHeightChange}
              placeholder="175"
              keyboardType="numeric"
              style={{
                backgroundColor: '#1E1E1E',
                borderColor: 'rgba(255, 210, 10, 0.3)',
                borderWidth: 2,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: '#FFFFFF',
                fontSize: 18,
                textAlign: 'center',
                minHeight: 48,
              }}
              placeholderTextColor="#888"
            />
          </Box>
        </Card>
      </HStack>
    </VStack>
  </Animated.View>
);

export default function UserDetailsForm({navigation, route} : {navigation: any, route?: any}) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Get user data from navigation params or current auth user
  const passedUserData = route?.params?.user;
  const currentUser = auth.currentUser;
  
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateSlideTransition = (direction: 'next' | 'prev') => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: direction === 'next' ? -30 : 30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      animateSlideTransition('next');
      setTimeout(() => setCurrentSlide(currentSlide + 1), 200);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      animateSlideTransition('prev');
      setTimeout(() => setCurrentSlide(currentSlide - 1), 200);
    }
  };

  const canProceed = () => {
    const slide = slides[currentSlide];
    switch (slide.type) {
      case 'userType':
        return selectedUserType !== '';
      case 'text':
        const fieldValue = userDetails[slide.field as keyof UserDetails];
        return fieldValue && fieldValue.toString().trim() !== '';
             case 'physicalStats':
         return (userDetails.weight ?? 0) > 0 && (userDetails.height ?? 0) > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
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
      
      await createUser(finalUserDetails, currentUserId);
      dispatch(setUser(finalUserDetails));
      
      setTimeout(() => {
        auth.currentUser?.reload();
      }, 500);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      const minimalUserDetails: UserDetails = {
        uid: passedUserData?.uid || currentUser?.uid || '',
        fullName: currentUser?.displayName || 'User',
        email: passedUserData?.email || currentUser?.email || '',
        mobileNumber: '',
        dateOfBirth: '',
        weight: 0,
        height: 0,
        isTrainer: false,
        profilePhotoName: '',
      };

      const currentUserId = currentUser?.uid;
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }
      
      await createUser(minimalUserDetails, currentUserId);
      dispatch(setUser(minimalUserDetails));
      
      setTimeout(() => {
        auth.currentUser?.reload();
      }, 500);
      
    } catch (error) {
      console.error('Error creating minimal profile:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string, field: keyof UserDetails) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
  };

  const renderSlide = () => {
    const slide = slides[currentSlide];
    
    switch (slide.type) {
      case 'userType':
        return (
          <UserTypeSlide
            selectedUserType={selectedUserType}
            setSelectedUserType={setSelectedUserType}
            fadeAnim={fadeAnim}
          />
        );
      case 'text':
        return (
          <TextInputSlide
            slide={slide}
            value={(userDetails[slide.field as keyof UserDetails] ?? '').toString()}
            onChangeText={(text) => handleChange(text, slide.field as keyof UserDetails)}
            fadeAnim={fadeAnim}
          />
        );
      case 'physicalStats':
        return (
          <PhysicalStatsSlide
            weight={userDetails.weight?.toString() || ''}
            height={userDetails.height?.toString() || ''}
            onWeightChange={(text) => handleChange(text, 'weight')}
            onHeightChange={(text) => handleChange(text, 'height')}
            fadeAnim={fadeAnim}
          />
        );
      default:
        return null;
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <StatusBar style="light" />
      
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {/* Header */}
        <SafeAreaView style={{ paddingTop: insets.top }}>
          <VStack style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity
                onPress={handleSkip}
                disabled={isSubmitting}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: 'rgba(176, 176, 176, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(176, 176, 176, 0.3)',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                <Text style={{ color: '#B0B0B0', fontSize: 14, fontWeight: '600' }}>
                  Skip for now
                </Text>
              </TouchableOpacity>

              <Text style={{ color: '#B0B0B0', fontSize: 14, fontWeight: '600' }}>
                {currentSlide + 1} of {slides.length}
              </Text>
            </HStack>

            {/* Progress Bar */}
            <Box style={{ 
              height: 6, 
              backgroundColor: '#333333', 
              borderRadius: 3,
              overflow: 'hidden',
              marginBottom: 32,
            }}>
              <Animated.View
                style={{
                  height: 6,
                  borderRadius: 3,
                  width: `${((currentSlide + 1) / slides.length) * 100}%`,
                  backgroundColor: '#FFD20A',
                }}
              />
            </Box>

            {/* Slide Title */}
            <VStack style={{ alignItems: 'center', marginBottom: 20 }}>
              <Heading 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: 28,
                  fontWeight: '800',
                  textAlign: 'center',
                  marginBottom: 8,
                  letterSpacing: -0.5,
                }}
              >
                {currentSlideData.title}
              </Heading>
              <Text style={{ 
                color: '#B0B0B0', 
                fontSize: 16,
                textAlign: 'center',
                lineHeight: 22,
                paddingHorizontal: 20,
              }}>
                {currentSlideData.subtitle}
              </Text>
            </VStack>
          </VStack>
        </SafeAreaView>

        {/* Slide Content */}
        <View style={{ flex: 1 }}>
          {renderSlide()}
        </View>

        {/* Navigation Buttons */}
        <SafeAreaView style={{ paddingBottom: insets.bottom }}>
          <Box style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
            <HStack style={{ gap: 16 }}>
              {currentSlide > 0 && (
                <TouchableOpacity
                  onPress={prevSlide}
                  style={{
                    flex: 1,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <HStack style={{ alignItems: 'center', gap: 8 }}>
                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                      Back
                    </Text>
                  </HStack>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={currentSlide === slides.length - 1 ? handleSubmit : nextSlide}
                disabled={!canProceed() || isSubmitting}
                style={{
                  flex: currentSlide > 0 ? 2 : 1,
                  borderRadius: 24,
                  overflow: 'hidden',
                  opacity: (!canProceed() || isSubmitting) ? 0.5 : 1,
                }}
              >
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={{
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <HStack style={{ alignItems: 'center', gap: 8 }}>
                    {isSubmitting ? (
                      <>
                        <ActivityIndicator size="small" color="#1E1E1E" />
                        <Text style={{ color: '#1E1E1E', fontSize: 16, fontWeight: '700' }}>
                          Creating...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ color: '#1E1E1E', fontSize: 16, fontWeight: '700' }}>
                          {currentSlide === slides.length - 1 ? 'Complete Setup' : 'Continue'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#1E1E1E" />
                      </>
                    )}
                  </HStack>
                </LinearGradient>
              </TouchableOpacity>
            </HStack>
          </Box>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}


