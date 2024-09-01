import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateUser } from '../../utils/controllers/userController';
import { auth } from '../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails } from '../../constants/dataModels/userDetails.model';
import { setUser } from '../../store/userSlice';
import { RootState } from '../../store/reduxStore';

export default function TrainerRegistrationScreen({navigation}){
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch();

  const handleContinue = () => {
    // Navigate to the next step in the trainer registration process
    updateUser(auth.currentUser?.uid, { 
        isTrainer: true,
        linkedTrainees: [], // Array of trainee IDs (applicable only for trainers)
        linkedTrainer: ''
    }).then(() => {
        dispatch(setUser({
            ...userInfo, isTrainer: true, linkedTrainees: [], linkedTrainer: ''
        } as UserDetails));
        console.log('User updated to be Trainer:', auth.currentUser?.uid);
        navigation.goBack();
    }
    ).catch((error) => {
        console.log('Error updating user:', error);
    });

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="#ffd20a" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Become a Trainer</Text>
      </View>

      <ScrollView style={styles.content}>
        <Ionicons name="fitness" size={80} color="#ffd20a" style={styles.icon} />
        
        <Text style={styles.title}>Join Our Trainer Community</Text>
        
        <Text style={styles.infoText}>
          Becoming a trainer on our platform opens up exciting opportunities to share your fitness expertise and inspire others. Here's what you can expect:
        </Text>

        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Create and share personalized workout plans</Text>
          <Text style={styles.bulletPoint}>• Engage with clients through in-app messaging</Text>
          <Text style={styles.bulletPoint}>• Showcase your expertise and build your client base</Text>
          <Text style={styles.bulletPoint}>• Set your own rates and schedule</Text>
          <Text style={styles.bulletPoint}>• Access tools to track client progress</Text>
          <Text style={styles.bulletPoint}>• Join a supportive community of fitness professionals</Text>
        </View>

        <Text style={styles.infoText}>
          To become a trainer, you'll need to complete a verification process that includes:
        </Text>

        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Providing proof of certifications</Text>
          <Text style={styles.bulletPoint}>• Passing a background check</Text>
          <Text style={styles.bulletPoint}>• Creating a detailed profile</Text>
          <Text style={styles.bulletPoint}>• Agreeing to our trainer terms and conditions</Text>
        </View>

        <Text style={styles.infoText}>
          Ready to take the next step in your fitness career? Click below to start your journey as a trainer!
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Registration</Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd20a',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 24,
  },
  bulletPoints: {
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    paddingLeft: 10,
  },
  continueButton: {
    backgroundColor: '#ffd20a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});