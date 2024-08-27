import { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';
import { unlinkTraineeFromTrainer } from '../../utils/controllers/linkingTrainer';
import { getUser } from '../../utils/controllers/userController';
import { auth } from '../../config/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';


/* This screen will allow trainees to view their linked trainer 
  and provide options to unlink or request a change. */
export default function LinkedTrainerScreen({navigation}) {
  const [trainer, setTrainer] = useState(null);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const traineeUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchTrainer = async () => {
      // const linkedTrainer = await getUser(traineeUid);
      const linkedTrainer = await getUser(userInfo.linkedTrainer);
      setTrainer(linkedTrainer);
    };
    fetchTrainer();
  }, []);

  const unlinkTrainer = async () => {
    await unlinkTraineeFromTrainer(traineeUid, trainer?.uid);
    alert('Unlinked from trainer.');
    setTrainer(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {trainer ? (
        <View style={styles.trainerInfo}>
          <Text style={styles.header}>Your Trainer</Text>
          <Text>{trainer.fullName}</Text>
          <Button title="Unlink Trainer" onPress={unlinkTrainer} />
          {/* Optional: Add button to request a change */}
        </View>
      ) : (
        <Text style={styles.noTrainerText}>No trainer linked.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  trainerInfo: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  noTrainerText: {
    fontSize: 18,
    color: 'red',
  },
});
