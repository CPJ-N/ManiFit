import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations sequence
    const startAnimations = () => {
      // Logo and content fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    startAnimations();

    // Cleanup function
    return () => {
      fadeAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Dynamic Background Gradient */}
      <LinearGradient
        colors={['#FFD20A', '#FFA500', '#FF8C00']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Background Pattern */}
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']}
        style={styles.backgroundPattern}
      />

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.logoBackdrop}
            />
            <Image
              source={require('../assets/ManiFit Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Brand Name */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>MANIFIT</Text>
          <Text style={styles.tagline}>Transform Your Fitness Journey</Text>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <View style={styles.loadingIcon}>
              <LinearGradient
                colors={['#1E1E1E', '#333']}
                style={styles.loadingIconGradient}
              >
                <Ionicons name="fitness" size={24} color="#FFD20A" />
              </LinearGradient>
            </View>
            <Text style={styles.loadingText}>Loading your fitness experience...</Text>
          </View>
        </View>

        {/* Bottom Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeDot, { backgroundColor: 'rgba(30, 30, 30, 0.1)' }]} />
            <View style={[styles.decorativeDot, { backgroundColor: 'rgba(30, 30, 30, 0.2)' }]} />
            <View style={[styles.decorativeDot, { backgroundColor: 'rgba(30, 30, 30, 0.3)' }]} />
          </View>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View 
        style={[
          styles.footer,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.footerText}>
          Powered by ManiFit Team
        </Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: -50,
    right: -50,
    height: height,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBackdrop: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 120,
    zIndex: 1,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    letterSpacing: 4,
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  loadingWrapper: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 20,
  },
  loadingIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  decorativeContainer: {
    position: 'absolute',
    bottom: 120,
  },
  decorativeElements: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
  },
});

export default LoadingScreen;
