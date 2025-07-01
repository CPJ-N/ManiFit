import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reduxStore';
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

// Enhanced Quick Action Card Component
const QuickActionCard = ({ 
  icon, 
  title, 
  subtitle,
  onPress,
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
  iconColor = '#1E1E1E'
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  gradient?: [string, string, ...string[]];
  iconColor?: string;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.actionCardWrapper}>
    <Card style={styles.actionCard}>
      <LinearGradient
        colors={['#2A2A2A', '#333']}
        style={styles.actionCardGradient}
      >
        <HStack space="md" style={styles.actionCardContent}>
          <View style={styles.actionIconContainer}>
            <LinearGradient
              colors={gradient}
              style={styles.actionIconGradient}
            >
              <Ionicons name={icon as any} size={24} color={iconColor} />
            </LinearGradient>
          </View>
          <VStack space="xs" style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionSubtitle}>{subtitle}</Text>
          </VStack>
          <Ionicons name="chevron-forward" size={20} color="#FFD20A" />
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

export default function HomeScreen({ navigation }: Props) {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const insets = useSafeAreaInsets();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = () => {
    if (userInfo?.fullName) {
      return userInfo.fullName.split(' ')[0];
    }
    return 'User';
  };

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
        {/* Enhanced Header */}
        <Box style={styles.header}>
          <HStack style={styles.headerTop}>
            <VStack space="xs" style={styles.greetingContainer}>
              <Text style={styles.greeting}>
                {getGreeting()}, {getUserName()}! 👋
              </Text>
              <Text style={styles.subtitle}>Ready to crush your goals?</Text>
            </VStack>
            <TouchableOpacity style={styles.profileButton}>
              <LinearGradient
                colors={['#FFD20A', '#FFA500']}
                style={styles.profileButtonGradient}
              >
                <Ionicons name="person" size={20} color="#1E1E1E" />
              </LinearGradient>
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Quick Actions Section */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Ionicons name="flash" size={20} color="#FFD20A" />
            <Heading size="lg" style={styles.sectionTitle}>Quick Start</Heading>
          </HStack>
          
          <VStack space="sm">
            <QuickActionCard
              icon="fitness"
              title="Start Quick Workout"
              subtitle="Jump into a 15-min session"
              onPress={() => {/* Navigate to quick workout */}}
              gradient={['#4CAF50', '#2E7D32']}
            />
            
            <QuickActionCard
              icon="calendar"
              title="Today's Routine"
              subtitle="Your scheduled workout plan"
              onPress={() => {/* Navigate to today's routine */}}
              gradient={['#6366F1', '#4F46E5']}
            />

            <QuickActionCard
              icon="library"
              title="Browse Exercises"
              subtitle="Explore workout categories"
              onPress={() => navigation.navigate('Workouts')}
              gradient={['#FFD20A', '#FFA500']}
            />
          </VStack>
        </Box>

        {/* Enhanced Progress Section */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Ionicons name="trending-up" size={20} color="#FFD20A" />
            <Heading size="lg" style={styles.sectionTitle}>Your Progress</Heading>
          </HStack>
          
          <HStack space="sm" style={styles.statsRow}>
            <StatCard
              icon="barbell"
              number="0"
              label="Total Workouts"
              gradient={['#4CAF50', '#2E7D32']}
            />
            <StatCard
              icon="calendar-outline"
              number="0"
              label="This Week"
              gradient={['#6366F1', '#4F46E5']}
            />
            <StatCard
              icon="flame"
              number="0"
              label="Day Streak"
              gradient={['#FF6B6B', '#E53E3E']}
            />
          </HStack>
        </Box>

        {/* Motivational Quote Card */}
        <Box style={styles.section}>
          <Card style={styles.motivationCard}>
            <LinearGradient
              colors={['rgba(255, 210, 10, 0.1)', 'rgba(255, 210, 10, 0.05)']}
              style={styles.motivationGradient}
            >
              <VStack space="md" style={styles.motivationContent}>
                <Ionicons name="bulb" size={24} color="#FFD20A" />
                <Text style={styles.motivationText}>
                  "The body achieves what the mind believes."
                </Text>
                <Text style={styles.motivationAuthor}>
                  Start your journey today! 💪
                </Text>
              </VStack>
            </LinearGradient>
          </Card>
        </Box>

        {/* Recent Activity Section */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#FFD20A" />
            <Heading size="lg" style={styles.sectionTitle}>Recent Activity</Heading>
          </HStack>
          
          <Card style={styles.emptyStateCard}>
            <LinearGradient
              colors={['#2A2A2A', '#333']}
              style={styles.emptyStateGradient}
            >
              <VStack space="md" style={styles.emptyStateContent}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={['rgba(255, 210, 10, 0.2)', 'rgba(255, 210, 10, 0.1)']}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons name="fitness-outline" size={32} color="#FFD20A" />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyText}>No recent workouts</Text>
                <Text style={styles.emptySubtext}>
                  Start your fitness journey today and see your progress here!
                </Text>
                <TouchableOpacity style={styles.emptyActionButton}>
                  <LinearGradient
                    colors={['#FFD20A', '#FFA500']}
                    style={styles.emptyActionGradient}
                  >
                    <Text style={styles.emptyActionText}>Get Started</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </VStack>
            </LinearGradient>
          </Card>
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
    paddingBottom: 24,
  },
  headerTop: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 22,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profileButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
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
  actionCardWrapper: {
    marginBottom: 12,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  actionCardContent: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  actionIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
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
    lineHeight: 16,
  },
  motivationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  motivationGradient: {
    padding: 24,
    borderRadius: 16,
  },
  motivationContent: {
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
  },
  motivationAuthor: {
    fontSize: 14,
    color: '#FFD20A',
    fontWeight: '500',
  },
  emptyStateCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateGradient: {
    padding: 32,
    borderRadius: 16,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyActionButton: {
    borderRadius: 12,
  },
  emptyActionGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyActionText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 