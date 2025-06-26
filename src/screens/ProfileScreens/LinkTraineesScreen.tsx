import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { getAllUnlinkedTrainees } from '../../utils/controllers/linkingTrainerTrainee';
import { linkClientToTrainer } from '../../utils/controllers/clientController';
import { auth } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';

// Types
interface UnlinkedTrainee {
  uid: string;
  fullName: string;
  email: string;
  profilePhotoName?: string;
}

interface NavigationProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

/* This screen will show the trainer a list of available trainees 
  who are not yet linked to any trainer, with the ability to select and link them.*/
export default function LinkTraineesScreen({ navigation }: NavigationProps) {
  const [trainees, setTrainees] = useState<UnlinkedTrainee[]>([]);
  const [loading, setLoading] = useState(true);
  const trainerUid = auth.currentUser?.uid; 

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const unlinkedTrainees = await getAllUnlinkedTrainees();
        console.log('Unlinked trainees:', unlinkedTrainees);
        setTrainees(unlinkedTrainees as UnlinkedTrainee[]);
      } catch (error) {
        console.error('Error fetching unlinked trainees:', error);
        Alert.alert('Error', 'Failed to load available trainees. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainees();
  }, []);

  const linkTrainee = async (traineeUid: string) => {
    if (!trainerUid) {
      Alert.alert('Error', 'Unable to identify trainer. Please try again.');
      return;
    }

    try {
      await linkClientToTrainer(traineeUid, trainerUid);
      Alert.alert('Success', 'Trainee linked successfully!');
      
      // Remove linked trainee from the list
      setTrainees(trainees.filter(t => t.uid !== traineeUid));
    } catch (error) {
      console.error('Error linking trainee:', error);
      Alert.alert('Error', 'Failed to link trainee. Please try again.');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color="#666" />
      <Text style={styles.emptyTitle}>No Available Trainees</Text>
      <Text style={styles.emptyDescription}>
        All trainees are currently linked to trainers. Check back later for new signups.
      </Text>
    </View>
  );

  const renderTraineeItem = ({ item }: { item: UnlinkedTrainee }) => (
    <View style={styles.traineeItem}>
      <View style={styles.traineeInfo}>
        <Text style={styles.traineeName}>{item.fullName}</Text>
        <Text style={styles.traineeEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => linkTrainee(item.uid)}
        activeOpacity={0.8}
      >
        <Text style={styles.linkButtonText}>Link</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#ffd20a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Client</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading available trainees...</Text>
        </View>
      ) : trainees.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {trainees.length} trainee{trainees.length !== 1 ? 's' : ''} available to link
            </Text>
          </View>
          <FlatList
            data={trainees}
            keyExtractor={(item) => item.uid}
            renderItem={renderTraineeItem}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd20a',
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  traineeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  traineeInfo: {
    flex: 1,
  },
  traineeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  traineeEmail: {
    fontSize: 14,
    color: '#888',
  },
  linkButton: {
    backgroundColor: '#FFD20A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkButtonText: {
    color: '#1E1E1E',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
});
