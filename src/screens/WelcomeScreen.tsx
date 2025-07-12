import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../constants/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <ImageBackground
      source={require('../assets/images/welcome.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Dark overlay for better text readability */}
      <View className="absolute inset-0 bg-black/60" />
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        {/* Content Container */}
        <View className="flex-1 justify-end px-6 pb-10">
          {/* Bottom Section - Action Buttons */}
          <View className="space-y-4">
            {/* Additional Get Started Button */}
            <TouchableOpacity
              className="border-2 border-yellow-400 rounded-3xl py-5 px-8 items-center active:scale-95 mt-3"
              onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.REGISTER })}
              activeOpacity={0.9}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)', // Increased opacity
                borderColor: '#FFD20A',
              }}
            >
              <Text className="text-2xl font-bold text-yellow-400">Get Started</Text>
              <Text className="text-base text-yellow-200 mt-2 font-semibold">Create your free account</Text>
            </TouchableOpacity>
            {/* Sign In Button */}
            <TouchableOpacity 
              className="border-2 border-white/20 rounded-3xl py-5 px-8 items-center backdrop-blur-md active:scale-95 mt-3"
              onPress={() => navigation.navigate(ROUTES.AUTH, { screen: ROUTES.LOGIN })}
              activeOpacity={0.9}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)', // Increased opacity
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-2xl font-bold text-white">Sign In</Text>
              <Text className="text-base text-gray-200 mt-2 font-semibold">Welcome back!</Text>
            </TouchableOpacity>
            {/* Additional Info */}
            <View className="items-center mt-6 mb-2">
              <Text className="text-lg text-gray-300 text-center font-bold">
                Join thousands of fitness enthusiasts
              </Text>
              <View className="flex-row items-center mt-3">
                <View className="w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mr-3" />
                <Text className="text-lg text-gray-300 font-bold">Free to start</Text>
                <View className="w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full ml-6 mr-3" />
                <Text className="text-lg text-gray-300 font-bold">Expert guidance</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WelcomeScreen; 