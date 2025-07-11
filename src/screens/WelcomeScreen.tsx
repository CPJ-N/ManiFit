import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
// Theme colors are referenced directly to stay consistent across the app.
import { ROUTES } from '../constants/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

const { height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.brandHeader}>
          <View style={styles.appIcon}>
            <Text style={styles.iconText}>M</Text>
          </View>
          <Text style={styles.appName}>ManiFit</Text>
          <View style={styles.brandBadge}>
            <Text style={styles.badgeText}>AI-Powered</Text>
          </View>
        </View>
        
        <Text style={styles.mainTitle}>
          Your fitness journey{'\n'}starts here
        </Text>
        
        <Text style={styles.subtitle}>
          Track workouts, nutrition, and progress with AI-powered insights
        </Text>
      </View>

      {/* Stats Preview */}
      <View style={styles.statsSection}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>2,847</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statValue}>45min</Text>
            <Text style={styles.statLabel}>Workout</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👟</Text>
            <Text style={styles.statValue}>8.5k</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Analytics</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Goal Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🍎</Text>
            <Text style={styles.featureText}>Nutrition</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💡</Text>
            <Text style={styles.featureText}>AI Insights</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.REGISTER })}>
          <Text style={styles.primaryButtonText}>Get Started Free</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.LOGIN })}>
          <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'space-between',
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: height * 0.06,
    alignItems: 'center',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD20A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  brandBadge: {
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.4)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFD20A',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#B0B0B0',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    width: '22%',
    borderWidth: 1,
    borderColor: '#333333',
  },
  featureIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD20A',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  secondaryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: '#B0B0B0',
  },
});

export default WelcomeScreen; 