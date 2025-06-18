import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase'
import { signOut } from 'firebase/auth'
import { AUTH_TABS, COMPLETE_EXERCISE_LIST, EDIT_PROFILE, EXERCISE_TABS, FAVORITE, LINK_TRAINEE, LINK_TRAINER, LOGIN, PRIVACY_POLICY, SETTINGS } from '../../constants/screenNames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { StatusBar } from 'expo-status-bar';
import { clearUser, clearUserImageUrl } from '../../store/userSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const { width } = Dimensions.get('window');

// Enhanced Menu Item Component
const MenuItemCard = ({ 
  item, 
  onPress, 
  isLogout = false 
}: {
  item: { name: string; icon: string; description?: string };
  onPress: () => void;
  isLogout?: boolean;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Card 
      className="mb-3 p-0" 
      style={{
        backgroundColor: isLogout ? 'rgba(255, 107, 107, 0.1)' : '#2A2A2A',
        borderRadius: 16,
        borderWidth: isLogout ? 1 : 0,
        borderColor: isLogout ? 'rgba(255, 107, 107, 0.3)' : 'transparent',
      }}
    >
      <Box className="px-5 py-4">
        <HStack className="items-center justify-between">
          <HStack className="items-center flex-1">
            <Box
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isLogout ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 210, 10, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons 
                name={item.icon as any} 
                size={22} 
                color={isLogout ? '#FF6B6B' : '#FFD20A'} 
              />
            </Box>
            <VStack className="flex-1">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: isLogout ? '#FF6B6B' : '#FFFFFF',
                  marginBottom: 2,
                }}
              >
                {item.name}
              </Text>
              {item.description && (
                <Text
                  style={{
                    fontSize: 13,
                    color: '#B0B0B0',
                  }}
                >
                  {item.description}
                </Text>
              )}
            </VStack>
          </HStack>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isLogout ? '#FF6B6B' : '#666'} 
          />
        </HStack>
      </Box>
    </Card>
  </TouchableOpacity>
);

// Stats Card Component
const StatCard = ({ 
  value, 
  label, 
  icon,
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]]
}: {
  value: string | number;
  label: string;
  icon: string;
  gradient?: [string, string, ...string[]];
}) => (
  <Box style={{ flex: 1, margin: 6 }}>
    <LinearGradient
      colors={gradient}
      style={{
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        minHeight: 100,
        justifyContent: 'center',
        shadowColor: '#FFD20A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons name={icon as any} size={24} color="#1E1E1E" style={{ marginBottom: 8 }} />
      <Text 
        style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: '#1E1E1E',
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text 
        style={{ 
          fontSize: 12, 
          color: '#1E1E1E', 
          opacity: 0.8,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </LinearGradient>
  </Box>
);

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { userInfo, userImageUrl } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const menuItems = [
    { 
      name: 'Edit Profile', 
      icon: 'person-circle-outline',
      description: 'Update your personal information'
    },
    { 
      name: 'Favorite', 
      icon: 'heart-outline',
      description: userInfo?.isTrainer ? 'Manage trainees' : 'Connect with trainer'
    },
    { 
      name: 'Privacy Policy', 
      icon: 'shield-checkmark-outline',
      description: 'Review our privacy terms'
    },
    { 
      name: 'Settings', 
      icon: 'settings-outline',
      description: 'App preferences and notifications'
    },
    { 
      name: 'Help', 
      icon: 'help-circle-outline',
      description: 'Get support and tutorials'
    },
  ];

  const logoutItem = { 
    name: 'Logout', 
    icon: 'log-out-outline',
    description: 'Sign out of your account'
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Add any refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePress = (name: string) => {
    switch (name) {
      case "Edit Profile":
        navigation.navigate(EDIT_PROFILE);
        break;
      case "Favorite":
        userInfo?.isTrainer ? navigation.navigate(LINK_TRAINEE) : navigation.navigate(LINK_TRAINER);
        break;
      case "Privacy Policy":
        console.log(auth.currentUser?.uid);
        console.log('Privacy Policy')
        navigation.navigate(PRIVACY_POLICY)
        break;
      case "Settings":
        navigation.navigate(SETTINGS)
        console.log('Settings');
        break; 
      case "Help":
        navigation.navigate(EXERCISE_TABS)
        console.log('Help');
        break;
      case "Logout":
        handleLogOut();
        break;
      default:
        console.log("Value is something else");
    }
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(async (res) => {
        console.log(res)
        await dispatch(clearUser())
        await dispatch(clearUserImageUrl())
        // Navigation will be handled automatically by App.tsx auth state listener
        console.log('signed out')
      })
      .catch((error) => {
        console.log(error)
        alert(error.message)
      })
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Enhanced Header Section with Gradient Background that covers safe area */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.15)', 'rgba(255, 210, 10, 0.05)', 'transparent']}
        style={{ 
          paddingTop: insets.top + 10,
          paddingBottom: 20,
        }}
      >
        <Box className="px-6 py-6">
          <VStack className="items-center">
            {/* Profile Image */}
            <TouchableOpacity
              onPress={() => navigation.navigate(EDIT_PROFILE)}
              style={{
                shadowColor: '#FFD20A',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
                marginBottom: 20,
              }}
            >
              <Avatar size="2xl" style={{ width: 120, height: 120, borderWidth: 4, borderColor: '#FFD20A' }}>
                {userImageUrl ? (
                  <AvatarImage 
                    source={{ uri: userImageUrl }}
                    alt="Profile"
                    style={{ width: 120, height: 120, borderRadius: 60 }}
                  />
                ) : (
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
                      style={{ color: '#1E1E1E', fontSize: 32 }}
                    >
                      {userInfo?.fullName?.split(' ').map(name => name[0]).join('') || 'U'}
                    </AvatarFallbackText>
                  </LinearGradient>
                )}
              </Avatar>
              {/* Edit Indicator */}
              <Box
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#FFD20A',
                  borderRadius: 18,
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: '#1E1E1E',
                }}
              >
                <Ionicons name="camera" size={18} color="#1E1E1E" />
              </Box>
            </TouchableOpacity>

            {/* User Info */}
            <VStack className="items-center">
              <Heading 
                size="xl" 
                className="font-bold text-center mb-2" 
                style={{ color: '#FFFFFF', fontSize: 24 }}
              >
                {userInfo?.fullName || 'User Name'}
              </Heading>
              <Text 
                style={{ 
                  color: '#FFD20A', 
                  fontSize: 14, 
                  marginBottom: 4,
                  opacity: 0.9,
                }}
              >
                {auth.currentUser?.email}
              </Text>
              {userInfo?.isTrainer && (
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                    🏋️ Certified Trainer
                  </Text>
                </LinearGradient>
              )}
            </VStack>
          </VStack>
        </Box>
      </LinearGradient>

      <ScrollView 
        style={{ backgroundColor: '#1E1E1E' }}
        contentContainerStyle={{ 
          backgroundColor: '#1E1E1E',
          flexGrow: 1,
          paddingBottom: insets.bottom + 20,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD20A" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <Box className="px-4 py-2">
          <Heading size="lg" className="font-bold mb-4" style={{ color: 'white', paddingHorizontal: 8 }}>
            Your Stats
          </Heading>
          <VStack space="md">
            <HStack space="sm">
              <StatCard 
                value={userInfo?.weight || 'N/A'} 
                label="Weight (kg)" 
                icon="barbell"
                gradient={['#FFD20A', '#FFA500']}
              />
              <StatCard 
                value={calculateAge(userInfo?.dateOfBirth || '')} 
                label="Years Old" 
                icon="calendar"
                gradient={['#4CAF50', '#2E7D32']}
              />
            </HStack>
            <HStack space="sm">
              <StatCard 
                value={userInfo?.height || 'N/A'} 
                label="Height (cm)" 
                icon="resize"
                gradient={['#FF6B6B', '#E53E3E']}
              />
              <StatCard 
                value="12" 
                label="Workouts" 
                icon="fitness"
                gradient={['#6366F1', '#4F46E5']}
              />
            </HStack>
          </VStack>
        </Box>

        {/* Menu Section */}
        <Box className="px-4 py-6">
          <Heading size="lg" className="font-bold mb-4" style={{ color: 'white', paddingHorizontal: 8 }}>
            Account & Settings
          </Heading>
          
          <VStack space="sm">
            {menuItems.map((item, index) => (
              <MenuItemCard
                key={index}
                item={item}
                onPress={() => handlePress(item.name)}
              />
            ))}
            
            {/* Logout Button - Separate styling */}
            <Box style={{ marginTop: 20 }}>
              <MenuItemCard
                item={logoutItem}
                onPress={() => handlePress(logoutItem.name)}
                isLogout={true}
              />
            </Box>
          </VStack>
        </Box>

        {/* Footer Section */}
        <Box className="px-6 py-4">
          <Text 
            style={{ 
              textAlign: 'center', 
              color: '#666', 
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            ManiFit v1.0.0
          </Text>
          <Text 
            style={{ 
              textAlign: 'center', 
              color: '#666', 
              fontSize: 11,
            }}
          >
            Transform your fitness journey with us
          </Text>
        </Box>
      </ScrollView>
    </View>
  );
}
