import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Account for padding and gap

export default function ExerciseItem({ exercise, viewDetails } : { exercise: any, viewDetails: (exercise: any) => void }) {

  return (
    <TouchableOpacity 
      style={styles.exerciseCard} 
      onPress={() => viewDetails(exercise)}
      activeOpacity={0.8}
    >
      {/* Image Container with Overlay */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: `${process.env.GITHUB_EXERCISE_IMAGE_URL_PREFIX}/${exercise.images[0]}`}} 
          style={styles.exerciseImage}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <View style={styles.imageOverlay} />
      </View>
      
      {/* Exercise Info */}
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName} numberOfLines={2}>
          {exercise.name}
        </Text>
        
        {/* Exercise Metadata */}
        <View style={styles.metadataContainer}>
          <View style={styles.metadataItem}>
            <Ionicons name="barbell-outline" size={12} color="#FFD20A" />
            <Text style={styles.metadataText}>
              {exercise.primaryMuscles?.length || 0} muscles
            </Text>
          </View>
          
          {exercise.equipment && exercise.equipment[0] && (
            <View style={styles.metadataItem}>
              <Ionicons name="fitness-outline" size={12} color="#888" />
              <Text style={styles.metadataText} numberOfLines={1}>
                {exercise.equipment[0]}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Action Button */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => viewDetails(exercise)}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-forward" size={16} color="#0F0F0F" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  exerciseCard: {
    width: cardWidth,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  playIconContainer: {
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
  },
  exerciseInfo: {
    padding: 12,
    flex: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  metadataContainer: {
    gap: 6,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  actionButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD20A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD20A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Legacy styles kept for backwards compatibility but not used
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