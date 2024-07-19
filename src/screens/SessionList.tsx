// SessionList.tsx
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import SessionItem from '../components/SessionItem';
import { Icon } from 'react-native-elements';
import { SESSION_FORM } from '../constants/screenNames';

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

export default function SessionsList ({navigation}) {

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (text: string) => {
        setSearchTerm(text);
        // Add functionality to filter exercises based on search term
    };
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TextInput
                placeholder="Search exercises..."
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={handleSearch}
            />
          <View style={styles.icons}>
            <Icon name="plus" type="feather" color="#000" size={25} onPress={() => navigation.navigate(SESSION_FORM)}/>
          </View>
        </View>
      <FlatList
        data={sampleSessions}
        keyExtractor={(item) => item.sessionId}
        renderItem={({ item }) => <SessionItem session={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
},
icons: {
    flexDirection: 'row',
    marginLeft: 10,
}
});

