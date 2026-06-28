import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../../store/reduxStore';
import { ROUTES } from '../../constants/navigation';
import { getRoutinesByTrainee } from '../../utils/controllers/routineController';
import {
  formatRoutineDate,
  formatRoutineStatus,
  getRoutineAssignedDate,
  getRoutineDifficulty,
  getRoutineDuration,
  getRoutineExerciseCount,
  getRoutineSourceLabel,
  getRoutineStatus,
  getRoutineStatusColor,
} from '../../utils/routineDisplay';

type Props = {
  navigation: any;
  route?: {
    params?: {
      filter?: 'today' | 'all';
    };
  };
};

const FILTERS = ['all', 'today'] as const;

function isToday(date?: string) {
  if (!date) return false;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  return parsed.toDateString() === now.toDateString();
}

function RoutineCard({ routine, userId, onPress }: { routine: any; userId?: string; onPress: () => void }) {
  const status = getRoutineStatus(routine, userId);
  const statusColor = getRoutineStatusColor(status);

  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={styles.cardPressable}>
      <LinearGradient colors={['#2A2A2A', '#202020']} style={styles.routineCard}>
        <View style={styles.cardHeader}>
          <View style={styles.sourceBadge}>
            <Ionicons
              name={routine?.source === 'ai_coach' ? 'hardware-chip' : 'person'}
              size={13}
              color="#1E1E1E"
            />
            <Text style={styles.sourceBadgeText}>{getRoutineSourceLabel(routine)}</Text>
          </View>
          <View style={[styles.statusPill, { borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{formatRoutineStatus(status)}</Text>
          </View>
        </View>

        <Text style={styles.routineTitle}>{routine?.name || 'Untitled Routine'}</Text>
        <Text style={styles.routineDescription} numberOfLines={2}>
          {routine?.description || 'A structured workout routine ready for your next session.'}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="barbell" size={14} color="#FFD20A" />
            <Text style={styles.metaText}>{getRoutineExerciseCount(routine)} exercises</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color="#FFD20A" />
            <Text style={styles.metaText}>{getRoutineDuration(routine)} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer" size={14} color="#FFD20A" />
            <Text style={styles.metaText}>{getRoutineDifficulty(routine)}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.assignedText}>
            {formatRoutineDate(getRoutineAssignedDate(routine, userId))}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#FFD20A" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function AspirantRoutinesScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'today' | 'all'>(route?.params?.filter ?? 'all');

  const loadRoutines = async (refresh = false) => {
    if (!userInfo?.uid) {
      setLoading(false);
      return;
    }

    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError('');
      const data = await getRoutinesByTrainee(userInfo.uid);
      setRoutines(data);
    } catch (loadError) {
      console.error('Failed to load aspirant routines:', loadError);
      setError('Unable to load routines right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRoutines();
  }, [userInfo?.uid]);

  const visibleRoutines = useMemo(() => {
    if (filter === 'today') {
      return routines.filter(routine => isToday(getRoutineAssignedDate(routine, userInfo?.uid)));
    }
    return routines;
  }, [filter, routines, userInfo?.uid]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#171717', '#1E1E1E', '#242424']} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
        refreshControl={
          <RefreshControl
            tintColor="#FFD20A"
            refreshing={refreshing}
            onRefresh={() => loadRoutines(true)}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={23} color="#FFD20A" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Aspirant</Text>
            <Text style={styles.title}>My Routines</Text>
            <Text style={styles.subtitle}>Coach-assigned and AI-generated plans live here.</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map(item => {
            const selected = filter === item;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                onPress={() => setFilter(item)}
                style={[styles.filterButton, selected && styles.filterButtonActive]}
              >
                <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                  {item === 'today' ? "Today's" : 'All'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summaryRow}>
          <LinearGradient colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.05)']} style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{routines.length}</Text>
            <Text style={styles.summaryLabel}>Assigned</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(76, 175, 80, 0.14)', 'rgba(76, 175, 80, 0.05)']} style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {routines.filter(routine => getRoutineStatus(routine, userInfo?.uid) === 'completed').length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(99, 102, 241, 0.14)', 'rgba(99, 102, 241, 0.05)']} style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {routines.filter(routine => isToday(getRoutineAssignedDate(routine, userInfo?.uid))).length}
            </Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </LinearGradient>
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color="#FFD20A" />
            <Text style={styles.stateTitle}>Loading routines</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Ionicons name="alert-circle" size={36} color="#FF6B6B" />
            <Text style={styles.stateTitle}>{error}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => loadRoutines()}>
              <Text style={styles.primaryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : visibleRoutines.length > 0 ? (
          <View style={styles.list}>
            {visibleRoutines.map(routine => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                userId={userInfo?.uid}
                onPress={() => navigation.navigate(ROUTES.ASPIRANT_ROUTINE_DETAIL, { routine })}
              />
            ))}
          </View>
        ) : (
          <LinearGradient colors={['#2A2A2A', '#202020']} style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="clipboard-outline" size={34} color="#FFD20A" />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'today' ? 'No routine for today' : 'No routines yet'}
            </Text>
            <Text style={styles.emptyText}>
              Connect with a Coach or generate your first plan with AI Coach.
            </Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate(ROUTES.AI_COACH)}
              >
                <Text style={styles.primaryButtonText}>Use AI Coach</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate(ROUTES.CONNECT_COACH)}
              >
                <Text style={styles.secondaryButtonText}>Connect Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: '#FFD20A',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    color: '#A7A7A7',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#FFD20A',
  },
  filterText: {
    color: '#A7A7A7',
    fontSize: 14,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#1E1E1E',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  summaryNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#A7A7A7',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  list: {
    gap: 14,
  },
  cardPressable: {
    borderRadius: 18,
  },
  routineCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.09)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD20A',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  sourceBadgeText: {
    color: '#1E1E1E',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 5,
  },
  statusPill: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  routineTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  routineDescription: {
    color: '#A7A7A7',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metaText: {
    color: '#DADADA',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  assignedText: {
    color: '#A7A7A7',
    fontSize: 13,
    fontWeight: '700',
  },
  stateCard: {
    minHeight: 220,
    borderRadius: 18,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },
  emptyCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.09)',
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: '#A7A7A7',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  emptyActions: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#FFD20A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1E1E1E',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD20A',
  },
  secondaryButtonText: {
    color: '#FFD20A',
    fontSize: 15,
    fontWeight: '800',
  },
});
