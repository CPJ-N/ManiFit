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

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

// Modern Quick Action Card Component with enhanced design
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
          tension: 60,
          friction: 9,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
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
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <LinearGradient
          colors={['rgba(30, 30, 30, 0.98)', 'rgba(42, 42, 42, 0.95)']}
          style={styles.actionCardGradient}
        >
          <HStack space="lg" style={styles.actionCardContent}>
            <View style={styles.actionIconContainer}>
              <LinearGradient
                colors={gradient}
                style={styles.actionIconGradient}
              >
                <Ionicons name={icon as any} size={26} color={iconColor} />
              </LinearGradient>
            </View>
            <VStack space="xs" style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>{title}</Text>
              <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </VStack>
            <View style={styles.actionArrowContainer}>
              <Ionicons name="chevron-forward" size={20} color="#FFD20A" />
            </View>
          </HStack>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Modern Stat Card Component with refined animations
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
          tension: 60,
          friction: 9,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
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
      <LinearGradient
        colors={['rgba(30, 30, 30, 0.98)', 'rgba(42, 42, 42, 0.95)']}
        style={styles.statCardGradient}
      >
        <VStack space="sm" style={styles.statCardContent}>
          <View style={styles.statIconContainer}>
            <LinearGradient
              colors={gradient}
              style={styles.statIconGradient}
            >
              <Ionicons name={icon as any} size={18} color="#1E1E1E" />
            </LinearGradient>
          </View>
          <Text style={styles.statNumber}>{number}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </VStack>
      </LinearGradient>
    </Animated.View>
  );
};

// Modern Header component with enhanced design
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
    <Box style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.04)', 'transparent']}
        style={styles.headerGradient}
      >
        <HStack style={styles.headerTop}>
          <VStack space="xs" style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {getGreeting()}, {getUserName()}! 👋
            </Text>
            <Text style={styles.subtitle}>Let's crush your fitness goals today</Text>
          </VStack>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFD20A', '#FFA500']}
              style={styles.profileButtonGradient}
            >
              <Ionicons name="person" size={20} color="#1E1E1E" />
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
      
      {/* Modern Background */}
      <LinearGradient
        colors={['#161616', '#1E1E1E', '#242424']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Subtle Background Elements */}
      <View style={styles.backgroundElement1} />
      <View style={styles.backgroundElement2} />
      <View style={styles.backgroundElement3} />

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

        {/* Progress Overview Section */}
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

        {/* Daily Motivation Card */}
        <Box style={styles.section}>
          <LinearGradient
            colors={['rgba(30, 30, 30, 0.95)', 'rgba(42, 42, 42, 0.9)']}
            style={styles.motivationGradient}
          >
            <VStack space="lg" style={styles.motivationContent}>
              <View style={styles.motivationIconContainer}>
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={styles.motivationIconGradient}
                >
                  <Ionicons name="trophy" size={26} color="#1E1E1E" />
                </LinearGradient>
              </View>
              <Text style={styles.motivationText}>
                "Success is the sum of small efforts repeated daily."
              </Text>
              <Text style={styles.motivationAuthor}>
                Your fitness journey starts now! 🚀
              </Text>
            </VStack>
          </LinearGradient>
        </Box>

        {/* Recent Activity Section */}
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
          
          <LinearGradient
            colors={['rgba(30, 30, 30, 0.95)', 'rgba(42, 42, 42, 0.9)']}
            style={styles.emptyStateGradient}
          >
            <VStack space="lg" style={styles.emptyStateContent}>
              <View style={styles.emptyIconContainer}>
                <LinearGradient
                  colors={['rgba(255, 210, 10, 0.15)', 'rgba(255, 165, 0, 0.1)']}
                  style={styles.emptyIconGradient}
                >
                  <Ionicons name="fitness-outline" size={32} color="#FFD20A" />
                </LinearGradient>
              </View>
              <VStack space="sm" style={styles.emptyTextContainer}>
                <Text style={styles.emptyText}>No workouts yet</Text>
                <Text style={styles.emptySubtext}>
                  Ready to start your fitness journey? Your first workout is just a tap away!
                </Text>
              </VStack>
              <TouchableOpacity style={styles.emptyActionButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={styles.emptyActionGradient}
                >
                  <HStack space="sm" style={styles.emptyActionContent}>
                    <Ionicons name="play" size={18} color="#1E1E1E" />
                    <Text style={styles.emptyActionText}>Start First Workout</Text>
                  </HStack>
                </LinearGradient>
              </TouchableOpacity>
            </VStack>
          </LinearGradient>
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
    backgroundColor: '#161616',
  },
  backgroundElement1: {
    position: 'absolute',
    top: height * 0.12,
    right: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 210, 10, 0.02)',
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: height * 0.25,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 165, 0, 0.03)',
  },
  backgroundElement3: {
    position: 'absolute',
    top: height * 0.6,
    right: width * 0.2,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 210, 10, 0.015)',
  },
  header: {
    zIndex: 10,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: '#A0A0A0',
    lineHeight: 22,
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  profileButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  section: {
    marginBottom: 32,
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
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  actionCardWrapper: {
    marginBottom: 16,
  },
  actionCardGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  actionCardContent: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#A0A0A0',
    lineHeight: 18,
    fontWeight: '400',
  },
  actionArrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 210, 10, 0.08)',
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
  statCardGradient: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  statCardContent: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  motivationGradient: {
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  motivationContent: {
    alignItems: 'center',
  },
  motivationIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  motivationIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  motivationAuthor: {
    fontSize: 15,
    color: '#FFD20A',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyStateGradient: {
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
    fontWeight: '400',
  },
  emptyActionButton: {
    borderRadius: 12,
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyActionGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyActionContent: {
    alignItems: 'center',
  },
  emptyActionText: {
    color: '#1E1E1E',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
}); 