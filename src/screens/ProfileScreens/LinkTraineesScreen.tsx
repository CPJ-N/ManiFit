import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { assignTraineeToTrainer, getAllUnlinkedTrainees } from '../../utils/controllers/linkingTrainer';
import { auth } from '../../config/firebase';

/* This screen will show the trainer a list of available trainees 
  who are not yet linked to any trainer, with the ability to select and link them.*/
export default function LinkTraineesScreen({navigation}) {
  const [trainees, setTrainees] = useState([]);
  const trainerUid = auth.currentUser?.uid; 

  useEffect(() => {
    const fetchTrainees = async () => {
      const unlinkedTrainees = await getAllUnlinkedTrainees();
      console.log(unlinkedTrainees);
      setTrainees(unlinkedTrainees);
    };
    fetchTrainees();
  }, []);

  const linkTrainee = async (traineeUid: string) => {
    await assignTraineeToTrainer(traineeUid, trainerUid);
    alert(`Trainee linked successfully!`);
    // Optionally remove linked trainee from the list
    setTrainees(trainees.filter(t => t.uid !== traineeUid));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Get New Trainees</Text>
      <FlatList
        data={trainees}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.traineeItem}>
            <Text style={styles.trainerName}>{item.fullName}</Text>
            <Button title="Link" onPress={() => linkTrainee(item.uid)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#FFD20A',
  },
  trainerName: {
    fontSize: 18,
    color: 'white',
  },
  traineeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});
