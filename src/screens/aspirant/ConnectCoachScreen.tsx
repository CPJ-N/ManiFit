import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  navigation: any;
};

export default function ConnectCoachScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [inviteCode, setInviteCode] = useState('');

  const handleConnect = () => {
    Alert.alert(
      'Coach invite',
      'Backend invite validation is the next step. This screen is ready for the linkAspirantToCoach function.'
    );
  };

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

        <LinearGradient colors={['rgba(255, 210, 10, 0.16)', 'rgba(255, 210, 10, 0.04)']} style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="person-add" size={28} color="#1E1E1E" />
          </View>
          <Text style={styles.title}>Connect With a Coach</Text>
          <Text style={styles.subtitle}>
            Enter an invite code from a verified Coach to receive assigned routines.
          </Text>
        </LinearGradient>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Coach Invite Code</Text>
          <View style={styles.inputRow}>
            <Ionicons name="keypad" size={20} color="#FFD20A" />
            <TextInput
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              placeholder="MF-COACH-1234"
              placeholderTextColor="#666"
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleConnect}
            disabled={!inviteCode.trim()}
            style={[styles.connectButton, !inviteCode.trim() && styles.connectButtonDisabled]}
          >
            <LinearGradient
              colors={!inviteCode.trim() ? ['#555', '#444'] : ['#FFD20A', '#FFA500']}
              style={styles.connectGradient}
            >
              <Text style={styles.connectText}>Connect Coach</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={24} color="#FFD20A" />
            <Text style={styles.infoTitle}>Verified Coaches</Text>
            <Text style={styles.infoText}>Coach accounts unlock only after approval.</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="clipboard" size={24} color="#FFD20A" />
            <Text style={styles.infoTitle}>Assigned Routines</Text>
            <Text style={styles.infoText}>Connected Coaches can assign routines to your plan.</Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>How It Works</Text>
          {[
            'Get an invite code from your Coach.',
            'Enter the code here.',
            'Start receiving assigned routines in My Routines.',
          ].map((item, index) => (
            <View key={item} style={styles.timelineRow}>
              <View style={styles.timelineDot}>
                <Text style={styles.timelineDotText}>{index + 1}</Text>
              </View>
              <Text style={styles.timelineText}>{item}</Text>
            </View>
          ))}
        </View>

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
    marginBottom: 14,
  },
  hero: {
    borderRadius: 22,
    padding: 22,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.1)',
    marginBottom: 18,
  },
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFD20A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  inputCard: {
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.12)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: 14,
    paddingLeft: 10,
  },
  connectButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 14,
  },
  connectButtonDisabled: {
    opacity: 0.7,
  },
  connectGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  connectText: {
    color: '#1E1E1E',
    fontSize: 15,
    fontWeight: '900',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
  },
  infoText: {
    color: '#A7A7A7',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  timelineCard: {
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.08)',
  },
  timelineTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD20A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineDotText: {
    color: '#1E1E1E',
    fontSize: 12,
    fontWeight: '900',
  },
  timelineText: {
    flex: 1,
    color: '#D4D4D4',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
});
