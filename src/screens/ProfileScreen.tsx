import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { RootState } from '../store/reduxStore';
import { ROUTES } from '../constants/navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '../../components/ui/box';
import { VStack } from '../../components/ui/vstack';
import { HStack } from '../../components/ui/hstack';
import { Heading } from '../../components/ui/heading';
import { Card } from '../../components/ui/card';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
}

// Enhanced Menu Item Component
const MenuItemCard = ({ 
  icon, 
  title, 
  subtitle,
  onPress,
  showBadge = false,
  badgeText = '',
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
  rightIcon = 'chevron-forward'
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeText?: string;
  gradient?: [string, string, ...string[]];
  rightIcon?: string;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.menuItemWrapper}>
    <Card style={styles.menuItemCard}>
      <LinearGradient
        colors={['#2A2A2A', '#333']}
        style={styles.menuItemGradient}
      >
        <HStack space="md" style={styles.menuItemContent}>
          <View style={styles.menuIconContainer}>
            <LinearGradient
              colors={gradient}
              style={styles.menuIconGradient}
            >
              <Ionicons name={icon as any} size={20} color="#1E1E1E" />
            </LinearGradient>
          </View>
          <VStack space="xs" style={styles.menuTextContainer}>
            <HStack style={styles.menuTitleRow}>
              <Text style={styles.menuTitle}>{title}</Text>
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeText}</Text>
                </View>
              )}
            </HStack>
            <Text style={styles.menuSubtitle}>{subtitle}</Text>
          </VStack>
          <Ionicons name={rightIcon as any} size={20} color="#666" />
        </HStack>
      </LinearGradient>
    </Card>
  </TouchableOpacity>
);

// Enhanced Stat Card Component
const StatCard = ({ 
  icon, 
  number, 
  label, 
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]]
}: {
  icon: string;
  number: string | number;
  label: string;
  gradient?: [string, string, ...string[]];
}) => (
  <Card style={styles.statCard}>
    <LinearGradient
      colors={['#2A2A2A', '#333']}
      style={styles.statCardGradient}
    >
      <VStack space="sm" style={styles.statCardContent}>
        <View style={styles.statIconContainer}>
          <LinearGradient
            colors={gradient}
            style={styles.statIconGradient}
          >
            <Ionicons name={icon as any} size={16} color="#1E1E1E" />
          </LinearGradient>
        </View>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </VStack>
    </LinearGradient>
  </Card>
);

export default function ProfileScreen({ navigation }: Props) {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              console.log('✅ User signed out successfully');
            } catch (error) {
              console.error('❌ Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const menuItems = [
    {
      icon: 'card',
      title: 'Subscription',
      subtitle: userInfo?.isSubscribed ? 'Premium Active' : 'Upgrade to Premium',
      onPress: () => navigation.navigate('Checkout'),
      gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]],
      showBadge: userInfo?.isSubscribed,
      badgeText: 'ACTIVE',
    },
    {
      icon: 'trending-up',
      title: 'Progress',
      subtitle: 'View your fitness journey and stats',
      onPress: () => {}, // TODO: Navigate to progress modal
      gradient: ['#6366F1', '#4F46E5'] as [string, string, ...string[]],
    },
    {
      icon: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and account settings',
      onPress: () => {}, // TODO: Navigate to settings modal
      gradient: ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
    },
    {
      icon: 'help-circle',
      title: 'Help & Support',
      subtitle: 'Get help and contact our support team',
      onPress: () => {}, // TODO: Navigate to help
      gradient: ['#FF6B6B', '#E53E3E'] as [string, string, ...string[]],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.08)', 'transparent', 'rgba(255, 210, 10, 0.03)']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      >
        {/* Enhanced Profile Header */}
        <Box style={styles.header}>
          <Card style={styles.profileCard}>
            <LinearGradient
              colors={['#2A2A2A', '#333']}
              style={styles.profileCardGradient}
            >
              <VStack space="md" style={styles.profileSection}>
                {/* Avatar with Status */}
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#FFD20A', '#FFA500']}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {getInitials(userInfo?.fullName)}
                    </Text>
                  </LinearGradient>
                  <View style={styles.statusIndicator}>
                    <View style={styles.statusDot} />
                  </View>
                </View>

                {/* User Info */}
                <VStack space="xs" style={styles.userInfo}>
                  <Heading size="lg" style={styles.name}>
                    {userInfo?.fullName || 'User'}
                  </Heading>
                  <Text style={styles.email}>{userInfo?.email}</Text>
                  <HStack style={styles.userBadges}>
                    <View style={styles.userBadge}>
                      <Ionicons name="person" size={12} color="#1E1E1E" />
                      <Text style={styles.userBadgeText}>
                        {userInfo?.isTrainer ? 'Trainer' : 'Member'}
                      </Text>
                    </View>
                    {userInfo?.isSubscribed && (
                      <View style={[styles.userBadge, styles.premiumBadge]}>
                        <Ionicons name="star" size={12} color="#1E1E1E" />
                        <Text style={styles.userBadgeText}>Premium</Text>
                      </View>
                    )}
                  </HStack>
                </VStack>
              </VStack>
            </LinearGradient>
          </Card>
        </Box>

        {/* Enhanced Quick Stats */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Ionicons name="bar-chart" size={20} color="#FFD20A" />
            <Heading size="lg" style={styles.sectionTitle}>Your Stats</Heading>
          </HStack>
          
          <HStack space="sm" style={styles.statsRow}>
            <StatCard
              icon="barbell"
              number="0"
              label="Total Workouts"
              gradient={['#4CAF50', '#2E7D32']}
            />
            <StatCard
              icon="calendar"
              number="0"
              label="Days Active"
              gradient={['#6366F1', '#4F46E5']}
            />
            <StatCard
              icon="time"
              number="0"
              label="Minutes"
              gradient={['#FF6B6B', '#E53E3E']}
            />
          </HStack>
        </Box>

        {/* Menu Items */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Ionicons name="menu" size={20} color="#FFD20A" />
            <Heading size="lg" style={styles.sectionTitle}>Account</Heading>
          </HStack>
          
          <VStack space="sm">
            {menuItems.map((item, index) => (
              <MenuItemCard
                key={index}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                gradient={item.gradient}
                showBadge={item.showBadge}
                badgeText={item.badgeText}
              />
            ))}
          </VStack>
        </Box>

        {/* App Info Section */}
        <Box style={styles.section}>
          <Card style={styles.appInfoCard}>
            <LinearGradient
              colors={['rgba(255, 210, 10, 0.1)', 'rgba(255, 210, 10, 0.05)']}
              style={styles.appInfoGradient}
            >
              <VStack space="md" style={styles.appInfoContent}>
                <Ionicons name="information-circle" size={24} color="#FFD20A" />
                <Text style={styles.appInfoTitle}>ManiFit v1.0.0</Text>
                <Text style={styles.appInfoText}>
                  Transform your body, elevate your mind. Your fitness journey starts here.
                </Text>
              </VStack>
            </LinearGradient>
          </Card>
        </Box>

        {/* Enhanced Logout Button */}
        <Box style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF6B6B', '#E53E3E']}
              style={styles.logoutGradient}
            >
              <HStack space="sm" style={styles.logoutContent}>
                <Ionicons name="log-out" size={20} color="#FFFFFF" />
                <Text style={styles.logoutText}>Sign Out</Text>
              </HStack>
            </LinearGradient>
          </TouchableOpacity>
        </Box>
        
        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  profileCardGradient: {
    padding: 24,
    borderRadius: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  userBadges: {
    marginTop: 8,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD20A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  premiumBadge: {
    backgroundColor: '#4CAF50',
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E1E1E',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  statsRow: {
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardGradient: {
    padding: 16,
    borderRadius: 16,
  },
  statCardContent: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 8,
  },
  statIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  menuItemWrapper: {
    marginBottom: 12,
  },
  menuItemCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItemGradient: {
    padding: 20,
    borderRadius: 16,
  },
  menuItemContent: {
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  menuIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitleRow: {
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  appInfoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appInfoGradient: {
    padding: 20,
    borderRadius: 16,
  },
  appInfoContent: {
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD20A',
  },
  appInfoText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutSection: {
    marginBottom: 24,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    padding: 16,
    borderRadius: 16,
  },
  logoutContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 