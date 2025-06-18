import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, SafeAreaView, Dimensions, RefreshControl, View } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';

const { width, height } = Dimensions.get('window');
const workoutVideos = exerciseCategories;

// Enhanced Quick Action Component
const QuickActionCard = ({ 
  icon, 
  label, 
  onPress, 
  gradient = ['#FFD20A', '#FFA500'] as [string, string, ...string[]]
}: {
  icon: string;
  label: string;
  onPress: () => void;
  gradient?: [string, string, ...string[]];
}) => (
  <TouchableOpacity onPress={onPress} style={{ flex: 1, margin: 6 }}>
    <LinearGradient
      colors={gradient}
      style={{
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        minHeight: 80,
        justifyContent: 'center',
        shadowColor: '#FFD20A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons name={icon as any} size={28} color="#1E1E1E" />
      <Text 
        size="xs" 
        className="mt-2 text-center font-semibold" 
        style={{ color: '#1E1E1E', fontSize: 11 }}
      >
        {label}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Enhanced Workout Category Card
const WorkoutCategoryCard = ({ 
  video, 
  index, 
  onPress 
}: {
  video: any;
  index: number;
  onPress: () => void;
}) => (
  <TouchableOpacity 
    key={index} 
    className="mb-6"
    style={{ width: '48%' }}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Card 
      className="overflow-hidden p-0" 
      style={{
        backgroundColor: '#2A2A2A',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <Box style={{ position: 'relative' }}>
        <Image
          source={video.image}
          alt={video.name}
          className="w-full"
          style={{ height: 140, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          resizeMode="cover"
        />
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        {/* Play Button Overlay */}
        <Box
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(255, 210, 10, 0.9)',
            borderRadius: 20,
            width: 36,
            height: 36,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="play" size={18} color="#1E1E1E" />
        </Box>
      </Box>
      
      <Box className="px-4 py-4">
        <Heading size="sm" className="font-bold mb-1" style={{ color: 'white' }}>
          {video.name}
        </Heading>
        <Text size="xs" style={{ color: '#FFD20A', opacity: 0.8 }}>
          Quick Workout
        </Text>
      </Box>
    </Card>
  </TouchableOpacity>
);

 export default function Home({ navigation }: { navigation: any }) {
   const { userInfo, userImageUrl } = useSelector((state: RootState) => state.user);
   const dispatch = useDispatch();
   const [refreshing, setRefreshing] = useState(false);
   const [timeOfDay, setTimeOfDay] = useState('');
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

  const quickActions = [
    { icon: 'barbell', label: 'Start Workout', gradient: ['#FFD20A', '#FFA500'] as [string, string, ...string[]] },
    { icon: 'stats-chart', label: 'Progress', gradient: ['#4CAF50', '#2E7D32'] as [string, string, ...string[]] },
    { icon: 'nutrition', label: 'Nutrition', gradient: ['#FF6B6B', '#E53E3E'] as [string, string, ...string[]] },
    { icon: 'people', label: 'Community', gradient: ['#6366F1', '#4F46E5'] as [string, string, ...string[]] },
  ];

    return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#1E1E1E',
    }}>
      <StatusBar style="light" />
      
      {/* Enhanced Header Section with Gradient Background that covers safe area */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.1)', 'transparent']}
        style={{ 
          paddingTop: insets.top + 10,
          paddingBottom: 0,
        }}
      >
        <Box className="px-6 py-6">
          <HStack className="justify-between items-center">
            <VStack style={{ flex: 1 }}>
              <Text size="md" style={{ color: '#FFD20A', opacity: 0.8, marginBottom: 4 }}>
                Good {timeOfDay}
              </Text>
              <Heading 
                size="xl" 
                className="font-bold" 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: 28,
                  lineHeight: 34,
                  marginBottom: 6
                }}
              >
                {userInfo?.fullName?.split(' ')[0] || 'Champion'}
              </Heading>
              <Text size="sm" style={{ color: '#B0B0B0', lineHeight: 20 }}>
                Ready to push your limits today?
              </Text>
            </VStack>
            
            <TouchableOpacity
              onPress={() => navigation.navigate(PROFILE_TABS)}
              style={{
                shadowColor: '#FFD20A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Avatar size="xl" style={{ width: 70, height: 70, borderWidth: 3, borderColor: '#FFD20A' }}>
                {userImageUrl ? (
                  <AvatarImage 
                    source={{ uri: userImageUrl }}
                    alt="Profile"
                    style={{ width: 70, height: 70, borderRadius: 35 }}
                  />
                ) : (
                  <LinearGradient
                    colors={['#FFD20A', '#FFA500']}
                    style={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: 35, 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                  >
                    <AvatarFallbackText 
                      className="font-bold text-lg"
                      style={{ color: '#1E1E1E' }}
                    >
                      {userInfo?.fullName?.split(' ').map(name => name[0]).join('') || 'U'}
                    </AvatarFallbackText>
                  </LinearGradient>
                )}
              </Avatar>
            </TouchableOpacity>
          </HStack>
        </Box>
      </LinearGradient>
      
      <ScrollView 
        className="flex-1"
        style={{ backgroundColor: '#1E1E1E' }}
        contentContainerStyle={{ 
          backgroundColor: '#1E1E1E',
          flexGrow: 1,
          paddingBottom: insets.bottom,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD20A" />
        }
        showsVerticalScrollIndicator={false}
              >
         {/* Enhanced Quick Actions Grid */}
        <Box className="px-4 py-2">
          <Heading size="lg" className="font-bold mb-4" style={{ color: 'white', paddingHorizontal: 8 }}>
            Quick Actions
          </Heading>
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

        {/* Enhanced Workout Categories Section */}
        <Box className="px-4 py-6">
          <VStack space="md" className="mb-4">
            <Heading size="lg" className="font-bold" style={{ color: 'white', paddingHorizontal: 8 }}>
              Workout Categories
            </Heading>
            <Text size="sm" style={{ color: '#B0B0B0', paddingHorizontal: 8, lineHeight: 20 }}>
              Choose your training style and start your fitness journey
            </Text>
          </VStack>
          
          <Box 
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
          </Box>
        </Box>

        {/* Motivational Section */}
        <Box className="px-6 py-6">
          <LinearGradient
            colors={['#FFD20A', '#FFA500']}
            style={{
              borderRadius: 20,
              padding: 20,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Ionicons name="trophy" size={32} color="#1E1E1E" style={{ marginBottom: 12 }} />
            <Heading size="md" className="font-bold text-center mb-2" style={{ color: '#1E1E1E' }}>
              Your Fitness Journey Starts Here
            </Heading>
            <Text size="sm" className="text-center" style={{ color: '#1E1E1E', opacity: 0.8, lineHeight: 20 }}>
              Every workout brings you closer to your goals. Stay consistent, stay strong!
            </Text>
          </LinearGradient>
                 </Box>
       </ScrollView>
     </View>
   );
 }