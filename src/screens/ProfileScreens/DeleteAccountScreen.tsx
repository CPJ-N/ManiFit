import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, TextInput, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { RootState } from '../../store/reduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../config/firebase';
import { deleteUserDocument } from '../../utils/controllers/userController';
import { AUTH_TABS, REGISTER } from '../../constants/screenNames';
import { clearUser, clearUserImageUrl } from '../../store/userSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';

const { width } = Dimensions.get('window');

export default function DeleteAccountScreen ({navigation} : {navigation: any}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const reauthenticateUser = async (password: string) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error('Re-authentication failed:', error);
      Alert.alert(
        "Authentication Failed",
        "The password you entered is incorrect. Please try again.",
        [{ text: "OK" }]
      );
      return false;
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // Delete user document from Firestore first
      await deleteUserDocument(auth.currentUser?.uid || '');
      console.log('User document deleted from Firestore');

      // Delete the Firebase Auth user
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        console.log(`Successfully deleted user with id:${userInfo?.uid} & email:${userInfo?.email}`);
        
        // Clear Redux state
        dispatch(clearUser());
        dispatch(clearUserImageUrl());
        
        // Show success message
        Alert.alert(
          "Account Deleted",
          "Your account has been successfully deleted. We're sorry to see you go!",
          [{ 
            text: "OK", 
            onPress: () => {
              // Navigate to AUTH_TABS and then to REGISTER screen
              navigation.navigate(AUTH_TABS, { screen: REGISTER });
            }
          }]
        );
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          "Re-authentication Required",
          "For security reasons, please enter your password to confirm account deletion.",
          [{ text: "OK" }]
        );
        setShowPasswordModal(true);
      } else {
        Alert.alert(
          "Error",
          "Failed to delete account. Please try again later.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setIsDeleting(false);
      setShowPasswordModal(false);
      setPassword('');
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    const reauthSuccess = await reauthenticateUser(password);
    if (reauthSuccess) {
      setShowPasswordModal(false);
      setPassword('');
      // Retry deletion after successful re-authentication
      handleDeleteAccount();
    }
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
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header Section */}
      <LinearGradient
        colors={['rgba(255, 210, 10, 0.1)', 'transparent']}
        style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
      >
        <Box className="px-6 py-4">
          <HStack className="items-center">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD20A" />
            </TouchableOpacity>
            <VStack className="flex-1">
              <Heading 
                size="xl" 
                className="font-bold" 
                style={styles.headerTitle}
              >
                Delete Account
              </Heading>
              <Text style={styles.headerSubtitle}>
                Permanent account deletion
              </Text>
            </VStack>
          </HStack>
        </Box>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning Section */}
        <Box className="px-6 py-6">
          <Card style={styles.warningCard}>
            <View style={styles.warningCardContent}>
              {/* Warning Icon */}
              <View style={styles.warningIconContainer}>
                <View style={styles.warningIconBackground}>
                  <Ionicons name="warning" size={28} color="#FF6B6B" />
                </View>
              </View>

              {/* Warning Title */}
              <Heading size="lg" className="font-bold text-center mb-4" style={styles.warningTitle}>
                This action cannot be undone
              </Heading>

              {/* Warning Description */}
              <Text style={styles.warningDescription}>
                When you delete your account, all of your data will be permanently removed:
              </Text>

              {/* Warning List */}
              <VStack space="sm" className="my-6">
                {[
                  'All fitness data and workout history',
                  'Profile information and achievements',
                  'Progress tracking and statistics',
                  'Linked trainer connections',
                  'App preferences and settings'
                ].map((item, index) => (
                  <HStack key={index} className="items-center" style={styles.listItem}>
                    <View style={styles.listIconContainer}>
                      <Ionicons name="ellipse" size={6} color="#B0B0B0" />
                    </View>
                    <Text style={styles.listItemText}>
                      {item}
                    </Text>
                  </HStack>
                ))}
              </VStack>

              {/* Alternative Actions */}
              <Card style={styles.alternativeCard}>
                <VStack space="sm" className="p-4">
                  <HStack className="items-center mb-2">
                    <View style={styles.alternativeIconContainer}>
                      <Ionicons name="information-circle" size={18} color="#FFD20A" />
                    </View>
                    <Text style={styles.alternativeTitle}>
                      Before you proceed
                    </Text>
                  </HStack>
                  <Text style={styles.alternativeDescription}>
                    Consider backing up your data or contacting support if you're having issues with the app instead of deleting your account.
                  </Text>
                </VStack>
              </Card>
            </View>
          </Card>
        </Box>

        {/* Delete Button */}
        <Box className="px-6 py-4">
          <TouchableOpacity
            style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
            onPress={confirmDeletion}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isDeleting ? ['#666', '#444'] : ['#FF6B6B', '#E53E3E']}
              style={styles.deleteButtonGradient}
            >
              <Ionicons 
                name={isDeleting ? "hourglass" : "trash"} 
                size={20} 
                color="#FFFFFF" 
                style={{ marginRight: 8 }} 
              />
              <Text style={styles.deleteButtonText}>
                {isDeleting ? "Deleting Account..." : "Delete My Account"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Box>
      </ScrollView>

      {/* Password Modal */}
      {showPasswordModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Card style={styles.modalCard}>
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <VStack className="items-center mb-6">
                  <View style={styles.modalIconContainer}>
                    <View style={styles.modalIconBackground}>
                      <Ionicons name="key" size={24} color="#FFD20A" />
                    </View>
                  </View>
                  <Heading size="lg" className="font-bold text-center" style={styles.modalTitle}>
                    Confirm Your Password
                  </Heading>
                  <Text style={styles.modalSubtitle}>
                    Please enter your password to confirm account deletion
                  </Text>
                </VStack>

                {/* Password Input */}
                <VStack space="md" className="mb-6">
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={18} color="#FFD20A" style={styles.inputIcon} />
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#666"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      autoFocus
                    />
                  </View>
                </VStack>

                {/* Modal Buttons */}
                <HStack space="md">
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                      setIsDeleting(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalConfirmButton, { flex: 1 }]}
                    onPress={handlePasswordSubmit}
                    disabled={isDeleting}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isDeleting ? ['#666', '#444'] : ['#FF6B6B', '#E53E3E']}
                      style={styles.modalConfirmButtonGradient}
                    >
                      <Text style={styles.modalConfirmButtonText}>
                        {isDeleting ? "Confirming..." : "Confirm"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </HStack>
              </View>
            </Card>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  headerGradient: {
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    color: '#FF6B6B',
    fontSize: 24,
  },
  headerSubtitle: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 2,
  },
  scrollView: {
    backgroundColor: '#1E1E1E',
  },
  scrollContent: {
    backgroundColor: '#1E1E1E',
    flexGrow: 1,
  },
  warningCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 0,
  },
  warningCardContent: {
    padding: 24,
  },
  warningIconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  warningIconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  warningTitle: {
    color: '#FF6B6B',
    fontSize: 18,
  },
  warningDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  listItem: {
    paddingHorizontal: 4,
  },
  listIconContainer: {
    marginRight: 12,
    width: 16,
    alignItems: 'center',
  },
  listItemText: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 20,
  },
  alternativeCard: {
    backgroundColor: 'rgba(255, 210, 10, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.1)',
    padding: 0,
  },
  alternativeIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  alternativeTitle: {
    color: '#FFD20A',
    fontSize: 14,
    fontWeight: '600',
  },
  alternativeDescription: {
    color: '#B0B0B0',
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  deleteButtonDisabled: {
    opacity: 0.7,
  },
  deleteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 0,
  },
  modalContent: {
    padding: 24,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 210, 10, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 10, 0.2)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  passwordInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 16,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalConfirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
