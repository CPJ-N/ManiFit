import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../constants/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <View className="bg-[#2A2A2A] rounded-2xl p-6 mb-4 border-2 border-[#333]">
    <View className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl items-center justify-center mb-4">
      <Ionicons name={icon} size={28} color="#1E1E1E" />
    </View>
    <Text className="text-white text-xl font-bold mb-2">{title}</Text>
    <Text className="text-gray-400 text-base leading-6">{description}</Text>
  </View>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard = ({ number, title, description }: StepCardProps) => (
  <View className="items-center mb-8">
    <View className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 items-center justify-center mb-4">
      <Text className="text-[#1E1E1E] text-2xl font-extrabold">{number}</Text>
    </View>
    <Text className="text-white text-lg font-bold mb-2 text-center">{title}</Text>
    <Text className="text-gray-400 text-sm text-center px-4">{description}</Text>
  </View>
);

interface BenefitItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const BenefitItem = ({ icon, text }: BenefitItemProps) => (
  <View className="flex-row items-center mb-4">
    <View className="w-8 h-8 rounded-full bg-yellow-400/20 items-center justify-center mr-3">
      <Ionicons name={icon} size={18} color="#FFD20A" />
    </View>
    <Text className="text-gray-300 text-base flex-1">{text}</Text>
  </View>
);

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-[#1E1E1E]">
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Hero Section */}
        <ImageBackground
          source={require('../assets/images/welcome.png')}
          style={{ width: '100%', minHeight: height * 0.85 }}
          resizeMode="cover"
        >
          {/* Dark overlay for better text readability */}
          <View className="absolute inset-0 bg-black/70" />

          <SafeAreaView className="flex-1">
            <View className="flex-1 justify-between px-6 py-8">
              {/* Logo/Brand */}
              <View className="items-center pt-4">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="fitness" size={24} color="#1E1E1E" />
                  </View>
                  <Text className="text-white text-3xl font-extrabold">ManiFit</Text>
                </View>
              </View>

              {/* Hero Content */}
              <View className="flex-1 justify-center items-center">
                <Text className="text-white text-5xl font-extrabold text-center mb-4 leading-tight">
                  Transform Your{'\n'}
                  <Text className="text-yellow-400">Fitness Journey</Text>
                </Text>

                <Text className="text-gray-300 text-lg text-center mb-8 px-4 leading-7">
                  Your personal fitness companion. Track workouts, monitor progress, and achieve your goals with expert guidance.
                </Text>

                {/* Stats Row */}
                <View className="flex-row justify-around w-full mb-12 px-4">
                  <View className="items-center">
                    <Text className="text-yellow-400 text-3xl font-extrabold">10K+</Text>
                    <Text className="text-gray-400 text-sm mt-1">Active Users</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-yellow-400 text-3xl font-extrabold">500+</Text>
                    <Text className="text-gray-400 text-sm mt-1">Workouts</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-yellow-400 text-3xl font-extrabold">98%</Text>
                    <Text className="text-gray-400 text-sm mt-1">Success Rate</Text>
                  </View>
                </View>
              </View>

              {/* CTA Buttons */}
              <View className="space-y-4">
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.REGISTER })}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#FFD20A', '#FFA500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="rounded-2xl py-5 px-8 items-center"
                  >
                    <Text className="text-[#1E1E1E] text-xl font-extrabold">Get Started Free</Text>
                    <Text className="text-[#1E1E1E]/80 text-sm mt-1 font-semibold">No credit card required</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border-2 border-white/30 rounded-2xl py-5 px-8 items-center backdrop-blur-md"
                  onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.LOGIN })}
                  activeOpacity={0.9}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Text className="text-white text-xl font-bold">Sign In</Text>
                  <Text className="text-gray-300 text-sm mt-1 font-semibold">Welcome back!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Features Section */}
        <View className="bg-[#1E1E1E] px-6 py-16">
          <View className="items-center mb-12">
            <Text className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-3">Features</Text>
            <Text className="text-white text-3xl font-extrabold text-center mb-3">
              Everything You Need
            </Text>
            <Text className="text-gray-400 text-base text-center">
              All the tools to reach your fitness goals
            </Text>
          </View>

          <FeatureCard
            icon="barbell"
            title="Custom Workout Plans"
            description="Get personalized workout routines tailored to your fitness level and goals. Expert-designed programs that adapt as you progress."
          />

          <FeatureCard
            icon="analytics"
            title="Progress Tracking"
            description="Monitor your achievements with detailed analytics and insights. Visualize your journey with comprehensive charts and stats."
          />

          <FeatureCard
            icon="people"
            title="Expert Trainers"
            description="Connect with certified fitness professionals. Get guidance, motivation, and accountability from industry experts."
          />

          <FeatureCard
            icon="nutrition"
            title="Nutrition Guidance"
            description="Access meal plans and nutritional advice to fuel your workouts. Learn what to eat for optimal performance and recovery."
          />
        </View>

        {/* How It Works Section */}
        <View className="bg-gradient-to-b from-[#1E1E1E] to-[#2A2A2A] px-6 py-16">
          <View className="items-center mb-12">
            <Text className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-3">How It Works</Text>
            <Text className="text-white text-3xl font-extrabold text-center mb-3">
              Start in 3 Simple Steps
            </Text>
            <Text className="text-gray-400 text-base text-center px-4">
              Getting started is quick and easy
            </Text>
          </View>

          <StepCard
            number="1"
            title="Create Your Account"
            description="Sign up for free in seconds. No credit card required to get started."
          />

          <StepCard
            number="2"
            title="Set Your Goals"
            description="Tell us about your fitness goals and preferences. We'll customize everything for you."
          />

          <StepCard
            number="3"
            title="Start Training"
            description="Begin your personalized workout plan and track your progress every step of the way."
          />
        </View>

        {/* Benefits Section */}
        <View className="bg-[#1E1E1E] px-6 py-16">
          <View className="items-center mb-12">
            <Text className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-3">Why ManiFit</Text>
            <Text className="text-white text-3xl font-extrabold text-center mb-3">
              Your Success Is Our Mission
            </Text>
          </View>

          <View className="bg-[#2A2A2A] rounded-2xl p-6 border-2 border-[#333]">
            <BenefitItem icon="checkmark-circle" text="Free to start with no hidden fees" />
            <BenefitItem icon="checkmark-circle" text="Personalized workout plans for all fitness levels" />
            <BenefitItem icon="checkmark-circle" text="Track progress with detailed analytics" />
            <BenefitItem icon="checkmark-circle" text="Access to certified fitness trainers" />
            <BenefitItem icon="checkmark-circle" text="Nutrition guidance and meal planning" />
            <BenefitItem icon="checkmark-circle" text="Community support and motivation" />
            <BenefitItem icon="checkmark-circle" text="Works on all your devices" />
            <BenefitItem icon="checkmark-circle" text="Regular updates with new workouts" />
          </View>
        </View>

        {/* Final CTA Section */}
        <View className="bg-gradient-to-b from-[#1E1E1E] to-[#2A2A2A] px-6 py-16">
          <View className="bg-[#2A2A2A] rounded-3xl p-8 border-2 border-yellow-400/30">
            <View className="items-center mb-8">
              <Text className="text-white text-3xl font-extrabold text-center mb-4 leading-tight">
                Ready to Transform Your Life?
              </Text>
              <Text className="text-gray-400 text-base text-center">
                Join thousands of people achieving their fitness goals
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.REGISTER })}
              activeOpacity={0.9}
              className="mb-4"
            >
              <LinearGradient
                colors={['#FFD20A', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl py-5 px-8 items-center"
              >
                <View className="flex-row items-center">
                  <Ionicons name="rocket" size={24} color="#1E1E1E" />
                  <Text className="text-[#1E1E1E] text-xl font-extrabold ml-2">Start Your Journey</Text>
                </View>
                <Text className="text-[#1E1E1E]/80 text-sm mt-2 font-semibold">
                  Get started in less than 60 seconds
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View className="items-center mt-4">
              <Text className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Text
                  className="text-yellow-400 font-bold"
                  onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.LOGIN })}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="bg-[#1E1E1E] px-6 py-8 border-t border-[#333]">
          <View className="flex-row items-center justify-center mb-4">
            <View className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl items-center justify-center mr-2">
              <Ionicons name="fitness" size={20} color="#1E1E1E" />
            </View>
            <Text className="text-white text-xl font-bold">ManiFit</Text>
          </View>
          <Text className="text-gray-500 text-center text-sm">
            © 2025 ManiFit. All rights reserved.
          </Text>
          <Text className="text-gray-600 text-center text-xs mt-2">
            Your journey to better health starts here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default WelcomeScreen;
