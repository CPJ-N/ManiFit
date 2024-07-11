import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseList from '../../components/ExcerciseList';

interface RecommendationProps {
  title: string;
  duration: string;
  kcal: string;
}

export default function Home () {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, Madison</Text>
          <View style={styles.icons}>
            <Icon name="search" type="feather" color="#fff" size={25} />
            <Icon name="bell" type="feather" color="#fff" size={25} style={{ marginLeft: 20 }} />
            <Icon name="plus" type="feather" color="#fff" size={25} style={{ marginLeft: 20 }} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            <RecommendationCard title="Squat Exercise" duration="12 Minutes" kcal="120 Kcal" />
            <RecommendationCard title="Full Body Stretching" duration="12 Minutes" kcal="120 Kcal" />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Challenge</Text>
          <ChallengeCard />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles & Tips</Text>
          <TipsCard />
        </View>
    
        <ExerciseList />
        
      </ScrollView>
    </SafeAreaView>
  );
};

const RecommendationCard: React.FC<RecommendationProps> = ({ title, duration, kcal }) => (
    <View style={styles.recommendationCard}>
        <Image source={require('../../assets/images/slide5.png')} style={styles.recommendationImage} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubTitle}>{duration} | {kcal}</Text>
    </View>
);

const ChallengeCard: React.FC = () => (
  <View style={styles.challengeCard}>
    <Text style={styles.challengeText}>Plank With Hip Twist</Text>
  </View>
);

const TipsCard: React.FC = () => (
  <View style={styles.tipsCard}>
    <Text style={styles.tipsText}>15 Quick & Effective Daily Routines</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  recommendationCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  recommendationImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardSubTitle: {
    color: '#aaa',
  },
  challengeCard: {
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 10,
  },
  challengeText: {
    color: '#fff',
    fontSize: 16,
  },
  tipsCard: {
    backgroundColor: '#555',
    padding: 20,
    borderRadius: 10,
  },
  tipsText: {
    color: '#fff',
    fontSize: 16,
  },
});
