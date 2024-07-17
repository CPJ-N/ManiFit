import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
  id: string;
  title: string;
  duration: number;
  kcal: number;
  count: number;
  imageUrl: string;
}

const data: Exercise[] = [
  {
    id: '1',
    title: 'Upper Body',
    duration: 60,
    kcal: 1320,
    count: 5,
    imageUrl: 'https://via.placeholder.com/150',
  },
  // Add more exercises here
];

export default function FavoriteScreen() {
  const renderItem = ({ item }: { item: Exercise }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{`${item.duration} Minutes · ${item.kcal} Kcal · ${item.count} Exercises`}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: 'gray',
  },
});