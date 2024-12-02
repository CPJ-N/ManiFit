import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExerciseItem({ exercise, viewDetails } : { exercise: any, viewDetails: (exercise: any) => void }) {

  return (
    <TouchableOpacity style={styles.videoCard} onPress={() => viewDetails(exercise)}>
    <Image source={{ uri: `${process.env.GITHUB_EXERCISE_IMAGE_URL_PREFIX}/${exercise.images[0]}`}} style={styles.videoImage} />
    
    <View style={styles.videoInfo}>
      <Text style={styles.videoTitle}>{exercise.name}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
      width: '48%',
      marginBottom: 16,
      backgroundColor: '#2A2A2A',
      borderRadius: 10,
      overflow: 'hidden',
      padding: 5,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  icons: {
      color: '#000',
      flexDirection: 'row',
      marginLeft: 10,
  },
  videoCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 5,
  },
  videoImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
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