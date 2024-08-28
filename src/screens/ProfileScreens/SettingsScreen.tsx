import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="#FFD20A" />
      </View>
      <Text style={styles.settingItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-down" size={24} color="#FFD20A" />
  </TouchableOpacity>
);

export default function SettingsScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFD20A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.content}>
        <SettingItem
          icon="notifications"
          title="Notification Setting"
          onPress={() => {/* Handle press */}}
        />
        <SettingItem
          icon="key"
          title="Password Setting"
          onPress={() => {/* Handle press */}}
        />
        <SettingItem
          icon="trash"
          title="Delete Account"
          onPress={() => {/* Handle press */}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD20A',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingItemText: {
    fontSize: 16,
    color: 'white',
  },
});
