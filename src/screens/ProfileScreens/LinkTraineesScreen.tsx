import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { assignTraineeToTrainer, getAllUnlinkedTrainees } from '../../utils/controllers/linkingTrainer';

export default function LinkTraineesScreen({navigation}) {
  const [trainees, setTrainees] = useState([]);
  const trainerUid = 'trainer-uid'; // Replace with actual trainer UID

  useEffect(() => {
    const fetchTrainees = async () => {
      const unlinkedTrainees = await getAllUnlinkedTrainees();
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
      <Text style={styles.header}>Link Trainees to Trainer</Text>
      <FlatList
        data={trainees}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.traineeItem}>
            <Text>{item.fullName}</Text>
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
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  traineeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
