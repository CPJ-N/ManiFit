import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Dimensions, Animated, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

// Navigation
import { REGISTER, LOGIN } from '../../constants/screenNames';

const { width, height } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: 1,
    title: "Transform Your Fitness",
    subtitle: "Your personal trainer in your pocket",
    description: "Get personalized workout plans, track your progress, and achieve your fitness goals with expert guidance.",
    image: require('../../assets/images/slide1.png'),
    gradient: ['#FFD20A', '#FFA500'] as [string, string, ...string[]],
    icon: "fitness-outline",
    bgColor: 'rgba(255, 210, 10, 0.1)'
  },
  {
    id: 2,
    title: "Expert Trainers",
    subtitle: "Connect with certified professionals",
    description: "Access a network of qualified trainers who create customized workout plans tailored to your goals and fitness level.",
    image: require('../../assets/images/slide2.png'),
    gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]],
    icon: "people-outline",
    bgColor: 'rgba(76, 175, 80, 0.1)'
  },
  {
    id: 3,
    title: "Track Your Progress",
    subtitle: "Watch your transformation unfold",
    description: "Monitor your workouts, celebrate achievements, and stay motivated with detailed progress tracking and analytics.",
    image: require('../../assets/images/slide3.png'),
    gradient: ['#2196F3', '#1976D2'] as [string, string, ...string[]],
    icon: "trending-up-outline",
    bgColor: 'rgba(33, 150, 243, 0.1)'
  },
  {
    id: 4,
    title: "Start Your Journey",
    subtitle: "Ready to transform your life?",
    description: "Join thousands of users who have already transformed their fitness journey with ManiFit. Your best self awaits!",
    image: require('../../assets/images/slide4.png'),
    gradient: ['#9C27B0', '#7B1FA2'] as [string, string, ...string[]],
    icon: "rocket-outline",
    bgColor: 'rgba(156, 39, 176, 0.1)'
  },
];

export default function WelcomeOnboardingScreen({ navigation }: { navigation: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const dotAnimations = useRef(onboardingSlides.map(() => new Animated.Value(0.3))).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

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

    // Animate current dot
    dotAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === currentSlide ? 1 : 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    // Animate background color transition
    Animated.timing(backgroundColorAnim, {
      toValue: currentSlide,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentSlide]);

  const handleScroll = (event: any) => {
    const slideSize = width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    
    if (index !== currentSlide && index >= 0 && index < onboardingSlides.length) {
      setCurrentSlide(index);
    }
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide && index >= 0 && index < onboardingSlides.length) {
      setCurrentSlide(index);
      scrollViewRef.current?.scrollTo({
        x: index * width,
        animated: true,
      });
    }
  };

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const skipToEnd = () => {
    goToSlide(onboardingSlides.length - 1);
  };

  const currentSlideData = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;

  // Modern slide renderer with improved design
  const renderSlide = (slide: typeof onboardingSlides[0], index: number) => (
    <View key={slide.id} style={{ width, flex: 1 }}>
      <VStack style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 32,
        paddingVertical: 40
      }}>
        {/* Modern Image Container with Card Design */}
        <View
          style={{
            width: Math.min(width * 0.7, 300),
            height: Math.min(width * 0.7, 300),
            borderRadius: 32,
            marginBottom: 40,
            backgroundColor: '#2A2A2A',
            shadowColor: slide.gradient[0],
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 15,
            overflow: 'hidden',
          }}
        >
          {/* Background gradient */}
          <LinearGradient
            colors={[slide.bgColor, 'rgba(42, 42, 42, 0.8)']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          
          {/* Main image */}
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}>
            <Image
              source={slide.image}
              style={{
                width: '85%',
                height: '85%',
                borderRadius: 24,
              }}
              resizeMode="cover"
            />
          </View>
          
          {/* Modern icon badge */}
          <View
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#1E1E1E',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: slide.gradient[0],
              shadowColor: slide.gradient[0],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name={slide.icon as any} size={24} color={slide.gradient[0]} />
          </View>
        </View>

        {/* Modern Content Section */}
        <VStack style={{ 
          alignItems: 'center', 
          flex: 1,
          justifyContent: 'flex-start',
          maxWidth: width - 64,
          paddingTop: 20
        }}>
          {/* Title with modern typography */}
          <Heading 
            size="2xl" 
            style={{ 
              color: '#FFFFFF', 
              fontSize: 32,
              lineHeight: 38,
              marginBottom: 12,
              letterSpacing: -0.8,
              textAlign: 'center',
              fontWeight: '800'
            }}
          >
            {slide.title}
          </Heading>
          
          {/* Subtitle with accent color */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: slide.bgColor,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: `${slide.gradient[0]}20`,
            }}
          >
            <Text 
              style={{ 
                color: slide.gradient[0], 
                fontSize: 16, 
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: 0.2,
              }}
            >
              {slide.subtitle}
            </Text>
          </View>
          
          {/* Description with better spacing */}
          <Text 
            style={{ 
              color: '#B0B0B0', 
              fontSize: 16, 
              textAlign: 'center',
              lineHeight: 24,
              paddingHorizontal: 20,
              maxWidth: width - 96,
              fontWeight: '400',
            }}
          >
            {slide.description}
          </Text>
        </VStack>
      </VStack>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <StatusBar style="light" />
      
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {/* Modern Header with better spacing */}
        <View style={{ 
          paddingHorizontal: 24, 
          paddingTop: 16,
          paddingBottom: 8,
          height: 70,
          justifyContent: 'center'
        }}>
          <HStack style={{ 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Back button with modern design */}
            <View style={{ width: 80, alignItems: 'flex-start' }}>
              {currentSlide > 0 && (
                <TouchableOpacity 
                  onPress={() => goToSlide(currentSlide - 1)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#2A2A2A',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 210, 10, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chevron-back" size={20} color="#FFD20A" />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Modern progress indicator */}
            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: '#2A2A2A',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}>
              <Text style={{ 
                color: '#FFD20A', 
                fontSize: 14, 
                fontWeight: '700',
                textAlign: 'center'
              }}>
                {currentSlide + 1} / {onboardingSlides.length}
              </Text>
            </View>
            
            {/* Skip button with modern styling */}
            <View style={{ width: 80, alignItems: 'flex-end' }}>
              {!isLastSlide && (
                <TouchableOpacity 
                  onPress={skipToEnd}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 210, 10, 0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 210, 10, 0.3)',
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ 
                    color: '#FFD20A', 
                    fontSize: 14, 
                    fontWeight: '600' 
                  }}>
                    Skip
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </HStack>
        </View>

        {/* Slides Container */}
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            contentContainerStyle={{ height: '100%' }}
          >
            {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
          </ScrollView>
        </View>

        {/* Modern Bottom Section */}
        <View style={{ 
          paddingHorizontal: 24, 
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom + 20, 40),
          backgroundColor: '#1E1E1E'
        }}>
          <VStack style={{ gap: 32 }}>
            {/* Modern Pagination Dots */}
            <HStack style={{ 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 12
            }}>
              {onboardingSlides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => goToSlide(index)}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={{
                      width: currentSlide === index ? 32 : 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: currentSlide === index ? currentSlideData.gradient[0] : 'rgba(255, 255, 255, 0.2)',
                      opacity: dotAnimations[index],
                    }}
                  />
                </TouchableOpacity>
              ))}
            </HStack>

            {/* Action Buttons - No Animation, Just Conditional Rendering */}
            <VStack style={{ gap: 16 }}>
              {isLastSlide ? (
                // Final slide buttons
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(REGISTER)}
                    style={{
                      borderRadius: 24,
                      overflow: 'hidden',
                      backgroundColor: '#FFD20A',
                      shadowColor: '#FFD20A',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 16,
                      elevation: 12,
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
                      <HStack style={{ alignItems: 'center', gap: 12 }}>
                        <Ionicons name="person-add" size={22} color="#1E1E1E" />
                        <Text style={{ 
                          color: '#1E1E1E', 
                          fontSize: 18, 
                          fontWeight: '800',
                          letterSpacing: 0.2,
                        }}>
                          Create Account
                        </Text>
                      </HStack>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate(LOGIN)}
                    style={{
                      borderRadius: 24,
                      borderWidth: 2,
                      borderColor: 'rgba(255, 210, 10, 0.3)',
                      backgroundColor: '#2A2A2A',
                      paddingVertical: 16,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                    activeOpacity={0.8}
                  >
                    <HStack style={{ alignItems: 'center', gap: 12 }}>
                      <Ionicons name="log-in-outline" size={22} color="#FFD20A" />
                      <Text style={{ 
                        color: '#FFD20A', 
                        fontSize: 18, 
                        fontWeight: '700',
                        letterSpacing: 0.2,
                      }}>
                        Sign In
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                </>
              ) : (
                // Continue button for other slides
                <TouchableOpacity
                  onPress={nextSlide}
                  style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    backgroundColor: currentSlideData.gradient[0],
                    shadowColor: currentSlideData.gradient[0],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={currentSlideData.gradient}
                    style={{
                      paddingVertical: 18,
                      alignItems: 'center',
                    }}
                  >
                    <HStack style={{ alignItems: 'center', gap: 12 }}>
                      <Text style={{ 
                        color: '#FFFFFF', 
                        fontSize: 18, 
                        fontWeight: '800',
                        letterSpacing: 0.2,
                      }}>
                        Continue
                      </Text>
                      <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
                    </HStack>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </VStack>
          </VStack>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
} 