import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exerciseCategories } from '../../constants/categories';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { auth } from '../../config/firebase';
import { COMPLETE_EXERCISE_LIST, EXERCISE_CATALOG, EXERCISE_TABS, PROFILE_TABS } from '../../constants/screenNames';
import { setUser, setUserImageUrl } from '../../store/userSlice';
import { getUser } from '../../utils/controllers/userController';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
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
import { Image } from '@/components/ui/image';

const workoutVideos = exerciseCategories;

export default function Home({navigation} : {navigation: any}) {
  const {userInfo, userImageUrl} = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userInfo) {
      getUser(auth.currentUser?.uid || '')
        .then((result) => {
          dispatch(setUser(result as UserDetails));
          if (result && result.profilePhotoName) {
            getImageUrl(firebaseBucketName.userImages, result.profilePhotoName || '').then((url) => {
              dispatch(setUserImageUrl(url));
            }).catch((error) => {
              console.error('Error fetching user image:', error);
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
    const fetchAllExercises = async () => {
      try {
        const exercises = await getAllExercisesFromUrl();
        dispatch(setExercises(exercises));
        } catch (error) {
          console.error('Error fetching exercises:', error);
        }
    }
    fetchAllExercises();
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{backgroundColor: '#1E1E1E'}}>
      <StatusBar style="light" />
      
      {/* Header Section - Original Layout */}
      <Box className="px-5 pt-5 pb-3 mt-5">
        <HStack className="justify-between items-center">
          <VStack>
            <Heading size="xl" className="font-bold mb-1" style={{color: '#FFD20A', paddingHorizontal: 5}}>
              Hi, {userInfo ? userInfo.fullName : auth.currentUser?.email}
            </Heading>
            <Text size="sm" style={{color: '#f4f4f4'}}>
              It's Time To Challenge Your Limits.
            </Text>
          </VStack>
          
          <Avatar size="xl" className="border-0">
            {userImageUrl ? (
              <AvatarImage 
                source={{ uri: userImageUrl }}
                alt="Profile"
                style={{width: 80, height: 80, borderRadius: 40}}
              />
            ) : (
              <AvatarFallbackText className="text-typography-0 font-semibold">
                {userInfo?.fullName?.split(' ').map(name => name[0]).join('') || 'U'}
              </AvatarFallbackText>
            )}
          </Avatar>
        </HStack>
      </Box>

      {/* Quick Actions - Original Layout */}
      <Box className="px-4 py-4">
        <HStack className="justify-around items-center">
          <TouchableOpacity>
            <VStack className="items-center">
              <Ionicons name="barbell" size={24} color="#FFD20A" />
              <Text size="xs" className="mt-1" style={{color: 'white'}}>
                Workout
              </Text>
            </VStack>
          </TouchableOpacity>
          <TouchableOpacity>
            <VStack className="items-center">
              <Ionicons name="stats-chart" size={24} color="#FFD20A" />
              <Text size="xs" className="mt-1" style={{color: 'white'}}>
                Progress Tracking
              </Text>
            </VStack>
          </TouchableOpacity>
          <TouchableOpacity>
            <VStack className="items-center">
              <Ionicons name="nutrition" size={24} color="#FFD20A" />
              <Text size="xs" className="mt-1" style={{color: 'white'}}>
                Nutrition
              </Text>
            </VStack>
          </TouchableOpacity>
          <TouchableOpacity>
            <VStack className="items-center">
              <Ionicons name="people" size={24} color="#FFD20A" />
              <Text size="xs" className="mt-1" style={{color: 'white'}}>
                Community
              </Text>
            </VStack>
          </TouchableOpacity>
        </HStack>
      </Box>

      {/* Workout Categories - Original Layout */}
      <ScrollView className="flex-1" contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 8}}>
        <Heading size="lg" className="w-full font-bold ml-4 mt-4 mb-0" style={{color: 'white'}}>
          Quick & Easy Workout Videos
        </Heading>
        <Text size="sm" className="w-full ml-4 mb-4" style={{color: 'gray'}}>
          Discover Fresh Workouts: Elevate Your Training
        </Text>
        
        {workoutVideos.map((video, index) => (
          <TouchableOpacity 
            key={index} 
            className="mb-4"
            style={{width: '48%'}}
            onPress={() => navigation.navigate(EXERCISE_TABS, {
              screen: EXERCISE_CATALOG, 
              params: {category: video.name}
            })}
          >
            <Card className="overflow-hidden p-0" style={{backgroundColor: '#2A2A2A', borderRadius: 12}}>
              <Image
                source={video.image}
                alt={video.name}
                className="w-full rounded-t-lg"
                style={{height: 160}}
                resizeMode="cover"
              />
              <Box className="px-3 py-3">
                <Heading size="sm" className="font-bold" style={{color: 'white'}}>
                  {video.name}
                </Heading>
              </Box>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};