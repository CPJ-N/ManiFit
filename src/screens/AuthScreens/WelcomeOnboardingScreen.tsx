import React, { useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, Dimensions, Animated, SafeAreaView, ImageBackground } from 'react-native';
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

export default function WelcomeOnboardingScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequential entrance animations
    Animated.sequence([
      // Content slides up
      Animated.parallel([
        Animated.timing(contentAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Buttons appear last
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for the main button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Start pulse after a delay
    setTimeout(() => pulseAnimation.start(), 2500);

    return () => pulseAnimation.stop();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      
      {/* Full Screen Background Image */}
      <ImageBackground
        source={require('../../assets/images/welcome.png')}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: width,
          height: height,
          zIndex: 0,
        }}
        resizeMode="cover"
      >
        {/* Dark Overlay for better text readability */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.7)',
            'rgba(0, 0, 0, 0.4)',
            'rgba(0, 0, 0, 0.6)',
            'rgba(0, 0, 0, 0.8)'
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </ImageBackground>

      {/* Content Layer */}
      <SafeAreaView style={{ flex: 1, zIndex: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            paddingHorizontal: 24,
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 20,
          }}
        >
          {/* Main Content */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Animated.View
              style={{
                transform: [{ translateY: contentAnim }],
                alignItems: 'center',
                marginBottom: 80,
              }}
            >
              {/* Main Headline */}
              <Heading 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: 48,
                  lineHeight: 54,
                  marginBottom: 24,
                  letterSpacing: -2,
                  textAlign: 'center',
                  fontWeight: '900',
                  textShadowColor: 'rgba(0, 0, 0, 0.8)',
                  textShadowOffset: { width: 0, height: 3 },
                  textShadowRadius: 6,
                }}
              >
                Welcome to{'\n'}ManiFit
              </Heading>
            </Animated.View>
          </View>

          {/* Action Buttons */}
          <Animated.View
            style={{
              transform: [{ translateY: buttonAnim }],
              marginBottom: 20,
            }}
          >
            <VStack style={{ gap: 16 }}>
              {/* Primary CTA - Get Started */}
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate(REGISTER)}
                  style={{
                    borderRadius: 30,
                    overflow: 'hidden',
                    shadowColor: '#FFD20A',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.5,
                    shadowRadius: 24,
                    elevation: 20,
                  }}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#FFD20A', '#FFA500', '#FF8C00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      paddingVertical: 20,
                      paddingHorizontal: 32,
                      alignItems: 'center',
                    }}
                  >
                    <HStack style={{ alignItems: 'center', gap: 12 }}>
                      <Ionicons name="rocket" size={24} color="#000000" />
                      <Text style={{ 
                        color: '#000000', 
                        fontSize: 20, 
                        fontWeight: '900',
                        letterSpacing: 0.5,
                      }}>
                        Get Started
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#000000" />
                    </HStack>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Secondary CTA - Sign In */}
              <TouchableOpacity
                onPress={() => navigation.navigate(LOGIN)}
                style={{
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
                activeOpacity={0.8}
              >
                                 <HStack style={{ alignItems: 'center', gap: 12 }}>
                   <Ionicons name="log-in-outline" size={24} color="#FFFFFF" />
                   <Text style={{ 
                     color: '#FFFFFF', 
                     fontSize: 18, 
                     fontWeight: '700',
                     letterSpacing: 0.3,
                   }}>
                     Sign In
                   </Text>
                 </HStack>
              </TouchableOpacity>
            </VStack>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 