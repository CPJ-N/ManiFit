// SessionList.tsx
import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import SessionItem from '../components/SessionItem';

interface Session {
  sessionId: string;
  name: string;
  date: string;
  status: string;
}

const sampleSessions: Session[] = [
  {
    sessionId: '1',
    name: 'Morning Workout',
    date: '2024-07-21',
    status: 'Planned'
  },
  {
    sessionId: '2',
    name: 'Evening Cardio',
    date: '2024-07-22',
    status: 'Completed'
  },
  {
    sessionId: '3',
    name: 'Strength Training',
    date: '2024-07-23',
    status: 'Missed'
  }
];

const SessionsList: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={sampleSessions}
        keyExtractor={(item) => item.sessionId}
        renderItem={({ item }) => <SessionItem session={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
});

export default SessionsList;
