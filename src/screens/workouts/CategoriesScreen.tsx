import React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES } from '../../constants/navigation';
import {
  ExerciseCategory,
  exerciseCategories,
} from '../../constants/exerciseCatalog';

interface Props {
  navigation: any;
}

export default function CategoriesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const renderCategory: ListRenderItem<ExerciseCategory> = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.categoryCard}
      onPress={() => navigation.navigate(ROUTES.EXERCISES, { categoryId: item.id })}
    >
      <LinearGradient colors={['#272727', '#1F1F1F']} style={styles.categoryGradient}>
        <View style={styles.categoryIconWrap}>
          <LinearGradient colors={['#FFD20A', '#F59E0B']} style={styles.categoryIcon}>
            <Image source={item.image} style={styles.categoryImage} />
          </LinearGradient>
        </View>
        <View style={styles.categoryBody}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryDescription}>{item.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FFD20A" />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#171717', '#1E1E1E', '#242424']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 28 }]}>
        <Text style={styles.kicker}>ManiFit</Text>
        <Text style={styles.title}>Exercise Library</Text>
        <Text style={styles.subtitle}>
          Browse GitHub-backed exercises by body area. No coach setup, account, or payment
          flow required.
        </Text>
      </View>

      <FlatList
        data={exerciseCategories}
        keyExtractor={item => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.sourceCard}>
            <Ionicons name="logo-github" size={20} color="#FFD20A" />
            <Text style={styles.sourceText}>
              Exercise data loads from the free-exercise-db GitHub dataset, with a small
              bundled fallback for offline development.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  kicker: {
    color: '#FFD20A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#B8B8B8',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  sourceCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 210, 10, 0.08)',
    borderColor: 'rgba(255, 210, 10, 0.24)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    padding: 14,
  },
  sourceText: {
    color: '#D5D5D5',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  categoryCard: {
    marginBottom: 12,
  },
  categoryGradient: {
    alignItems: 'center',
    borderColor: '#333333',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 94,
    padding: 14,
  },
  categoryIconWrap: {
    marginRight: 14,
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  categoryImage: {
    height: 38,
    resizeMode: 'contain',
    width: 38,
  },
  categoryBody: {
    flex: 1,
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 5,
  },
  categoryDescription: {
    color: '#B8B8B8',
    fontSize: 14,
    lineHeight: 19,
  },
});
