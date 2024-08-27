import { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';
import { unlinkTraineeFromTrainer } from '../../utils/controllers/linkingTrainer';
import { getUser } from '../../utils/controllers/userController';
  // Assume you have a function to get and unlink trainer

export default function LinkedTrainerScreen({navigation}) {
  const [trainer, setTrainer] = useState(null);
  const traineeUid = 'trainee-uid'; // Replace with actual trainee UID

  useEffect(() => {
    const fetchTrainer = async () => {
      const linkedTrainer = await getUser(traineeUid);
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
