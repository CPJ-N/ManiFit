// SessionItem.tsx
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SessionItemProps {
  session: {
    sessionId: string;
    name: string;
    date: string;
    status: string;
  };
}

const SessionItem: React.FC<SessionItemProps> = ({ session }) => {
  return (
    <TouchableOpacity style={styles.sessionItem}>
      <Text style={styles.sessionName}>{session.name}</Text>
      <Text style={styles.sessionDate}>{session.date}</Text>
      <Text style={styles.sessionStatus}>{session.status}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sessionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sessionName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionDate: {
    fontSize: 16,
  },
  sessionStatus: {
    fontSize: 16,
    color: 'green',
  },
});

export default SessionItem;
