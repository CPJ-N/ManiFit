import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getExerciseImageUrl,
  getExercisesByCategoryId,
  normalizeExerciseInstructions,
} from '../../utils/controllers/exerciseController';
import { getExerciseCategoryById } from '../../constants/exerciseCatalog';

interface Props {
  navigation: any;
  route: {
    params: {
      categoryId: string;
    };
  };
}

const fallbackExerciseImage = require('../../assets/images/cardio.png');

const asList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
};

const formatList = (value: unknown, fallback = 'Not specified'): string => {
  const values = asList(value);
  return values.length > 0 ? values.join(', ') : fallback;
};

const exerciseMatchesQuery = (exercise: any, query: string): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [
    exercise.name,
    exercise.category,
    exercise.bodyPart,
    exercise.target,
    exercise.level,
    exercise.difficulty,
    exercise.equipment,
    exercise.primaryMuscles,
    exercise.secondaryMuscles,
  ]
    .flatMap(asList)
    .some(value => value.toLowerCase().includes(normalizedQuery));
};

export default function ExercisesScreen({ navigation, route }: Props) {
  const { categoryId } = route.params;
  const category = getExerciseCategoryById(categoryId);
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadExercises = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await getExercisesByCategoryId(categoryId);
        if (isMounted) {
          setExercises(data);
        }
      } catch (error) {
        console.error('Error loading exercises:', error);
        if (isMounted) {
          setErrorMessage('Unable to load exercises right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadExercises();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const filteredExercises = useMemo(
    () => exercises.filter(exercise => exerciseMatchesQuery(exercise, searchQuery)),
    [exercises, searchQuery]
  );

  const renderExercise: ListRenderItem<any> = ({ item }) => {
    const imageUrl = getExerciseImageUrl(item);
    const instructions = normalizeExerciseInstructions(item.instructions);
    const isExpanded = expandedExerciseId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.84}
        style={styles.exerciseCard}
        onPress={() => setExpandedExerciseId(isExpanded ? null : item.id)}
      >
        <LinearGradient colors={['#272727', '#1F1F1F']} style={styles.exerciseGradient}>
          <View style={styles.exerciseTopRow}>
            <Image
              source={imageUrl ? { uri: imageUrl } : fallbackExerciseImage}
              defaultSource={fallbackExerciseImage}
              style={styles.exerciseImage}
            />

            <View style={styles.exerciseSummary}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaPill}>
                  <Ionicons name="fitness" size={12} color="#FFD20A" />
                  <Text style={styles.metaText}>
                    {formatList(item.primaryMuscles, item.target ?? 'General')}
                  </Text>
                </View>
              </View>
              <Text style={styles.exerciseDetail}>
                {formatList(item.equipment, 'Bodyweight')} | {item.level ?? item.difficulty ?? 'All levels'}
              </Text>
            </View>

            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#FFD20A"
            />
          </View>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <View style={styles.detailGrid}>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailLabel}>Secondary</Text>
                  <Text style={styles.detailValue}>{formatList(item.secondaryMuscles)}</Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{item.category ?? 'Exercise'}</Text>
                </View>
              </View>

              {instructions.length > 0 ? (
                <View style={styles.instructionsBlock}>
                  <Text style={styles.instructionsTitle}>Instructions</Text>
                  {instructions.map((instruction, index) => (
                    <Text key={`${item.id}-instruction-${index}`} style={styles.instruction}>
                      {index + 1}. {instruction}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.noInstructions}>No instructions are available for this exercise.</Text>
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#171717', '#1E1E1E', '#242424']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 18 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#FFD20A" />
        </TouchableOpacity>

        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>{category?.name ?? 'Exercises'}</Text>
          <Text style={styles.title}>{category?.name ?? categoryId} Exercises</Text>
          <Text style={styles.subtitle}>
            {category?.description ?? 'Browse exercises from the GitHub dataset.'}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={19} color="#777777" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search exercises"
            placeholderTextColor="#777777"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={19} color="#777777" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#FFD20A" />
          <Text style={styles.centerStateText}>Loading GitHub exercises...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item, index) => item.id ?? `${categoryId}-${index}`}
          renderItem={renderExercise}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.countRow}>
              <Text style={styles.countText}>
                {filteredExercises.length} of {exercises.length} exercises
              </Text>
              <Text style={styles.countHint}>Tap an exercise for instructions.</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={34} color="#777777" />
              <Text style={styles.emptyTitle}>No exercises found</Text>
              <Text style={styles.emptyText}>
                {errorMessage || 'Try a different search term for this category.'}
              </Text>
            </View>
          }
        />
      )}
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
    paddingBottom: 16,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    marginBottom: 16,
    width: 38,
  },
  headerCopy: {
    marginBottom: 16,
  },
  kicker: {
    color: '#FFD20A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#B8B8B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#2B2B2B',
    borderColor: '#3A3A3A',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 13,
  },
  searchInput: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: 10,
  },
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  centerStateText: {
    color: '#B8B8B8',
    fontSize: 15,
    marginTop: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  countHint: {
    color: '#9A9A9A',
    fontSize: 13,
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseGradient: {
    borderColor: '#333333',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  exerciseTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  exerciseImage: {
    backgroundColor: '#333333',
    borderRadius: 8,
    height: 74,
    marginRight: 14,
    resizeMode: 'cover',
    width: 74,
  },
  exerciseSummary: {
    flex: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metaPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    borderRadius: 999,
    flexDirection: 'row',
    maxWidth: '100%',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  metaText: {
    color: '#FFD20A',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  exerciseDetail: {
    color: '#B8B8B8',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  expandedContent: {
    borderTopColor: '#363636',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  detailBlock: {
    backgroundColor: '#242424',
    borderRadius: 8,
    flex: 1,
    padding: 10,
  },
  detailLabel: {
    color: '#8E8E8E',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  instructionsBlock: {
    backgroundColor: '#242424',
    borderRadius: 8,
    padding: 12,
  },
  instructionsTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 9,
  },
  instruction: {
    color: '#D2D2D2',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 7,
  },
  noInstructions: {
    color: '#B8B8B8',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#242424',
    borderColor: '#333333',
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#B8B8B8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
});
