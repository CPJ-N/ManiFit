import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateUser } from '../../utils/controllers/userController';
import { auth } from '../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { setUser } from '../../store/userSlice';
import { RootState } from '../../store/reduxStore';
import { EDIT_PROFILE } from '../../constants/screenNames';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';

const { width } = Dimensions.get('window');

interface NavigationProps {
  goBack: () => void;
  navigate: (screen: string, params?: any) => void;
}

interface TrainerRegistrationScreenProps {
  navigation: NavigationProps;
}

// Benefit Item Component
const BenefitItem = ({ 
  icon, 
  title, 
  description,
  index 
}: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) => (
  <HStack className="items-start mb-4" style={styles.benefitItem}>
    <Box
      style={[
        styles.benefitIconContainer,
        { backgroundColor: `rgba(255, 210, 10, ${0.1 + (index * 0.02)})` }
      ]}
    >
      <Ionicons name={icon as any} size={20} color="#FFD20A" />
    </Box>
    <VStack className="flex-1 ml-3">
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDescription}>{description}</Text>
    </VStack>
  </HStack>
);



export default function TrainerRegistrationScreen({navigation}: TrainerRegistrationScreenProps){
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);

  // Check if user has completed their profile
  const isProfileComplete = () => {
    if (!userInfo) return false;
    
    const requiredFields = [
      userInfo.fullName,
      userInfo.mobileNumber,
      userInfo.dateOfBirth,
      userInfo.weight,
      userInfo.height
    ];
    
    return requiredFields.every(field => field && field.toString().trim() !== '');
  };

  const handleContinue = () => {
    // Check if user is authenticated
    if (!auth.currentUser?.uid) {
      Alert.alert('Error', 'Please login again to continue.');
      return;
    }

    // Check if profile is complete
    if (!isProfileComplete()) {
      Alert.alert(
        'Complete Your Profile',
        'Please complete your profile details before becoming a trainer. This includes your full name, mobile number, date of birth, weight, and height.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Complete Profile',
            onPress: () => navigation.navigate(EDIT_PROFILE)
          }
        ]
      );
      return;
    }

    setIsLoading(true);

    // Navigate to the next step in the trainer registration process
    updateUser(auth.currentUser.uid, { 
        isTrainer: true,
        linkedTrainees: [], // Array of trainee IDs (applicable only for trainers)
        linkedTrainer: ''
    }).then(() => {
        dispatch(setUser({
            ...userInfo, isTrainer: true, linkedTrainees: [], linkedTrainer: ''
        } as UserDetails));
        console.log('User updated to be Trainer:', auth.currentUser?.uid);
        Alert.alert(
          'Welcome to ManiFit Pro! 🎉',
          'You are now registered as a trainer. You can start adding clients and creating personalized workout routines.',
          [
            {
              text: 'Get Started',
              onPress: () => navigation.goBack()
            }
          ]
        );
    }
    ).catch((error) => {
        console.log('Error updating user:', error);
        Alert.alert('Error', 'Failed to register as trainer. Please try again.');
    }).finally(() => {
        setIsLoading(false);
    });
  };

  const benefits = [
    {
      icon: 'people',
      title: 'Build Your Client Base',
      description: 'Connect with fitness enthusiasts and grow your personal training business'
    },
    {
      icon: 'barbell',
      title: 'Create Custom Workouts',
      description: 'Design personalized workout plans and track your clients\' progress'
    },
    {
      icon: 'trending-up',
      title: 'Track Client Progress',
      description: 'Monitor achievements, set goals, and celebrate milestones together'
    },
    {
      icon: 'chatbubbles',
      title: 'Direct Communication',
      description: 'Stay connected with your clients through in-app messaging and support'
    },
    {
      icon: 'calendar',
      title: 'Flexible Scheduling',
      description: 'Set your own rates, schedule, and manage your training sessions'
    },
    {
      icon: 'trophy',
      title: 'Professional Recognition',
      description: 'Showcase your expertise and build your reputation in the fitness community'
    }
  ];



  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.15)', 'rgba(255, 210, 10, 0.05)', 'transparent']}
        style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
      >
        <Box className="px-6 py-4">
          <HStack className="items-center mb-6">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            <VStack className="flex-1 ml-4">
              <Heading 
                size="xl" 
                className="font-bold" 
                style={styles.headerTitle}
              >
                Become a Trainer
              </Heading>
              <Text style={styles.headerSubtitle}>
                Join our community of fitness professionals
              </Text>
            </VStack>
          </HStack>

          {/* Hero Text */}
          <VStack className="items-center py-3">
            <Text style={styles.heroTitle}>Transform Lives Through Fitness</Text>
            <Text style={styles.heroSubtitle}>
              Share your expertise and help others achieve their goals
            </Text>
          </VStack>
        </Box>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >


        {/* Benefits Section */}
        <Box className="px-6 py-4">
          <Card style={styles.benefitsCard}>
            <Box className="p-6">
              <HStack className="items-center mb-6">
                <Box style={styles.benefitsSectionIcon}>
                  <Ionicons name="star" size={20} color="#FFD20A" />
                </Box>
                <Heading size="lg" className="font-bold ml-3" style={styles.sectionTitle}>
                  Why Become a Trainer?
                </Heading>
              </HStack>
              
              <VStack space="md">
                {benefits.map((benefit, index) => (
                  <BenefitItem
                    key={index}
                    icon={benefit.icon}
                    title={benefit.title}
                    description={benefit.description}
                    index={index}
                  />
                ))}
              </VStack>
            </Box>
          </Card>
        </Box>

        {/* Requirements Section */}
        <Box className="px-6 py-4">
          <Card style={styles.requirementsCard}>
            <Box className="p-6">
              <HStack className="items-center mb-4">
                <Box style={styles.requirementsSectionIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </Box>
                <Heading size="lg" className="font-bold ml-3" style={[styles.sectionTitle, { color: '#4CAF50' }]}>
                  Ready to Get Started?
                </Heading>
              </HStack>
              
              <Text style={styles.requirementsDescription}>
                Complete your profile with all required information to ensure the best experience for you and your future clients.
              </Text>
              
              <VStack space="sm" className="mt-4">
                {[
                  'Complete personal information',
                  'Upload a professional profile photo',
                  'Add your fitness credentials',
                  'Set your training preferences'
                ].map((requirement, index) => (
                  <HStack key={index} className="items-center">
                    <Ionicons name="checkmark" size={16} color="#4CAF50" style={{ marginRight: 8 }} />
                    <Text style={styles.requirementText}>{requirement}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Card>
        </Box>

        {/* CTA Button */}
        <Box className="px-6 py-6">
          <TouchableOpacity
            style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
            onPress={handleContinue}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isLoading ? ['#666', '#444'] : ['#FFD20A', '#FFA500']}
              style={styles.ctaButtonGradient}
            >
              <Ionicons 
                name={isLoading ? "hourglass" : "rocket"} 
                size={20} 
                color="#1E1E1E" 
                style={{ marginRight: 8 }} 
              />
              <Text style={styles.ctaButtonText}>
                {isLoading ? "Setting Up Your Account..." : "Start My Trainer Journey"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.disclaimerText}>
            By continuing, you agree to provide accurate information and maintain professional standards.
          </Text>
        </Box>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  headerGradient: {
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.2)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 32,
  },
  headerSubtitle: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 2,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 26,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    backgroundColor: '#1E1E1E',
  },
  scrollContent: {
    backgroundColor: '#1E1E1E',
    flexGrow: 1,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
  },

  benefitsCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 0,
  },
  benefitsSectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitItem: {
    paddingVertical: 4,
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.2)',
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  requirementsCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
    padding: 0,
  },
  requirementsSectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementsDescription: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 22,
  },
  requirementText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  ctaButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FFD20A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  ctaButtonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});