import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DELETE_ACCOUNT, LINK_TRAINEE, LINK_TRAINER, PASSWORD_SETTINGS, RAZORPAY_CHECKOUT, REGISTER_TRAINER } from '../../constants/screenNames';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reduxStore';
import { updateUser } from '../../utils/controllers/userController';

interface SettingItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={24} color="#FFD20A" />
      </View>
      <Text style={styles.settingItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#FFD20A" />
  </TouchableOpacity>
);

export default function SettingsScreen({navigation} :{navigation: any}) {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    useEffect(() => {
        console.log(userInfo);
    }, [userInfo])

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
          onPress={() => {navigation.navigate(PASSWORD_SETTINGS)}}
        />
        <SettingItem
          icon="trash"
          title="Delete Account"
          onPress={() => {navigation.navigate(DELETE_ACCOUNT)}}
        />
        {userInfo?.isTrainer === true? (
            <SettingItem
              icon="person-add"
              title="Link Trainee"
              onPress={() => {navigation.navigate(LINK_TRAINEE)}}
            />
            ) : (
            <SettingItem
              icon="person-add"
              title="Link Trainer"
              onPress={() => {navigation.navigate(LINK_TRAINER)}}
            />
        )}
        {userInfo?.isTrainer === false && ( 
          <SettingItem
            icon="barbell"
            title="Register as Trainer"
            onPress={() => {navigation.navigate(REGISTER_TRAINER)}}
            />
        )}
        <SettingItem
          icon="card"
          title="Billing"
          onPress={() => {navigation.navigate(RAZORPAY_CHECKOUT)}}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingItemText: {
    fontSize: 16,
    color: 'white',
  },
});
