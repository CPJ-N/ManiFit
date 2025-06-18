import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, RefreshControl, Animated, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { setUser, setUserImageUrl } from '../../store/userSlice';
import { RootState } from '../../store/reduxStore';
import { updateUser } from '../../utils/controllers/userController';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../../config/firebase';
import { getImageUrl, uploadImage } from '../../utils/controllers/imageController';
import { firebaseBucketName } from '../../constants/firebaseContant';
import { pickImage } from '../../utils/imageHelpers/imagePicker';
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
  index = 0
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  animatedValue: Animated.Value;
  index?: number;
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
          style={{
            backgroundColor: '#1E1E1E',
            borderColor: 'rgba(255, 210, 10, 0.2)',
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#FFFFFF',
            fontSize: 16,
          }}
          placeholderTextColor="#888"
        />
      </Box>
    </Card>
  </Animated.View>
);

// Animated Profile Image Section
const ProfileImageSection = ({ 
  userImageUrl, 
  selectedImage, 
  userInfo, 
  isUploading, 
  onImageUpload,
  animatedValue
}: {
  userImageUrl: string | null;
  selectedImage: string;
  userInfo: UserDetails | null;
  isUploading: boolean;
  onImageUpload: () => void;
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
          onPress={onImageUpload}
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
            {userImageUrl || selectedImage ? (
              <AvatarImage 
                source={{ uri: userImageUrl || selectedImage }}
                alt="Profile"
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
                  style={{ color: '#1E1E1E', fontSize: 36 }}
                >
                  {userInfo?.fullName?.split(' ').map(name => name[0]).join('') || 'U'}
                </AvatarFallbackText>
              </LinearGradient>
            )}
          </Avatar>
        </TouchableOpacity>
        
        {/* Camera/Loading Indicator */}
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
            {isUploading ? (
              <ActivityIndicator size="small" color="#1E1E1E" />
            ) : (
              <Ionicons name="camera" size={20} color="#1E1E1E" />
            )}
          </LinearGradient>
        </Box>
      </Box>
      
      <VStack className="items-center mt-4">
        <Heading size="md" className="font-bold" style={{ color: '#FFFFFF', marginBottom: 4 }}>
          {userInfo?.fullName || 'Edit Profile'}
        </Heading>
        <Text style={{ color: '#FFD20A', fontSize: 14, opacity: 0.8 }}>
          {auth.currentUser?.email}
        </Text>
        <Text style={{ color: '#B0B0B0', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
          Tap to change profile picture
        </Text>
      </VStack>
    </Box>
  </Animated.View>
);

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const { userInfo, userImageUrl } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
  
  const [profile, setProfile] = useState<Partial<UserDetails>>({
    fullName: userInfo?.fullName,
    mobileNumber: userInfo?.mobileNumber,
    dateOfBirth: userInfo?.dateOfBirth,
    weight: userInfo?.weight,
    height: userInfo?.height,
  });
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const headerAnim = new Animated.Value(0);
  const profileAnim = new Animated.Value(0);
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

  const handleImageUpload = async () => {
    setIsUploading(true);
    const imageUri = await pickImage();
    if (imageUri) {
      setSelectedImage(imageUri);
      await uploadImage(imageUri).then(async (result) => {
        const updateProfileInfo: UserDetails = { 
          ...userInfo, 
          profilePhotoName: result?.metadata.name, 
          email: userInfo?.email || '', 
          fullName: userInfo?.fullName || '', 
          isTrainer: userInfo?.isTrainer ?? false 
        };
        await updateUser(auth.currentUser?.uid || '', updateProfileInfo);
        dispatch(setUser(updateProfileInfo));
        const uploadedImageUrl = await getImageUrl(firebaseBucketName.userImages, updateProfileInfo.profilePhotoName || '');
        dispatch(setUserImageUrl(uploadedImageUrl));
        setSelectedImage('');
        console.log('Image URL:', uploadedImageUrl);
      }).catch((error) => {
        console.log('Error uploading image:', error);
      });
    } else {
      console.log("No image picked");
    }
    setIsUploading(false);
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    
    const updateProfileInfo: UserDetails = { ...userInfo, ...profile } as UserDetails;
    await updateUser(auth.currentUser?.uid || '', updateProfileInfo).then(() => {
      dispatch(setUser(updateProfileInfo));
      console.log('Profile updated:', updateProfileInfo);
      
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
    }).catch((error) => {
      console.log('Error updating profile:', error);
      setIsSaving(false);
    });
  };

  const handleChange = (value: string, field: keyof UserDetails) => {
    setProfile({ ...profile, [field]: value });
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

  useEffect(() => {
    if (userInfo?.profilePhotoName && !userImageUrl) {
      getImageUrl(firebaseBucketName.userImages, userInfo.profilePhotoName).then((url) => {
        console.log(`Image name: ${userInfo.profilePhotoName} \n Image URL: ${url}`);
        dispatch(setUserImageUrl(url));
      }).catch((error) => {
        console.error('Error fetching user image:', error);
      });
    }
  }, [userInfo, userImageUrl, dispatch]);

  const formFields = [
    { key: 'fullName', label: 'Full Name', icon: 'person', placeholder: 'Enter your full name' },
    { key: 'mobileNumber', label: 'Mobile Number', icon: 'call', placeholder: 'Enter your mobile number' },
    { key: 'dateOfBirth', label: 'Date of Birth', icon: 'calendar', placeholder: 'YYYY-MM-DD' },
    { key: 'weight', label: 'Weight (kg)', icon: 'fitness', placeholder: 'Enter your weight' },
    { key: 'height', label: 'Height (cm)', icon: 'resize', placeholder: 'Enter your height' },
  ];

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Enhanced Header Section with Gradient Background and Animation */}
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
                  Edit Profile
                </Heading>
                <Text style={{ color: '#B0B0B0', fontSize: 15, fontWeight: '500' }}>
                  Update your personal information
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
          {/* Profile Image Section */}
          <Box className="px-6 py-6">
            <ProfileImageSection
              userImageUrl={userImageUrl}
              selectedImage={selectedImage}
              userInfo={userInfo}
              isUploading={isUploading}
              onImageUpload={handleImageUpload}
              animatedValue={profileAnim}
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
                  Personal Information
                </Heading>
              </HStack>
            </Animated.View>

            {formFields.map((field, index) => (
              <FormField
                key={field.key}
                label={field.label}
                value={(profile[field.key as keyof UserDetails] ?? '').toString()}
                onChangeText={(text) => handleChange(text, field.key as keyof UserDetails)}
                placeholder={field.placeholder}
                icon={field.icon}
                animatedValue={formAnim}
                index={index}
              />
            ))}
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
                          Update Profile
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
                  Keep your profile updated to get personalized workout recommendations and track your progress accurately.
                </Text>
              </LinearGradient>
            </Box>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
