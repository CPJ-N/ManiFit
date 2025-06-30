import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
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
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

const userTypes = [
  {
    id: 'trainee',
    title: 'Looking for Training',
    subtitle: 'I want to get fit',
    icon: 'fitness-outline',
    isTrainer: false,
  },
  {
    id: 'trainer',
    title: 'Personal Trainer',
    subtitle: 'I train others',
    icon: 'barbell-outline',
    isTrainer: true,
  },
];

export default function UserDetailsForm() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    dateOfBirth: '',
    weight: '',
    height: '',
    isTrainer: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const userDetails: UserDetails = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim() || undefined,
        isTrainer: formData.isTrainer,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      await createUser(userDetails, currentUser.uid);
      dispatch(setUser(userDetails));
      
      console.log('✅ User profile created successfully');
      
    } catch (error) {
      console.error('💥 Error creating user profile:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#1A1A1A', '#2A2A2A', '#1A1A1A']}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />
        
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            padding: 24,
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <VStack className="mb-8">
            <Heading 
              size="2xl" 
              style={{ 
                color: '#FFFFFF', 
                marginBottom: 8,
                fontWeight: '800',
              }}
            >
              Complete Your Profile
            </Heading>
            <Text style={{ color: '#B0B0B0', fontSize: 16 }}>
              Tell us about yourself to get started
            </Text>
          </VStack>

          {/* User Type Selection */}
          <VStack className="mb-6">
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
              I am a...
            </Text>
            <HStack className="gap-3">
              {userTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => updateField('isTrainer', type.isTrainer)}
                  style={{ flex: 1 }}
                >
                  <Card 
                    className="p-4"
                    style={{
                      backgroundColor: formData.isTrainer === type.isTrainer ? '#FFD20A' : '#2A2A2A',
                      borderWidth: 2,
                      borderColor: formData.isTrainer === type.isTrainer ? '#FFD20A' : '#444',
                    }}
                  >
                    <VStack className="items-center">
                      <Ionicons 
                        name={type.icon as any} 
                        size={32} 
                        color={formData.isTrainer === type.isTrainer ? '#1E1E1E' : '#FFD20A'} 
                        style={{ marginBottom: 8 }}
                      />
                      <Text 
                        style={{ 
                          color: formData.isTrainer === type.isTrainer ? '#1E1E1E' : '#FFFFFF',
                          fontSize: 14,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        {type.title}
                      </Text>
                      <Text 
                        style={{ 
                          color: formData.isTrainer === type.isTrainer ? '#1E1E1E' : '#B0B0B0',
                          fontSize: 12,
                          textAlign: 'center',
                          marginTop: 4,
                        }}
                      >
                        {type.subtitle}
                      </Text>
                    </VStack>
                  </Card>
                </TouchableOpacity>
              ))}
            </HStack>
          </VStack>

          {/* Form Fields */}
          <VStack className="gap-4 mb-8">
            {/* Full Name - Required */}
            <VStack>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                Full Name *
              </Text>
              <TextInput
                value={formData.fullName}
                onChangeText={(text) => updateField('fullName', text)}
                placeholder="Enter your full name"
                placeholderTextColor="#666"
                style={{
                  backgroundColor: '#2A2A2A',
                  borderWidth: 1,
                  borderColor: '#444',
                  borderRadius: 12,
                  padding: 16,
                  color: '#FFFFFF',
                  fontSize: 16,
                }}
              />
            </VStack>

            {/* Phone Number - Optional */}
            <VStack>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                Phone Number
              </Text>
              <TextInput
                value={formData.mobileNumber}
                onChangeText={(text) => updateField('mobileNumber', text)}
                placeholder="Enter your phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                style={{
                  backgroundColor: '#2A2A2A',
                  borderWidth: 1,
                  borderColor: '#444',
                  borderRadius: 12,
                  padding: 16,
                  color: '#FFFFFF',
                  fontSize: 16,
                }}
              />
            </VStack>

            {/* Date of Birth - Optional */}
            <VStack>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                Date of Birth
              </Text>
              <TextInput
                value={formData.dateOfBirth}
                onChangeText={(text) => updateField('dateOfBirth', text)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#666"
                style={{
                  backgroundColor: '#2A2A2A',
                  borderWidth: 1,
                  borderColor: '#444',
                  borderRadius: 12,
                  padding: 16,
                  color: '#FFFFFF',
                  fontSize: 16,
                }}
              />
            </VStack>

            {/* Physical Stats */}
            <HStack className="gap-3">
              <VStack style={{ flex: 1 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                  Weight (kg)
                </Text>
                <TextInput
                  value={formData.weight}
                  onChangeText={(text) => updateField('weight', text)}
                  placeholder="70"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: '#2A2A2A',
                    borderWidth: 1,
                    borderColor: '#444',
                    borderRadius: 12,
                    padding: 16,
                    color: '#FFFFFF',
                    fontSize: 16,
                  }}
                />
              </VStack>
              
              <VStack style={{ flex: 1 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                  Height (cm)
                </Text>
                <TextInput
                  value={formData.height}
                  onChangeText={(text) => updateField('height', text)}
                  placeholder="175"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: '#2A2A2A',
                    borderWidth: 1,
                    borderColor: '#444',
                    borderRadius: 12,
                    padding: 16,
                    color: '#FFFFFF',
                    fontSize: 16,
                  }}
                />
              </VStack>
            </HStack>
          </VStack>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !formData.fullName.trim()}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              opacity: isLoading || !formData.fullName.trim() ? 0.7 : 1,
            }}
          >
            <LinearGradient
              colors={['#FFD20A', '#FFA500']}
              style={{
                padding: 18,
                alignItems: 'center',
              }}
            >
              <HStack className="items-center">
                {isLoading && (
                  <Ionicons name="refresh" size={20} color="#1E1E1E" style={{ marginRight: 8 }} />
                )}
                <Text style={{ 
                  color: '#1E1E1E', 
                  fontSize: 18, 
                  fontWeight: '700',
                }}>
                  {isLoading ? 'Creating Profile...' : 'Complete Setup'}
                </Text>
              </HStack>
            </LinearGradient>
          </TouchableOpacity>

          <Text 
            style={{ 
              color: '#666', 
              fontSize: 12, 
              textAlign: 'center', 
              marginTop: 16,
            }}
          >
            Fields marked with * are required
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}