import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, SafeAreaView, Dimensions, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { exerciseCategories } from '../../constants/categories';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { auth } from '../../config/firebase';
import { COMPLETE_EXERCISE_LIST, EXERCISE_CATALOG, EXERCISE_TABS, PROFILE_TABS } from '../../constants/screenNames';
import { setUserImageUrl } from '../../store/userSlice';
import { getImageUrl } from '../../utils/controllers/imageController';
import { firebaseBucketName } from '../../constants/firebaseContant';
import { getAllExercisesFromUrl } from '../../utils/controllers/exerciseController';
import { setExercises } from '../../store/workoutSlice';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const { width, height } = Dimensions.get('window');
const workoutVideos = exerciseCategories;

// Modern Quick Action Component - No Animations
const QuickActionCard = ({ 
  icon, 
  label, 
  onPress, 
  colors = { primary: '#FFD20A', secondary: '#FFA500' }
}: {
  icon: string;
  label: string;
  onPress: () => void;
  colors?: { primary: string; secondary: string };
}) => (
  <TouchableOpacity onPress={onPress} style={{ flex: 1, margin: 6 }} activeOpacity={0.8}>
    <View
      style={{
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 18,
        alignItems: 'center',
        minHeight: 90,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(30, 30, 30, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon as any} size={24} color="#1E1E1E" />
      </Box>
      <Text 
        size="xs" 
        className="text-center font-semibold" 
        style={{ color: '#1E1E1E', fontSize: 12, lineHeight: 16 }}
      >
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

// Modern Workout Category Card - ExerciseItem Style
const WorkoutCategoryCard = ({ 
  video, 
  index, 
  onPress 
}: {
  video: any;
  index: number;
  onPress: () => void;
}) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <TouchableOpacity 
      key={index} 
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: (width - 60) / 2, // Same as ExerciseItem
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Image Container with Overlay */}
      <View style={{ position: 'relative', height: 120 }}>
        {!imageError ? (
          <Image
            source={video.image}
            style={{ 
              width: '100%', 
              height: '100%', 
              borderTopLeftRadius: 16, 
              borderTopRightRadius: 16,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            resizeMode="cover"
            onError={() => setImageError(true)}
            onLoadStart={() => {}}
            onLoadEnd={() => {}}
          />
        ) : (
          <View 
            style={{
              width: '100%', 
              height: '100%', 
              backgroundColor: '#2A2A2A',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 16, 
              borderTopRightRadius: 16,
            }}
          >
            <Ionicons name="image-outline" size={32} color="#666" />
          </View>
        )}
      
      {/* Image Overlay */}
      <View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />
      
      {/* Play Icon Container */}
      <View 
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255, 210, 10, 0.3)',
        }}
      >
        <Ionicons name="play" size={12} color="#FFD20A" />
      </View>
    </View>
    
    {/* Category Info */}
    <View style={{ padding: 12, flex: 1 }}>
      <Text 
        style={{
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: '600',
          lineHeight: 18,
          marginBottom: 8,
          letterSpacing: -0.2,
        }}
        numberOfLines={2}
      >
        {video.name}
      </Text>
      
      {/* Category Metadata */}
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="fitness-outline" size={12} color="#FFD20A" />
          <Text 
            style={{
              color: '#888',
              fontSize: 11,
              fontWeight: '500',
              flex: 1,
            }}
          >
            Workout Category
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="time-outline" size={12} color="#888" />
          <Text 
            style={{
              color: '#888',
              fontSize: 11,
              fontWeight: '500',
              flex: 1,
            }}
          >
            Multiple exercises
          </Text>
        </View>
      </View>
    </View>
    
    {/* Action Button */}
    <TouchableOpacity 
      style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFD20A',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-forward" size={16} color="#0F0F0F" />
    </TouchableOpacity>
  </TouchableOpacity>
  );
};

// Progress Stats Component - No Animations
const ProgressStatsCard = () => (
  <Card 
    className="p-0 mb-6" 
    style={{
      backgroundColor: '#2A2A2A',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 210, 10, 0.1)',
    }}
  >
    <View
      style={{
        backgroundColor: 'rgba(255, 210, 10, 0.05)',
        borderRadius: 20,
        padding: 20,
      }}
    >
      <HStack className="justify-between items-center mb-4">
        <VStack>
          <Heading size="md" className="font-bold" style={{ color: '#FFFFFF', marginBottom: 4 }}>
            Today's Progress
          </Heading>
          <Text size="sm" style={{ color: '#B0B0B0' }}>
            Keep pushing forward!
          </Text>
        </VStack>
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255, 210, 10, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="trending-up" size={22} color="#FFD20A" />
        </Box>
      </HStack>
      
      <HStack className="justify-between">
        <VStack className="items-center flex-1">
          <Text style={{ color: '#FFD20A', fontSize: 20, fontWeight: 'bold', marginBottom: 2 }}>
            0
          </Text>
          <Text size="xs" style={{ color: '#B0B0B0' }}>
            Workouts
          </Text>
        </VStack>
        <VStack className="items-center flex-1">
          <Text style={{ color: '#FFD20A', fontSize: 20, fontWeight: 'bold', marginBottom: 2 }}>
            0
          </Text>
          <Text size="xs" style={{ color: '#B0B0B0' }}>
            Calories
          </Text>
        </VStack>
        <VStack className="items-center flex-1">
          <Text style={{ color: '#FFD20A', fontSize: 20, fontWeight: 'bold', marginBottom: 2 }}>
            0
          </Text>
          <Text size="xs" style={{ color: '#B0B0B0' }}>
            Minutes
          </Text>
        </VStack>
      </HStack>
    </View>
  </Card>
);

export default function Home({ navigation }: { navigation: any }) {
  const { userInfo, userImageUrl } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const insets = useSafeAreaInsets();

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const exercises = await getAllExercisesFromUrl();
      dispatch(setExercises(exercises));
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    // Only fetch user image if we have userInfo but no image URL yet
    if (userInfo && userInfo.profilePhotoName && !userImageUrl) {
      getImageUrl(firebaseBucketName.userImages, userInfo.profilePhotoName)
        .then((url) => {
          dispatch(setUserImageUrl(url));
        })
        .catch((error) => {
          console.error('Error fetching user image:', error);
        });
    }

    // Fetch exercises data
    const fetchAllExercises = async () => {
      try {
        const exercises = await getAllExercisesFromUrl();
        dispatch(setExercises(exercises));
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchAllExercises();
  }, [userInfo, userImageUrl, dispatch]);

  // Preload category images to prevent "Task orphaned" warnings
  useEffect(() => {
    const preloadImages = async () => {
      try {
        // Preload all category images
        const imagePromises = workoutVideos.map((video) => {
          return new Promise((resolve, reject) => {
            if (video.image) {
              Image.prefetch?.(Image.resolveAssetSource(video.image).uri)
                .then(resolve)
                .catch(resolve); // Resolve even on error to prevent blocking
            } else {
              resolve(null);
            }
          });
        });
        
        await Promise.allSettled(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.log('Image preload error:', error);
        setImagesLoaded(true); // Set as loaded anyway
      }
    };

    preloadImages();
  }, []);

  const quickActions = [
    { icon: 'barbell', label: 'Start Workout', colors: { primary: '#FFD20A', secondary: '#FFA500' } },
    { icon: 'stats-chart', label: 'Progress', colors: { primary: '#4CAF50', secondary: '#2E7D32' } },
    { icon: 'nutrition', label: 'Nutrition', colors: { primary: '#FF6B6B', secondary: '#E53E3E' } },
    { icon: 'people', label: 'Community', colors: { primary: '#6366F1', secondary: '#4F46E5' } },
  ];

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Modern Header Section - No Gradients */}
      <View
        style={{ 
          backgroundColor: 'rgba(255, 210, 10, 0.05)',
          paddingTop: insets.top + 20,
          paddingBottom: 20,
        }}
      >
        <Box className="px-6">
          <HStack className="justify-between items-center">
            <VStack style={{ flex: 1 }}>
              <Heading 
                size="2xl" 
                className="font-bold" 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: 32,
                  lineHeight: 38,
                  marginBottom: 8
                }}
              >
                Welcome, {userInfo?.fullName?.split(' ')[0] || 'Champion'}!
              </Heading>
              <Text size="md" style={{ color: '#B0B0B0', lineHeight: 22 }}>
                Ready to transform your fitness journey?
              </Text>
            </VStack>
            
            <TouchableOpacity
              onPress={() => navigation.navigate(PROFILE_TABS)}
              activeOpacity={0.8}
            >
              <Box
                style={{
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: '#FFD20A',
                  padding: 2,
                }}
              >
                <Avatar size="xl" style={{ width: 60, height: 60 }}>
                  {userImageUrl ? (
                    <AvatarImage 
                      source={{ uri: userImageUrl }}
                      alt="Profile"
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                    />
                  ) : (
                    <View
                      style={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 30, 
                        backgroundColor: '#FFD20A',
                        justifyContent: 'center', 
                        alignItems: 'center' 
                      }}
                    >
                      <AvatarFallbackText 
                        className="font-bold"
                        style={{ color: '#1E1E1E', fontSize: 18 }}
                      >
                        {userInfo?.fullName?.split(' ').map(name => name[0]).join('') || 'U'}
                      </AvatarFallbackText>
                    </View>
                  )}
                </Avatar>
              </Box>
            </TouchableOpacity>
          </HStack>
        </Box>
      </View>
      
      <ScrollView 
        className="flex-1"
        style={{ backgroundColor: '#1E1E1E' }}
        contentContainerStyle={{ 
          backgroundColor: '#1E1E1E',
          flexGrow: 1,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Stats Section */}
        <Box className="px-6 py-4">
          <ProgressStatsCard />
        </Box>

        {/* Quick Actions Grid - Modern Design */}
        <Box className="px-6 py-2">
          <VStack space="md" className="mb-6">
            <Heading size="lg" className="font-bold" style={{ color: 'white' }}>
              Quick Actions
            </Heading>
            <Text size="sm" style={{ color: '#B0B0B0', lineHeight: 20 }}>
              Jump right into your fitness routine
            </Text>
          </VStack>
          
          <VStack space="md">
            <HStack space="sm">
              <QuickActionCard {...quickActions[0]} onPress={() => {}} />
              <QuickActionCard {...quickActions[1]} onPress={() => {}} />
            </HStack>
            <HStack space="sm">
              <QuickActionCard {...quickActions[2]} onPress={() => {}} />
              <QuickActionCard {...quickActions[3]} onPress={() => {}} />
            </HStack>
          </VStack>
        </Box>

        {/* Workout Categories Section - Improved Design */}
        <Box className="px-6 py-6">
          <VStack space="md" className="mb-6">
            <Heading size="lg" className="font-bold" style={{ color: 'white' }}>
              Workout Categories
            </Heading>
            <Text size="sm" style={{ color: '#B0B0B0', lineHeight: 20 }}>
              Discover workouts tailored to your goals
            </Text>
          </VStack>
          
          <View 
            style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between',
              paddingHorizontal: 4
            }}
          >
            {workoutVideos.map((video, index) => (
              <WorkoutCategoryCard
                key={index}
                video={video}
                index={index}
                onPress={() => navigation.navigate(EXERCISE_TABS, {
                  screen: EXERCISE_CATALOG, 
                  params: { category: video.name }
                })}
              />
            ))}
          </View>
        </Box>

        {/* Motivational Section - Modern Card Design */}
        <Box className="px-6 py-4">
          <Card 
            className="p-0" 
            style={{
              backgroundColor: '#2A2A2A',
              borderRadius: 24,
              borderWidth: 1,
              borderColor: 'rgba(255, 210, 10, 0.2)',
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 210, 10, 0.05)',
                borderRadius: 24,
                padding: 24,
                alignItems: 'center',
              }}
            >
              <Box
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: 'rgba(255, 210, 10, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons name="trophy" size={28} color="#FFD20A" />
              </Box>
              <Heading size="lg" className="font-bold text-center mb-3" style={{ color: '#FFFFFF' }}>
                Your Fitness Journey Starts Here
              </Heading>
              <Text size="md" className="text-center" style={{ color: '#B0B0B0', lineHeight: 22 }}>
                Every workout brings you closer to your goals. Stay consistent, stay strong!
              </Text>
              
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: '#FFD20A',
                }}
                activeOpacity={0.8}
                onPress={onRefresh}
              >
                <Text style={{ color: '#FFD20A', fontWeight: '600', fontSize: 14 }}>
                  {refreshing ? 'Loading...' : 'Refresh Data'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Box>
      </ScrollView>
    </View>
  );
}