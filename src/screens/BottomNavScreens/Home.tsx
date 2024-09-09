import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exerciseCategories } from '../../constants/categories';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { auth } from '../../config/firebase';
import { COMPLETE_EXERCISE_LIST, EXERCISE_CATALOG, EXERCISE_TABS, PROFILE_TABS } from '../../constants/screenNames';
import { useEffect } from 'react';
import { setUser, setUserImageUrl } from '../../store/userSlice';
import { getUser } from '../../utils/controllers/userController';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { getImageUrl } from '../../utils/controllers/imageController';
import { firebaseBucketName } from '../../constants/firebaseContant';
import { getAllExercisesFromUrl } from '../../utils/controllers/exerciseController';
import { setExercises } from '../../store/workoutSlice';


const workoutVideos = exerciseCategories

export default function Home({navigation}) {

  const {userInfo, userImageUrl} = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userInfo) {
      getUser(auth.currentUser?.uid)
        .then((result) => {
          dispatch(setUser(result as UserDetails));
          if (result?.profilePhotoName !== '' || result?.profilePhotoName !== undefined) {
            getImageUrl(firebaseBucketName.userImages, result.profilePhotoName).then((url) => {
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {userInfo ? userInfo.fullName : auth.currentUser?.email}</Text>
          <Text style={styles.subGreeting}>It's Time To Challenge Your Limits.</Text>
        </View>
        <View style={{ position: 'relative', flex: 0 }}>
          <Image
              source={userImageUrl ? { uri: userImageUrl } : require('../../assets/placeholder-user-image.jpg')} // Replace with your image URL
              style={styles.profileImage}
            />
        </View>
      </View>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="barbell" size={24} color="#FFD20A" />
          <Text style={styles.actionText}>Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="stats-chart" size={24} color="#FFD20A" />
          <Text style={styles.actionText}>Progress Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="nutrition" size={24} color="#FFD20A" />
          <Text style={styles.actionText}>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="people" size={24} color="#FFD20A" />
          <Text style={styles.actionText}>Community</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.videoGrid}>
      <Text style={styles.sectionTitle}>Quick & Easy Workout Videos</Text>
      <Text style={styles.sectionSubtitle}>Discover Fresh Workouts: Elevate Your Training</Text>
        {workoutVideos.map((video, index) => (
          <TouchableOpacity key={index} style={styles.videoCard} onPress={() => navigation.navigate(EXERCISE_TABS, {screen: EXERCISE_CATALOG, params:{category: video.name}})}>
            <Image source={video.image} style={styles.videoImage} />
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.name}</Text>
              {/* <Text style={styles.videoTitle}>{video.title}</Text> */}
              {/* <View style={styles.videoMetrics}>
                <Ionicons name="time" size={16} color="#8A2BE2" />
                <Text style={styles.videoMetricText}>{video.duration}</Text>
                <Ionicons name="barbell" size={16} color="#8A2BE2" />
                <Text style={styles.videoMetricText}>{video.exercises} Exercises</Text>
              </View> */}
            </View>
            {/* <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="star-outline" size={20} color="white" />
            </TouchableOpacity> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD20A',
    padding: 5,
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 14,
    color: '#f4f4f4',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
},
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginTop: 4,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 16,
    marginBottom: 16,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
  videoCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 5,
  },
  videoImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    padding: 2,
  },
  videoInfo: {
    padding: 8,
  },
  videoTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoMetricText: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  playButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
});