import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, RefreshControl, Animated, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../constants/dataModels/exercise.model';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const { width } = Dimensions.get('window');

// Animated Form Field Component
const FormField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  icon,
  animatedValue,
  index = 0,
  multiline = false
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  animatedValue: Animated.Value;
  index?: number;
  multiline?: boolean;
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [{ 
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [30 + (index * 10), 0]
        })
      }]
    }}
  >
    <Card 
      className="mb-4 p-0" 
      style={{
        backgroundColor: '#2A2A2A',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Box className="p-5">
        <HStack className="items-center mb-3">
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'rgba(255, 210, 10, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name={icon as any} size={14} color="#FFD20A" />
          </Box>
          <Text style={{ color: '#FFD20A', fontSize: 14, fontWeight: '600' }}>
            {label}
          </Text>
        </HStack>
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          style={{
            backgroundColor: '#1E1E1E',
            borderColor: 'rgba(255, 210, 10, 0.2)',
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: multiline ? 16 : 14,
            color: '#FFFFFF',
            fontSize: 16,
            textAlignVertical: multiline ? 'top' : 'center',
            minHeight: multiline ? 80 : 50,
          }}
          placeholderTextColor="#888"
        />
      </Box>
    </Card>
  </Animated.View>
);

// Difficulty Selector Component
const DifficultySelector = ({ 
  selectedDifficulty, 
  onSelect, 
  animatedValue 
}: {
  selectedDifficulty: string;
  onSelect: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  animatedValue: Animated.Value;
}) => {
  const difficulties = [
    { key: 'beginner', label: 'Beginner', color: '#4CAF50', icon: 'leaf' },
    { key: 'intermediate', label: 'Intermediate', color: '#FF9800', icon: 'flash' },
    { key: 'advanced', label: 'Advanced', color: '#F44336', icon: 'flame' },
  ];

  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [{ 
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0]
          })
        }]
      }}
    >
      <Card 
        className="mb-4 p-0" 
        style={{
          backgroundColor: '#2A2A2A',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Box className="p-5">
          <HStack className="items-center mb-4">
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: 'rgba(255, 210, 10, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="barbell" size={14} color="#FFD20A" />
            </Box>
            <Text style={{ color: '#FFD20A', fontSize: 14, fontWeight: '600' }}>
              Difficulty Level
            </Text>
          </HStack>
          
          <HStack className="justify-between">
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty.key}
                onPress={() => onSelect(difficulty.key as 'beginner' | 'intermediate' | 'advanced')}
                style={{
                  flex: 1,
                  marginHorizontal: 4,
                  backgroundColor: selectedDifficulty === difficulty.key ? difficulty.color : '#1E1E1E',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: selectedDifficulty === difficulty.key ? difficulty.color : 'rgba(255, 210, 10, 0.2)',
                }}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={difficulty.icon as any} 
                  size={16} 
                  color={selectedDifficulty === difficulty.key ? '#FFFFFF' : difficulty.color} 
                  style={{ marginBottom: 4 }}
                />
                <Text style={{ 
                  color: selectedDifficulty === difficulty.key ? '#FFFFFF' : difficulty.color,
                  fontSize: 12,
                  fontWeight: '600'
                }}>
                  {difficulty.label}
                </Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </Box>
      </Card>
    </Animated.View>
  );
};

// Exercise Image Section
const ExerciseImageSection = ({ 
  imageUrl, 
  exerciseName,
  animatedValue
}: {
  imageUrl?: string;
  exerciseName: string;
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
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
          activeOpacity={0.8}
        >
          <Avatar size="2xl" style={{ width: 140, height: 140, borderWidth: 4, borderColor: '#FFD20A' }}>
            {imageUrl ? (
              <AvatarImage 
                source={{ uri: imageUrl }}
                alt="Exercise"
                style={{ width: 140, height: 140, borderRadius: 70 }}
              />
            ) : (
              <LinearGradient
                colors={['#FFD20A', '#FFA500']}
                style={{ 
                  width: 140, 
                  height: 140, 
                  borderRadius: 70, 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
              >
                <AvatarFallbackText 
                  className="font-bold"
                  style={{ color: '#1E1E1E', fontSize: 24 }}
                >
                  {exerciseName.split(' ').map(word => word[0]).join('').slice(0, 2) || 'EX'}
                </AvatarFallbackText>
              </LinearGradient>
            )}
          </Avatar>
        </TouchableOpacity>
        
        {/* Exercise Icon */}
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: '#1E1E1E',
          }}
        >
          <LinearGradient
            colors={['#FFD20A', '#FFA500']}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="fitness" size={20} color="#1E1E1E" />
          </LinearGradient>
        </Box>
      </Box>
      
      <VStack className="items-center mt-4">
        <Heading size="md" className="font-bold" style={{ color: '#FFFFFF', marginBottom: 4 }}>
          {exerciseName || 'Custom Exercise'}
        </Heading>
        <Text style={{ color: '#B0B0B0', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
          Custom exercise created by trainer
        </Text>
      </VStack>
    </Box>
  </Animated.View>
);

export default function EditExercise({ navigation }: { navigation: any }) {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const exerciseInfo = (route.params as { exerciseInfo?: Exercise })?.exerciseInfo;
  
  const [exercise, setExercise] = useState<Partial<Exercise>>({
    name: exerciseInfo?.name || '',
    category: exerciseInfo?.category || '',
    primaryMuscles: exerciseInfo?.primaryMuscles || [],
    secondaryMuscles: exerciseInfo?.secondaryMuscles || [],
    equipment: exerciseInfo?.equipment || [],
    instructions: exerciseInfo?.instructions || '',
    difficulty: exerciseInfo?.difficulty || 'beginner',
    source: 'custom',
    createdBy: exerciseInfo?.createdBy || '',
    isPublic: exerciseInfo?.isPublic || false,
    tags: exerciseInfo?.tags || [],
    image: exerciseInfo?.image || '',
  });
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const headerAnim = new Animated.Value(0);
  const imageAnim = new Animated.Value(0);
  const formAnim = new Animated.Value(0);
  const buttonAnim = new Animated.Value(0);

  useEffect(() => {
    // Complex entrance animation sequence
    Animated.sequence([
      // Header animation first
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Image section
      Animated.timing(imageAnim, {
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
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleUpdate = async () => {
    if (!exercise.name || !exercise.category) {
      Alert.alert('Validation Error', 'Please fill in the required fields (Name and Category).');
      return;
    }

    setIsSaving(true);
    
    try {
      // Here you would typically call your exercise update API
      console.log('Exercise updated:', exercise);
      
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
        navigation.goBack();
      });
    } catch (error) {
      console.log('Error updating exercise:', error);
      Alert.alert('Error', 'Failed to update exercise. Please try again.');
      setIsSaving(false);
    }
  };

  const handleChange = (value: string, field: keyof Exercise) => {
    setExercise({ ...exercise, [field]: value });
  };

  const handleArrayChange = (value: string, field: 'primaryMuscles' | 'secondaryMuscles' | 'equipment' | 'tags') => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setExercise({ ...exercise, [field]: arrayValue });
  };

  const handleGoBack = () => {
    // Add exit animation before navigation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  const formFields = [
    { key: 'name', label: 'Exercise Name *', icon: 'fitness', placeholder: 'Enter exercise name', required: true },
    { key: 'category', label: 'Category *', icon: 'albums', placeholder: 'e.g., Strength, Cardio, Flexibility', required: true },
    { key: 'primaryMuscles', label: 'Primary Muscles', icon: 'body', placeholder: 'e.g., chest, shoulders (comma separated)', array: true },
    { key: 'secondaryMuscles', label: 'Secondary Muscles', icon: 'body-outline', placeholder: 'e.g., triceps, core (comma separated)', array: true },
    { key: 'equipment', label: 'Equipment', icon: 'barbell', placeholder: 'e.g., dumbbells, barbell (comma separated)', array: true },
    { key: 'instructions', label: 'Instructions', icon: 'list', placeholder: 'Detailed exercise instructions...', multiline: true },
    { key: 'tags', label: 'Tags', icon: 'pricetag', placeholder: 'e.g., beginner-friendly, compound (comma separated)', array: true },
  ];

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Enhanced Header Section */}
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
            paddingTop: insets.top + 10,
            paddingBottom: 10,
          }}
        >
          <Box className="px-6 py-4">
            <HStack className="items-center">
              <TouchableOpacity 
                onPress={handleGoBack}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 210, 10, 0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                  shadowColor: '#FFD20A',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={24} color="#FFD20A" />
              </TouchableOpacity>
              
              <VStack className="flex-1">
                <Heading 
                  size="xl" 
                  className="font-bold" 
                  style={{ 
                    color: '#FFD20A', 
                    fontSize: 26,
                    letterSpacing: -0.5,
                    marginBottom: 2,
                  }}
                >
                  Edit Exercise
                </Heading>
                <Text style={{ color: '#B0B0B0', fontSize: 15, fontWeight: '500' }}>
                  Update custom exercise details
                </Text>
              </VStack>

              {/* Save Indicator */}
              {isSaving && (
                <Box
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator size="small" color="#4CAF50" />
                </Box>
              )}
            </HStack>
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
            paddingBottom: insets.bottom + 20,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD20A" />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Exercise Image Section */}
          <Box className="px-6 py-6">
            <ExerciseImageSection
              imageUrl={exercise.image}
              exerciseName={exercise.name || 'Custom Exercise'}
              animatedValue={imageAnim}
            />
          </Box>

          {/* Form Fields Section */}
          <Box className="px-4">
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
              <HStack className="items-center mb-6" style={{ paddingHorizontal: 8 }}>
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
                <Heading size="lg" className="font-bold" style={{ color: '#FFFFFF' }}>
                  Exercise Details
                </Heading>
              </HStack>
            </Animated.View>

            {formFields.map((field, index) => (
              <FormField
                key={field.key}
                label={field.label}
                value={
                  field.array 
                    ? (exercise[field.key as keyof Exercise] as string[] || []).join(', ')
                    : (exercise[field.key as keyof Exercise] as string || '')
                }
                onChangeText={(text) => 
                  field.array 
                    ? handleArrayChange(text, field.key as 'primaryMuscles' | 'secondaryMuscles' | 'equipment' | 'tags')
                    : handleChange(text, field.key as keyof Exercise)
                }
                placeholder={field.placeholder}
                icon={field.icon}
                animatedValue={formAnim}
                index={index}
                multiline={field.multiline}
              />
            ))}

            {/* Difficulty Selector */}
            <DifficultySelector
              selectedDifficulty={exercise.difficulty || 'beginner'}
              onSelect={(difficulty) => handleChange(difficulty, 'difficulty')}
              animatedValue={formAnim}
            />
          </Box>

          {/* Update Button */}
          <Animated.View
            style={{
              opacity: buttonAnim,
              transform: [{ 
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0]
                })
              }]
            }}
          >
            <Box className="px-6 py-6">
              <TouchableOpacity
                onPress={handleUpdate}
                disabled={isSaving}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: '#FFD20A',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                  opacity: isSaving ? 0.7 : 1,
                }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={{
                    padding: 20,
                    alignItems: 'center',
                  }}
                >
                  <HStack className="items-center">
                    {isSaving ? (
                      <>
                        <ActivityIndicator size="small" color="#1E1E1E" style={{ marginRight: 12 }} />
                        <Text style={{ color: '#1E1E1E', fontSize: 16, fontWeight: '700' }}>
                          Saving Changes...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={24} color="#1E1E1E" style={{ marginRight: 12 }} />
                        <Text style={{ color: '#1E1E1E', fontSize: 16, fontWeight: '700' }}>
                          Update Exercise
                        </Text>
                      </>
                    )}
                  </HStack>
                </LinearGradient>
              </TouchableOpacity>
            </Box>
          </Animated.View>

          {/* Tips Section */}
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
              <LinearGradient
                colors={['rgba(255, 210, 10, 0.05)', 'transparent']}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Ionicons name="bulb" size={20} color="#FFD20A" style={{ marginBottom: 8 }} />
                <Text 
                  style={{ 
                    textAlign: 'center', 
                    color: '#B0B0B0', 
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  Provide clear instructions and accurate muscle groups to help clients perform exercises safely and effectively.
                </Text>
              </LinearGradient>
            </Box>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
