import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../../store/reduxStore';
import { ROUTES } from '../../constants/navigation';

type Props = {
  navigation: any;
};

function MetricCard({
  icon,
  value,
  label,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  colors: [string, string];
}) {
  return (
    <LinearGradient colors={colors} style={styles.metricCard}>
      <Ionicons name={icon} size={22} color="#1E1E1E" />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </LinearGradient>
  );
}

export default function AspirantProgressScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const stats = userInfo?.stats;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#161616', '#1E1E1E', '#242424']} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={23} color="#FFD20A" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Aspirant</Text>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>A focused view of routine consistency and workout momentum.</Text>
        </View>

        <View style={styles.metricGrid}>
          <MetricCard icon="barbell" value={stats?.totalWorkouts ?? 0} label="Workouts" colors={['#FFD20A', '#FFA500']} />
          <MetricCard icon="flame" value={stats?.currentStreak ?? 0} label="Day Streak" colors={['#FF6B6B', '#E53E3E']} />
          <MetricCard icon="time" value={stats?.totalWorkoutTime ?? 0} label="Minutes" colors={['#4CAF50', '#2E7D32']} />
          <MetricCard icon="trophy" value={stats?.longestStreak ?? 0} label="Best Streak" colors={['#6366F1', '#4F46E5']} />
        </View>

        <LinearGradient colors={['#2A2A2A', '#202020']} style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <Ionicons name="calendar" size={22} color="#FFD20A" />
            <Text style={styles.focusTitle}>This Week</Text>
          </View>
          <View style={styles.weekRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={`${day}-${index}`} style={styles.dayItem}>
                <View style={[styles.dayDot, index < 2 && styles.dayDotActive]} />
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.focusText}>
            Workout history persistence will fill this chart as routines are completed.
          </Text>
        </LinearGradient>

        <LinearGradient colors={['rgba(255, 210, 10, 0.12)', 'rgba(255, 210, 10, 0.04)']} style={styles.nextCard}>
          <Text style={styles.nextTitle}>Next Best Action</Text>
          <Text style={styles.nextText}>Start with today’s assigned routine or generate a fresh plan with AI Coach.</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.primaryAction}
              onPress={() => navigation.navigate(ROUTES.ASPIRANT_ROUTINES, { filter: 'today' })}
            >
              <Text style={styles.primaryActionText}>Today's Routine</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.secondaryAction}
              onPress={() => navigation.navigate(ROUTES.AI_COACH)}
            >
              <Text style={styles.secondaryActionText}>AI Coach</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  content: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: {
    marginBottom: 18,
  },
  eyebrow: {
    color: '#FFD20A',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 2,
  },
  subtitle: {
    color: '#A7A7A7',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  metricCard: {
    width: '48.5%',
    borderRadius: 18,
    padding: 17,
  },
  metricValue: {
    color: '#1E1E1E',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 10,
  },
  metricLabel: {
    color: '#1E1E1E',
    fontSize: 13,
    fontWeight: '800',
    opacity: 0.82,
  },
  focusCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  focusTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginLeft: 9,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 7,
  },
  dayDotActive: {
    backgroundColor: '#FFD20A',
    borderColor: '#FFD20A',
  },
  dayText: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: '800',
  },
  focusText: {
    color: '#A7A7A7',
    fontSize: 13,
    lineHeight: 20,
  },
  nextCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.1)',
  },
  nextTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  nextText: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: '#FFD20A',
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#1E1E1E',
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD20A',
  },
  secondaryActionText: {
    color: '#FFD20A',
    fontSize: 13,
    fontWeight: '900',
  },
});
