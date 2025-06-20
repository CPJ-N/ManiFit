import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Animated, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';

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

const actionItems = [
  {
    id: 1,
    title: 'Browse Trainers',
    subtitle: 'Find certified professionals',
    description: 'Discover trainers that match your fitness goals and preferences',
    icon: 'people-outline',
    gradient: ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
    action: 'Browse'
  },
  {
    id: 2,
    title: 'Receive Workout Plans',
    subtitle: 'Personalized routines',
    description: 'Get custom workout plans designed specifically for your goals',
    icon: 'fitness-outline',
    gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]],
    action: 'Explore'
  },
  {
    id: 3,
    title: 'Track Your Progress',
    subtitle: 'Monitor your journey',
    description: 'Watch your transformation with detailed analytics and insights',
    icon: 'trending-up-outline',
    gradient: ['#2196F3', '#1976D2'] as [string, string, ...string[]],
    action: 'Start Tracking'
  },
];

export default function TraineeOnboardingScreen({ navigation }: { navigation: any }) {
  const [isCompleting, setIsCompleting] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardAnimations = useRef(actionItems.map(() => new Animated.Value(0))).current;

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

    // Staggered card animations
    const cardAnimationSequence = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      })
    );

    Animated.stagger(200, cardAnimationSequence).start();
  }, []);

  const handleGetStarted = async () => {
    setIsCompleting(true);
    try {
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
      console.error('Error completing trainee onboarding:', error);
      setIsCompleting(false);
    }
  };

  const ActionCard = ({ 
    item, 
    index 
  }: {
    item: typeof actionItems[0];
    index: number;
  }) => (
    <Animated.View
      style={{
        opacity: cardAnimations[index],
        transform: [{
          translateY: cardAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }]
      }}
    >
      <Card 
        className="mb-6 p-0" 
        style={{
          backgroundColor: '#2A2A2A',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 210, 10, 0.1)',
          shadowColor: item.gradient[0],
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Box className="p-6">
          <HStack className="items-center mb-4">
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: item.gradient[0], // Solid background for shadow optimization
                shadowColor: item.gradient[0],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
                marginRight: 16,
              }}
            >
              <LinearGradient
                colors={item.gradient}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name={item.icon as any} size={28} color="#FFFFFF" />
              </LinearGradient>
            </Box>
            
            <VStack className="flex-1">
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: 4,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: item.gradient[0],
                }}
              >
                {item.subtitle}
              </Text>
            </VStack>
          </HStack>
          
          <Text
            style={{
              fontSize: 14,
              color: '#B0B0B0',
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            {item.description}
          </Text>
          
          <TouchableOpacity
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: item.gradient[0],
              backgroundColor: `${item.gradient[0]}20`,
              paddingVertical: 12,
              paddingHorizontal: 20,
              alignSelf: 'flex-start',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: item.gradient[0], fontSize: 14, fontWeight: '600' }}>
              {item.action}
            </Text>
          </TouchableOpacity>
        </Box>
      </Card>
    </Animated.View>
  );

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
            colors={['rgba(255, 210, 10, 0.15)', 'rgba(255, 210, 10, 0.05)', 'transparent']}
            style={{ paddingBottom: 30 }}
          >
            <VStack className="px-6 py-8 items-center">
              {/* Welcome Icon */}
              <Box
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#FFD20A', // Solid background for shadow optimization
                  shadowColor: '#FFD20A',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  elevation: 15,
                  marginBottom: 24,
                }}
              >
                <LinearGradient
                  colors={['#FFD20A', '#FFA500']}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="heart" size={40} color="#1E1E1E" />
                </LinearGradient>
              </Box>

              {/* Welcome Text */}
              <VStack className="items-center space-y-3">
                <Heading 
                  size="2xl" 
                  className="font-bold text-center" 
                  style={{ 
                    color: '#FFFFFF', 
                    fontSize: 28,
                    lineHeight: 34,
                    marginBottom: 8,
                  }}
                >
                  Welcome to Your Fitness Journey! 🎉
                </Heading>
                
                <Text 
                  style={{ 
                    color: '#FFD20A', 
                    fontSize: 16, 
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  Ready to transform your life?
                </Text>
                
                <Text 
                  style={{ 
                    color: '#B0B0B0', 
                    fontSize: 15, 
                    textAlign: 'center',
                    lineHeight: 22,
                    paddingHorizontal: 20,
                  }}
                >
                  You've taken the first step towards a healthier, stronger you. Let's explore what ManiFit has to offer.
                </Text>
              </VStack>
            </VStack>
          </LinearGradient>
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
          <VStack className="space-y-6">
            <VStack className="space-y-2 mb-4">
              <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>
                What You Can Do
              </Text>
              <Text style={{ color: '#B0B0B0', fontSize: 14, lineHeight: 20 }}>
                Discover all the ways ManiFit can help you achieve your fitness goals
              </Text>
            </VStack>

            {actionItems.map((item, index) => (
              <ActionCard key={item.id} item={item} index={index} />
            ))}

            {/* Motivational Section */}
            <Card 
              className="p-0 mt-4" 
              style={{
                                            backgroundColor: '#2A2A2A', // Solid background for shadow optimization
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(76, 175, 80, 0.3)',
              }}
            >
              <Box className="p-6">
                <HStack className="items-center mb-4">
                  <Box
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: '#4CAF50',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 16,
                    }}
                  >
                    <Ionicons name="star" size={24} color="#FFFFFF" />
                  </Box>
                  <VStack className="flex-1">
                    <Text style={{ color: '#4CAF50', fontSize: 16, fontWeight: '700' }}>
                      Your Success Starts Here
                    </Text>
                    <Text style={{ color: '#B0B0B0', fontSize: 13 }}>
                      Join thousands of success stories
                    </Text>
                  </VStack>
                </HStack>
                
                <Text style={{ color: '#B0B0B0', fontSize: 14, lineHeight: 20 }}>
                  "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown." - Start your transformation today!
                </Text>
              </Box>
            </Card>
          </VStack>
        </ScrollView>

        {/* Bottom Button */}
        <SafeAreaView style={{ paddingBottom: insets.bottom }}>
          <Box className="px-6 py-4">
            <TouchableOpacity
              onPress={handleGetStarted}
              disabled={isCompleting}
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: '#FFD20A', // Solid background for shadow optimization
                shadowColor: '#FFD20A',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
                opacity: isCompleting ? 0.7 : 1,
              }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FFD20A', '#FFA500']}
                style={{
                  paddingVertical: 18,
                  alignItems: 'center',
                }}
              >
                <HStack className="items-center">
                  {isCompleting ? (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#1E1E1E" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#1E1E1E', fontSize: 16, fontWeight: '700' }}>
                        Setting up...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={{ color: '#1E1E1E', fontSize: 16, fontWeight: '700', marginRight: 8 }}>
                        Start My Fitness Journey
                      </Text>
                      <Ionicons name="rocket" size={20} color="#1E1E1E" />
                    </>
                  )}
                </HStack>
              </LinearGradient>
            </TouchableOpacity>

            {/* Alternative Action */}
            <TouchableOpacity
              onPress={handleGetStarted}
              style={{
                borderRadius: 16,
                borderWidth: 2,
                borderColor: 'rgba(255, 210, 10, 0.3)',
                                    backgroundColor: '#2A2A2A', // Solid background for shadow optimization
                paddingVertical: 14,
                alignItems: 'center',
                marginTop: 12,
              }}
              activeOpacity={0.8}
            >
              <HStack className="items-center">
                <Ionicons name="time-outline" size={18} color="#FFD20A" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFD20A', fontSize: 14, fontWeight: '600' }}>
                  I'll explore later
                </Text>
              </HStack>
            </TouchableOpacity>
          </Box>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
} 