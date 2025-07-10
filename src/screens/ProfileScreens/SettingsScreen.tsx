import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, RefreshControl, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { DELETE_ACCOUNT, LINK_TRAINEE, LINK_TRAINER, PASSWORD_SETTINGS, CHECKOUT, REGISTER_TRAINER } from '../../constants/screenNames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { logout } from '../../store/userSlice';
import { AuthService } from '../../utils/services/authService';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';

const { width } = Dimensions.get('window');

// Type for settings items
type SettingItem = {
  icon: string;
  title: string;
  description?: string;
  onPress: () => void | Promise<void>;
  isDangerous?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  gradient?: [string, string, ...string[]];
};

// Enhanced Setting Item Component
const SettingItemCard = ({ 
  icon, 
  title, 
  description,
  onPress,
  isDangerous = false,
  showBadge = false,
  badgeText = '',
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]]
}: {
  icon: string;
  title: string;
  description?: string;
  onPress: () => void | Promise<void>;
  isDangerous?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  gradient?: [string, string, ...string[]];
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Card 
      className="mb-4 p-0" 
      style={{
        backgroundColor: isDangerous ? 'rgba(255, 107, 107, 0.1)' : '#2A2A2A',
        borderRadius: 16,
        borderWidth: isDangerous ? 1 : 0,
        borderColor: isDangerous ? 'rgba(255, 107, 107, 0.3)' : 'transparent',
        shadowColor: isDangerous ? '#FF6B6B' : '#FFD20A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Box className="px-5 py-5">
        <HStack className="items-center justify-between">
          <HStack className="items-center flex-1">
            <View 
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDangerous ? '#FF6B6B' : '#FFD20A', // Solid background for shadow optimization
                marginRight: 16,
              }}
            >
              <LinearGradient
                colors={isDangerous ? ['#FF6B6B', '#E53E3E'] : gradient}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons 
                  name={icon as any} 
                  size={24} 
                  color="#1E1E1E" 
                />
              </LinearGradient>
            </View>
            <VStack className="flex-1">
              <HStack className="items-center">
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: isDangerous ? '#FF6B6B' : '#FFFFFF',
                    marginBottom: 2,
                  }}
                >
                  {title}
                </Text>
                {showBadge && (
                  <LinearGradient
                    colors={['#4CAF50', '#2E7D32']}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 10,
                      marginLeft: 8,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>
                      {badgeText}
                    </Text>
                  </LinearGradient>
                )}
              </HStack>
              {description && (
                <Text
                  style={{
                    fontSize: 13,
                    color: '#B0B0B0',
                    lineHeight: 18,
                  }}
                >
                  {description}
                </Text>
              )}
            </VStack>
          </HStack>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDangerous ? '#FF6B6B' : '#666'} 
          />
        </HStack>
      </Box>
    </Card>
  </TouchableOpacity>
);

// Section Header Component
const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
  <HStack className="items-center mb-4" style={{ paddingHorizontal: 8 }}>
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
      <Ionicons name={icon as any} size={16} color="#FFD20A" />
    </Box>
    <Heading size="lg" className="font-bold" style={{ color: '#FFFFFF' }}>
      {title}
    </Heading>
  </HStack>
);

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Add any refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await AuthService.logout();
              dispatch(logout());
              console.log('✅ User logged out successfully');
            } catch (error) {
              console.error('💥 Error during logout:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const accountSettings: SettingItem[] = [
    {
      icon: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      onPress: () => {/* Handle press */},
      gradient: ['#6366F1', '#4F46E5'] as [string, string, ...string[]],
      isDangerous: false
    },
    {
      icon: 'key',
      title: 'Password Settings',
      description: 'Change your account password',
      onPress: () => navigation.navigate(PASSWORD_SETTINGS),
      gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]],
      isDangerous: false
    },
    {
      icon: 'log-out',
      title: 'Sign Out',
      description: 'Sign out of your account',
      onPress: handleLogout,
      gradient: ['#FF6B6B', '#E53E3E'] as [string, string, ...string[]],
      isDangerous: true
    },
  ];

  const trainerSettings = userInfo?.isTrainer === true ? [
    {
      icon: 'people',
      title: 'Manage Trainees',
      description: 'Link and manage your trainees',
      onPress: () => navigation.navigate(LINK_TRAINEE),
      showBadge: true,
      badgeText: 'TRAINER',
      gradient: ['#FF6B6B', '#E53E3E'] as [string, string, ...string[]]
    }
  ] : [
    {
      icon: 'person-add',
      title: 'Link Trainer',
      description: 'Connect with a personal trainer',
      onPress: () => navigation.navigate(LINK_TRAINER),
      showBadge: false,
      badgeText: '',
      gradient: ['#6366F1', '#4F46E5'] as [string, string, ...string[]]
    }
  ];

  const upgradeSettings = userInfo?.isTrainer === false ? [
    {
      icon: 'barbell',
      title: 'Become a Trainer',
      description: 'Register as a certified trainer',
      onPress: () => navigation.navigate(REGISTER_TRAINER),
      showBadge: true,
      badgeText: 'UPGRADE',
      gradient: ['#FFD20A', '#FFA500'] as [string, string, ...string[]]
    }
  ] : [];

  const billingSettings = [
    {
      icon: 'card',
      title: 'Billing & Payments',
      description: 'Manage your subscription and payments',
      onPress: () => navigation.navigate(CHECKOUT),
      gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]]
    }
  ];

  const dangerousSettings = [
    {
      icon: 'trash',
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      onPress: () => navigation.navigate(DELETE_ACCOUNT),
      isDangerous: true
    }
  ];

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Enhanced Header Section with Gradient Background */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.1)', 'transparent']}
        style={{ 
          paddingTop: insets.top + 10,
          paddingBottom: 10,
        }}
      >
        <Box className="px-6 py-4">
          <HStack className="items-center">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 210, 10, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            <VStack className="flex-1">
              <Heading 
                size="xl" 
                className="font-bold" 
                style={{ color: '#FFFFFF', fontSize: 24 }}
              >
                Settings
              </Heading>
              <Text style={{ color: '#B0B0B0', fontSize: 14, marginTop: 2 }}>
                Customize your app experience
              </Text>
            </VStack>
          </HStack>
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
        {/* Account Settings Section */}
        <Box className="px-4 py-4">
          <SectionHeader title="Account Settings" icon="person-circle" />
          <VStack space="sm">
            {accountSettings.map((item, index) => (
              <Box key={`account-${index}`}>
                <SettingItemCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  onPress={item.onPress}
                  gradient={item.gradient}
                  isDangerous={item.isDangerous}
                />
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Trainer/Trainee Settings Section */}
        <Box className="px-4 py-2">
          <SectionHeader 
            title={userInfo?.isTrainer ? "Trainer Tools" : "Training"}
            icon={userInfo?.isTrainer ? "barbell" : "fitness"}
          />
          <VStack space="sm">
            {trainerSettings.map((item, index) => (
              <SettingItemCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onPress={item.onPress}
                showBadge={item.showBadge}
                badgeText={item.badgeText}
                gradient={item.gradient}
              />
            ))}
          </VStack>
        </Box>

        {/* Upgrade Section - Only for non-trainers */}
        {upgradeSettings.length > 0 && (
          <Box className="px-4 py-2">
            <SectionHeader title="Upgrade" icon="star" />
            <VStack space="sm">
              {upgradeSettings.map((item, index) => (
                <SettingItemCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  onPress={item.onPress}
                  showBadge={item.showBadge}
                  badgeText={item.badgeText}
                  gradient={item.gradient}
                />
              ))}
            </VStack>
          </Box>
        )}

        {/* Billing Section */}
        <Box className="px-4 py-2">
          <SectionHeader title="Billing" icon="card" />
          <VStack space="sm">
            {billingSettings.map((item, index) => (
              <SettingItemCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onPress={item.onPress}
                gradient={item.gradient}
              />
            ))}
          </VStack>
        </Box>

        {/* Danger Zone */}
        <Box className="px-4 py-2">
          <SectionHeader title="Danger Zone" icon="warning" />
          <VStack space="sm">
            {dangerousSettings.map((item, index) => (
              <SettingItemCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onPress={item.onPress}
                isDangerous={item.isDangerous}
              />
            ))}
          </VStack>
        </Box>

        {/* Footer Section */}
        <Box className="px-6 py-6">
          <LinearGradient
            colors={['rgba(255, 210, 10, 0.05)', 'transparent']}
            style={{
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Ionicons name="shield-checkmark" size={24} color="#FFD20A" style={{ marginBottom: 8 }} />
            <Text 
              style={{ 
                textAlign: 'center', 
                color: '#B0B0B0', 
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              Your privacy and security are our top priority. All settings are encrypted and secure.
            </Text>
          </LinearGradient>
        </Box>
      </ScrollView>
    </View>
  );
}
