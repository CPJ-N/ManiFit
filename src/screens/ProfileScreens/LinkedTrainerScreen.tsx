import { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { assignTraineeToTrainer, getAllTrainers, unlinkTraineeFromTrainer } from '../../utils/controllers/linkingTrainer';
import { getUser, updateUser } from '../../utils/controllers/userController';
import { auth } from '../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { setUser } from '../../store/userSlice';


/* This screen will allow trainees to view their linked trainer 
  and provide options to unlink or request a change. */
export default function LinkedTrainerScreen({navigation}) {
  const [trainer, setTrainer] = useState(null);
  const [allTrainers, setAllTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const traineeUid = auth.currentUser?.uid;
  const dispatch = useDispatch()

    const fetchAllTrainer = async () => {
        const trainersToLink = await getAllTrainers();
        setAllTrainers(trainersToLink);
    }

    const fetchTrainer = async () => {
        const linkedTrainer = await getUser(userInfo.linkedTrainer);
        setTrainer(linkedTrainer);
    };

  useEffect(() => {
    userInfo.linkedTrainer ? fetchTrainer() : fetchAllTrainer();
  }, []);

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    // Handle further actions like linking the trainee to the selected trainer
  };

  const deleteTrainer = async () => {
        unlinkTraineeFromTrainer(traineeUid, userInfo?.linkedTrainer);
        alert('Unlinked from trainer.');
        setTrainer(null);
        allTrainers && fetchAllTrainer();
    }

  const confirmSelection = async (trainer) => {
    setSelectedTrainer(null);
    const newUserInfo = { ...userInfo, linkedTrainer: trainer.uid };
    dispatch(setUser(newUserInfo));
    await assignTraineeToTrainer(traineeUid, trainer.uid);
    setTrainer(trainer);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectTrainer(item)}>
      <Text style={styles.title}>{item.fullName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {trainer ? (
        <View style={styles.trainerInfo}>
          <Text style={styles.header}>Your Trainer</Text>
          <Text style={styles.trainerName}>{trainer?.fullName}</Text>
          {/* Optional: Add button to request a change */}
            <TouchableOpacity style={styles.button} onPress={() => deleteTrainer()}>
                <Text style={styles.buttonText}>Delete Trainer</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.subContainer}>
            <Text style={styles.noTrainerText}>No trainer linked.</Text>
            <Text style={styles.header}>Select a Trainer</Text>
            {selectedTrainer && (
                <View style={styles.selectedTrainer}>
                    <Text>Selected Trainer: {selectedTrainer.fullName}</Text>
                </View>
            )}
            <FlatList
                data={allTrainers}
                renderItem={renderItem}
                keyExtractor={item => item.uid}
            />
            <TouchableOpacity style={styles.button} onPress={() => confirmSelection(selectedTrainer)}>
                <Text style={styles.buttonText}>Confirm Trainer</Text>
            </TouchableOpacity>
        </View>
      )}
        
      {/* Optional: Add a list of all trainers for trainee to choose from */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  subContainer: {
    margin: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFD20A',
  },
  trainerInfo: {
    margin: 16,
    marginTop: 32,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  trainerName: {
    fontSize: 20,
    color: 'white',
  },
  noTrainerText: {
    fontSize: 18,
    color: 'red',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
  },
  selectedTrainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#d1e7dd',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#FFD20A',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
