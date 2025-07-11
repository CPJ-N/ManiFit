import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
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

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

// Enhanced Quick Action Card Component with better animations
const QuickActionCard = ({ 
  icon, 
  title, 
  subtitle,
  onPress,
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
  iconColor = '#1E1E1E',
  delay = 0
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  gradient?: [string, string, ...string[]];
  iconColor?: string;
  delay?: number;
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    onPress();
  };

  return (
    <Animated.View 
      style={[
        styles.actionCardWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
    <Card style={styles.actionCard}>
      <LinearGradient
            colors={['rgba(42, 42, 42, 0.95)', 'rgba(51, 51, 51, 0.95)']}
        style={styles.actionCardGradient}
      >
            <HStack space="lg" style={styles.actionCardContent}>
          <View style={styles.actionIconContainer}>
            <LinearGradient
              colors={gradient}
              style={styles.actionIconGradient}
            >
                  <Ionicons name={icon as any} size={28} color={iconColor} />
            </LinearGradient>
          </View>
          <VStack space="xs" style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionSubtitle}>{subtitle}</Text>
          </VStack>
              <View style={styles.actionArrowContainer}>
                <Ionicons name="chevron-forward" size={24} color="#FFD20A" />
              </View>
        </HStack>
      </LinearGradient>
    </Card>
  </TouchableOpacity>
    </Animated.View>
);
};

// Enhanced Stat Card Component with animations
const StatCard = ({ 
  icon, 
  number, 
  label, 
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
  delay = 0
}: {
  icon: string;
  number: string | number;
  label: string;
  gradient?: [string, string, ...string[]];
  delay?: number;
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.statCardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
  <Card style={styles.statCard}>
    <LinearGradient
          colors={['rgba(42, 42, 42, 0.95)', 'rgba(51, 51, 51, 0.95)']}
      style={styles.statCardGradient}
    >
      <VStack space="sm" style={styles.statCardContent}>
        <View style={styles.statIconContainer}>
          <LinearGradient
            colors={gradient}
            style={styles.statIconGradient}
          >
                <Ionicons name={icon as any} size={20} color="#1E1E1E" />
          </LinearGradient>
        </View>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </VStack>
    </LinearGradient>
  </Card>
    </Animated.View>
  );
};

// Header component with improved design
const Header = ({ userInfo, insets }: { userInfo: any; insets: any }) => {
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
    return 'Champion';
  };

  return (
    <Box style={[styles.header, { paddingTop: insets.top + 20 }]}>
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.15)', 'rgba(255, 210, 10, 0.05)', 'transparent']}
        style={styles.headerGradient}
      >
        <HStack style={styles.headerTop}>
          <VStack space="xs" style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {getGreeting()}, {getUserName()}! 👋
            </Text>
            <Text style={styles.subtitle}>Ready to dominate your goals?</Text>
          </VStack>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFD20A', '#FFA500']}
              style={styles.profileButtonGradient}
            >
              <Ionicons name="person" size={22} color="#1E1E1E" />
            </LinearGradient>
          </TouchableOpacity>
        </HStack>
      </LinearGradient>
    </Box>
  );
  };

export default function HomeScreen({ navigation }: Props) {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Enhanced Background */}
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A', '#1E1E1E']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Floating Background Elements */}
      <View style={styles.backgroundElement1} />
      <View style={styles.backgroundElement2} />

      {/* Header */}
      <Header userInfo={userInfo} insets={insets} />

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions Section */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <LinearGradient
                colors={['rgba(255, 210, 10, 0.2)', 'rgba(255, 210, 10, 0.1)']}
                style={styles.sectionIconGradient}
              >
                <Ionicons name="flash" size={18} color="#FFD20A" />
              </LinearGradient>
            </View>
            <Heading size="lg" style={styles.sectionTitle}>Quick Start</Heading>
          </HStack>
          
          <VStack space="md">
            <QuickActionCard
              icon="fitness"
              title="Start Quick Workout"
              subtitle="Jump into a 15-min power session"
              onPress={() => {/* Navigate to quick workout */}}
              gradient={['#4CAF50', '#2E7D32']}
              delay={100}
            />
            
            <QuickActionCard
              icon="calendar"
              title="Today's Routine"
              subtitle="Your personalized workout plan"
              onPress={() => {/* Navigate to today's routine */}}
              gradient={['#6366F1', '#4F46E5']}
              delay={200}
            />

            <QuickActionCard
              icon="library"
              title="Browse Exercises"
              subtitle="Explore workout categories"
              onPress={() => navigation.navigate('Workouts')}
              gradient={['#FFD20A', '#FFA500']}
              delay={300}
            />
          </VStack>
        </Box>

        {/* Enhanced Progress Section */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <LinearGradient
                colors={['rgba(255, 210, 10, 0.2)', 'rgba(255, 210, 10, 0.1)']}
                style={styles.sectionIconGradient}
              >
                <Ionicons name="trending-up" size={18} color="#FFD20A" />
              </LinearGradient>
            </View>
            <Heading size="lg" style={styles.sectionTitle}>Your Progress</Heading>
          </HStack>
          
          <HStack space="md" style={styles.statsRow}>
            <StatCard
              icon="barbell"
              number="0"
              label="Total Workouts"
              gradient={['#4CAF50', '#2E7D32']}
              delay={400}
            />
            <StatCard
              icon="calendar-outline"
              number="0"
              label="This Week"
              gradient={['#6366F1', '#4F46E5']}
              delay={500}
            />
            <StatCard
              icon="flame"
              number="0"
              label="Day Streak"
              gradient={['#FF6B6B', '#E53E3E']}
              delay={600}
            />
          </HStack>
        </Box>

        {/* Enhanced Motivational Quote Card */}
        <Box style={styles.section}>
          <Card style={styles.motivationCard}>
            <LinearGradient
              colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.08)']}
              style={styles.motivationGradient}
            >
              <VStack space="lg" style={styles.motivationContent}>
                <View style={styles.motivationIconContainer}>
                  <LinearGradient
                    colors={['rgba(255, 210, 10, 0.3)', 'rgba(255, 210, 10, 0.2)']}
                    style={styles.motivationIconGradient}
                  >
                    <Ionicons name="bulb" size={28} color="#FFD20A" />
                  </LinearGradient>
                </View>
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

        {/* Enhanced Recent Activity Section */}
        <Box style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <LinearGradient
                colors={['rgba(255, 210, 10, 0.2)', 'rgba(255, 210, 10, 0.1)']}
                style={styles.sectionIconGradient}
              >
                <Ionicons name="time" size={18} color="#FFD20A" />
              </LinearGradient>
            </View>
            <Heading size="lg" style={styles.sectionTitle}>Recent Activity</Heading>
          </HStack>
          
          <Card style={styles.emptyStateCard}>
            <LinearGradient
              colors={['rgba(42, 42, 42, 0.95)', 'rgba(51, 51, 51, 0.95)']}
              style={styles.emptyStateGradient}
            >
              <VStack space="lg" style={styles.emptyStateContent}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={['rgba(255, 210, 10, 0.2)', 'rgba(255, 210, 10, 0.1)']}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons name="fitness-outline" size={36} color="#FFD20A" />
                  </LinearGradient>
                </View>
                <VStack space="sm" style={styles.emptyTextContainer}>
                <Text style={styles.emptyText}>No recent workouts</Text>
                <Text style={styles.emptySubtext}>
                  Start your fitness journey today and see your progress here!
                </Text>
                </VStack>
                <TouchableOpacity style={styles.emptyActionButton} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#FFD20A', '#FFA500']}
                    style={styles.emptyActionGradient}
                  >
                    <HStack space="sm" style={styles.emptyActionContent}>
                      <Ionicons name="add" size={20} color="#1E1E1E" />
                    <Text style={styles.emptyActionText}>Get Started</Text>
                    </HStack>
                  </LinearGradient>
                </TouchableOpacity>
              </VStack>
            </LinearGradient>
          </Card>
        </Box>

        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  backgroundElement1: {
    position: 'absolute',
    top: height * 0.1,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 210, 10, 0.03)',
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: height * 0.3,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 210, 10, 0.05)',
  },
  header: {
    zIndex: 10,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 24,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  sectionIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  actionCardWrapper: {
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  actionCardGradient: {
    padding: 24,
    borderRadius: 20,
  },
  actionCardContent: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  actionArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    justifyContent: 'space-between',
  },
  statCardContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  statCard: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  statCardGradient: {
    padding: 20,
    borderRadius: 18,
  },
  statCardContent: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  motivationCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  motivationGradient: {
    padding: 32,
    borderRadius: 24,
  },
  motivationContent: {
    alignItems: 'center',
  },
  motivationIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  motivationIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  motivationAuthor: {
    fontSize: 16,
    color: '#FFD20A',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyStateGradient: {
    padding: 40,
    borderRadius: 20,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  emptyActionButton: {
    borderRadius: 16,
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyActionGradient: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
  },
  emptyActionContent: {
    alignItems: 'center',
  },
  emptyActionText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
}); 