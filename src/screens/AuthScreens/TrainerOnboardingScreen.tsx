import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Dimensions, Animated, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

// Navigation
import { HOME, BOTTOM_TABS } from '../../constants/screenNames';

const { width } = Dimensions.get('window');

const experienceLevels = [
  { id: '1-2', label: '1-2 years', icon: 'leaf-outline' },
  { id: '3-5', label: '3-5 years', icon: 'fitness-outline' },
  { id: '6-10', label: '6-10 years', icon: 'trophy-outline' },
  { id: '10+', label: '10+ years', icon: 'medal-outline' },
];

const specializations = [
  { id: 'weight-loss', label: 'Weight Loss', icon: 'scale-outline', color: '#FF6B6B' },
  { id: 'muscle-building', label: 'Muscle Building', icon: 'barbell-outline', color: '#4CAF50' },
  { id: 'strength', label: 'Strength Training', icon: 'fitness-outline', color: '#FFD20A' },
  { id: 'cardio', label: 'Cardio', icon: 'heart-outline', color: '#2196F3' },
  { id: 'yoga', label: 'Yoga', icon: 'leaf-outline', color: '#9C27B0' },
  { id: 'pilates', label: 'Pilates', icon: 'body-outline', color: '#FF9800' },
  { id: 'crossfit', label: 'CrossFit', icon: 'flame-outline', color: '#F44336' },
  { id: 'bodybuilding', label: 'Bodybuilding', icon: 'medal-outline', color: '#795548' },
  { id: 'sports', label: 'Sports Training', icon: 'basketball-outline', color: '#607D8B' },
  { id: 'rehab', label: 'Rehabilitation', icon: 'medical-outline', color: '#00BCD4' },
];

const onboardingSteps = [
  {
    id: 1,
    title: 'Professional Profile',
    subtitle: 'Tell us about your expertise',
    icon: 'person-circle-outline',
    gradient: ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
  },
  {
    id: 2,
    title: 'Certifications',
    subtitle: 'Your specializations and credentials',
    icon: 'ribbon-outline',
    gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]],
  },
  {
    id: 3,
    title: 'Business Setup',
    subtitle: 'Rates and availability',
    icon: 'business-outline',
    gradient: ['#2196F3', '#1976D2'] as [string, string, ...string[]],
  },
  {
    id: 4,
    title: 'Welcome Aboard!',
    subtitle: 'Ready to start training',
    icon: 'rocket-outline',
    gradient: ['#9C27B0', '#7B1FA2'] as [string, string, ...string[]],
  },
];

export default function TrainerOnboardingScreen({ navigation }: { navigation: any }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  // Form data
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    specializations: [] as string[],
    credentials: '',
    hourlyRate: '',
    monthlyRate: '',
    availability: '',
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: currentStep / onboardingSteps.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Here you would save the trainer data to Firebase
      console.log('Trainer onboarding data:', formData);
      
      // Add exit animation before navigation
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
        navigation.navigate(BOTTOM_TABS, { screen: HOME });
      });
    } catch (error) {
      console.error('Error completing trainer onboarding:', error);
      setIsSubmitting(false);
    }
  };

  const FormField = ({ 
    icon, 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    multiline = false,
    keyboardType = 'default' 
  }: {
    icon: string;
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    keyboardType?: any;
  }) => (
    <Card 
      className="mb-4 p-0" 
      style={{
        backgroundColor: '#2A2A2A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 210, 10, 0.1)',
      }}
    >
      <Box className="p-4">
        <HStack className="items-center mb-3">
          <Ionicons name={icon as any} size={18} color="#FFD20A" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFD20A', fontSize: 14, fontWeight: '600' }}>
            {label}
          </Text>
        </HStack>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          style={{
            backgroundColor: '#1E1E1E',
            borderColor: 'rgba(255, 210, 10, 0.2)',
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            color: '#FFFFFF',
            fontSize: 16,
            minHeight: multiline ? 100 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          placeholderTextColor="#888"
        />
      </Box>
    </Card>
  );

  const SelectionCard = ({ 
    item, 
    isSelected, 
    onPress,
    showColor = false 
  }: {
    item: any;
    isSelected: boolean;
    onPress: () => void;
    showColor?: boolean;
  }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card 
        className="mb-3 p-0" 
        style={{
          backgroundColor: '#2A2A2A', // Solid background for shadow optimization
          borderRadius: 16,
          borderWidth: isSelected ? 3 : 2,
          borderColor: isSelected ? '#FFD20A' : 'rgba(255, 255, 255, 0.05)',
          shadowColor: isSelected ? '#FFD20A' : 'transparent',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isSelected ? 0.3 : 0,
          shadowRadius: 8,
          elevation: isSelected ? 8 : 0,
        }}
      >
        <Box className="p-4">
          <HStack className="items-center">
            <Box
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: showColor ? item.color : (isSelected ? '#FFD20A' : '#333333'),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons 
                name={item.icon as any} 
                size={20} 
                color={showColor ? '#FFFFFF' : (isSelected ? '#1E1E1E' : '#FFD20A')} 
              />
            </Box>
            
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isSelected ? '#FFD20A' : '#FFFFFF',
                flex: 1,
              }}
            >
              {item.label}
            </Text>
            
            <Box
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: isSelected ? '#FFD20A' : 'transparent',
                borderWidth: 2,
                borderColor: isSelected ? '#FFD20A' : '#666',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={12} color="#1E1E1E" />
              )}
            </Box>
          </HStack>
        </Box>
      </Card>
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VStack className="space-y-6">
            <Text style={{ color: '#B0B0B0', fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
              Share your background and experience to help trainees understand your expertise.
            </Text>
            
            <FormField
              icon="document-text-outline"
              label="Professional Bio"
              placeholder="Tell us about your training philosophy and approach..."
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              multiline={true}
            />

            <VStack className="space-y-3">
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                Years of Experience
              </Text>
              {experienceLevels.map((level) => (
                <SelectionCard
                  key={level.id}
                  item={level}
                  isSelected={formData.experience === level.id}
                  onPress={() => setFormData(prev => ({ ...prev, experience: level.id }))}
                />
              ))}
            </VStack>
          </VStack>
        );

      case 2:
        return (
          <VStack className="space-y-6">
            <Text style={{ color: '#B0B0B0', fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
              Select your areas of expertise to attract the right clients.
            </Text>
            
            <VStack className="space-y-3">
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                Specializations (Select multiple)
              </Text>
              {specializations.map((spec) => (
                <SelectionCard
                  key={spec.id}
                  item={spec}
                  isSelected={formData.specializations.includes(spec.id)}
                  onPress={() => {
                    const newSpecs = formData.specializations.includes(spec.id)
                      ? formData.specializations.filter(s => s !== spec.id)
                      : [...formData.specializations, spec.id];
                    setFormData(prev => ({ ...prev, specializations: newSpecs }));
                  }}
                  showColor={true}
                />
              ))}
            </VStack>

            <FormField
              icon="ribbon-outline"
              label="Certifications & Credentials"
              placeholder="List your certifications, degrees, or qualifications..."
              value={formData.credentials}
              onChangeText={(text) => setFormData(prev => ({ ...prev, credentials: text }))}
              multiline={true}
            />
          </VStack>
        );

      case 3:
        return (
          <VStack className="space-y-6">
            <Text style={{ color: '#B0B0B0', fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
              Set your rates and availability to start accepting clients.
            </Text>
            
            <HStack className="space-x-4">
              <Box style={{ flex: 1 }}>
                <FormField
                  icon="cash-outline"
                  label="Per Session Rate (₹)"
                  placeholder="1500"
                  value={formData.hourlyRate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, hourlyRate: text }))}
                  keyboardType="numeric"
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <FormField
                  icon="calendar-outline"
                  label="Monthly Rate (₹)"
                  placeholder="12000"
                  value={formData.monthlyRate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, monthlyRate: text }))}
                  keyboardType="numeric"
                />
              </Box>
            </HStack>

            <FormField
              icon="time-outline"
              label="Availability Schedule"
              placeholder="e.g., Mon-Fri 6AM-8PM, Sat 8AM-12PM..."
              value={formData.availability}
              onChangeText={(text) => setFormData(prev => ({ ...prev, availability: text }))}
              multiline={true}
            />
          </VStack>
        );

      case 4:
        return (
          <VStack className="items-center space-y-8">
            <Box
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#FFD20A', // Solid background for shadow optimization
                shadowColor: '#FFD20A',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 15,
                marginBottom: 20,
              }}
            >
              <LinearGradient
                colors={['#FFD20A', '#FFA500']}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="trophy" size={48} color="#1E1E1E" />
              </LinearGradient>
            </Box>

            <VStack className="items-center space-y-4">
              <Heading 
                size="xl" 
                className="font-bold text-center" 
                style={{ color: '#FFFFFF', fontSize: 24 }}
              >
                Congratulations! 🎉
              </Heading>
              <Text style={{ color: '#FFD20A', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
                You're now a certified ManiFit trainer!
              </Text>
              <Text style={{ color: '#B0B0B0', fontSize: 14, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 }}>
                Start building your client base, create workout routines, and help others achieve their fitness goals.
              </Text>
            </VStack>

            <Card 
              className="p-0 w-full" 
              style={{
                backgroundColor: 'rgba(255, 210, 10, 0.05)',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(255, 210, 10, 0.2)',
              }}
            >
              <Box className="p-6">
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                  Next Steps:
                </Text>
                <VStack className="space-y-3">
                  <HStack className="items-center">
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginRight: 12 }} />
                    <Text style={{ color: '#B0B0B0', fontSize: 14, flex: 1 }}>
                      Create your first workout routine
                    </Text>
                  </HStack>
                  <HStack className="items-center">
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginRight: 12 }} />
                    <Text style={{ color: '#B0B0B0', fontSize: 14, flex: 1 }}>
                      Connect with your first trainee
                    </Text>
                  </HStack>
                  <HStack className="items-center">
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginRight: 12 }} />
                    <Text style={{ color: '#B0B0B0', fontSize: 14, flex: 1 }}>
                      Start tracking client progress
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Card>
          </VStack>
        );

      default:
        return null;
    }
  };

  const currentStepData = onboardingSteps[currentStep - 1];

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
        {/* Header */}
        <SafeAreaView style={{ paddingTop: insets.top }}>
          <LinearGradient
            colors={currentStepData.gradient}
            style={{ paddingBottom: 20, opacity: 0.1 }}
          >
            <Box />
          </LinearGradient>
          <Box style={{ position: 'absolute', top: insets.top, left: 0, right: 0, paddingBottom: 20 }}>
            <VStack className="px-6 py-4">
              <HStack className="justify-between items-center mb-6">
                <VStack className="flex-1">
                  <Text style={{ color: '#B0B0B0', fontSize: 14, fontWeight: '600' }}>
                    Step {currentStep} of {onboardingSteps.length}
                  </Text>
                  <Heading 
                    size="xl" 
                    className="font-bold" 
                    style={{ color: '#FFFFFF', fontSize: 22, marginTop: 4 }}
                  >
                    {currentStepData.title}
                  </Heading>
                  <Text style={{ color: currentStepData.gradient[0], fontSize: 14, marginTop: 2 }}>
                    {currentStepData.subtitle}
                  </Text>
                </VStack>
                
                <Box
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: currentStepData.gradient[0], // Solid background for shadow optimization
                    shadowColor: currentStepData.gradient[0],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <LinearGradient
                    colors={currentStepData.gradient}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name={currentStepData.icon as any} size={24} color="#FFFFFF" />
                  </LinearGradient>
                </Box>
              </HStack>

              {/* Progress Bar */}
              <Box style={{ height: 4, backgroundColor: 'rgba(255, 210, 10, 0.2)', borderRadius: 2 }}>
                <Animated.View
                  style={{
                    height: 4,
                    backgroundColor: currentStepData.gradient[0],
                    borderRadius: 2,
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                />
              </Box>
            </VStack>
          </Box>
        </SafeAreaView>

        {/* Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingBottom: insets.bottom + 120,
            paddingTop: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>

        {/* Bottom Buttons */}
        <SafeAreaView style={{ paddingBottom: insets.bottom }}>
          <HStack className="px-6 py-4 space-x-4">
            {currentStep > 1 && currentStep < onboardingSteps.length && (
              <TouchableOpacity
                onPress={prevStep}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: 'rgba(255, 210, 10, 0.3)',
                  backgroundColor: 'rgba(255, 210, 10, 0.05)',
                  paddingVertical: 16,
                  alignItems: 'center',
                }}
                activeOpacity={0.8}
              >
                <HStack className="items-center">
                  <Ionicons name="chevron-back" size={18} color="#FFD20A" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#FFD20A', fontSize: 16, fontWeight: '600' }}>
                    Back
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={currentStep === onboardingSteps.length ? handleComplete : nextStep}
              disabled={isSubmitting}
              style={{
                flex: currentStep === 1 ? 1 : 2,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: currentStepData.gradient[0], // Solid background for shadow optimization
                shadowColor: currentStepData.gradient[0],
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
                opacity: isSubmitting ? 0.7 : 1,
              }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={currentStepData.gradient}
                style={{
                  paddingVertical: 16,
                  alignItems: 'center',
                }}
              >
                <HStack className="items-center">
                  {isSubmitting ? (
                    <>
                      <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
                        Setting up...
                      </Text>
                    </>
                  ) : currentStep === onboardingSteps.length ? (
                    <>
                      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginRight: 8 }}>
                        Start Training
                      </Text>
                      <Ionicons name="rocket" size={18} color="#FFFFFF" />
                    </>
                  ) : (
                    <>
                      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginRight: 8 }}>
                        Continue
                      </Text>
                      <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                    </>
                  )}
                </HStack>
              </LinearGradient>
            </TouchableOpacity>
          </HStack>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
} 