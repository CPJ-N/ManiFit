import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteUser } from 'firebase/auth';
import { RootState } from '../../store/reduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../config/firebase';
import { deleteUserDocument } from '../../utils/controllers/userController';
import { AUTH_TABS, LOGIN } from '../../constants/screenNames';
import { clearUser, clearUserImageUrl } from '../../store/userSlice';

export default function DeleteAccountScreen ({navigation} : {navigation: any}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setTimeout( async () => {
      setIsDeleting(false);
      await deleteUserDocument(auth.currentUser?.uid || '')
        .then(() => {
          
        })
        .catch( e => console.log(e))

      auth.currentUser && await deleteUser(auth.currentUser)
        .then(() => {
            console.log(`Successfully deleted user with id:${userInfo?.uid} & email:${userInfo?.email}`);
            dispatch(clearUser());
            dispatch(clearUserImageUrl());
            navigation.navigate(AUTH_TABS, {LOGIN});
        })
        .catch((error) => {
            console.error('Error deleting user auth:', error);
        });

      Alert.alert(
        "Account Deleted",
        "Your account has been successfully deleted. We're sorry to see you go!",
        [{ text: "OK", onPress: () => console.log("OK Pressed")}]
      );
    }, 2000);
    
    navigation.navigate(AUTH_TABS, {LOGIN});
  };

  const confirmDeletion = () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: handleDeleteAccount, style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="#ffd20a" onPress={()=>navigation.goBack()}/>
        <Text style={styles.headerTitle}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="warning-outline" size={64} color="#ff4757" style={styles.warningIcon} />
        
        <Text style={styles.warningText}>
          Warning: Deleting your account is permanent
        </Text>

        <Text style={styles.infoText}>
          If you delete your account:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>• All your fitness data will be permanently erased</Text>
          <Text style={styles.listItem}>• You'll lose access to your workout history and progress</Text>
          <Text style={styles.listItem}>• Your profile and achievements will be removed</Text>
          <Text style={styles.listItem}>• This action cannot be undone</Text>
        </View>

        <Text style={styles.infoText}>
          Are you sure you want to proceed?
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={confirmDeletion}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd20a',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: 16,
  },
  warningText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4757',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  listItem: {
    color: '#ffffff',
    marginBottom: 8,
    paddingLeft: 16,
  },
  deleteButton: {
    backgroundColor: '#ffd20a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
