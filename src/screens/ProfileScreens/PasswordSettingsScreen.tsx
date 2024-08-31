import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordSettingsScreen({navigation}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    // Implement password change logic here
    console.log('Changing password...');
  };

  const renderPasswordInput = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string,
    showPassword: boolean,
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#666"
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="#ffd20a" onPress={()=>navigation.goBack()}/>
        <Text style={styles.headerTitle}>Password Settings</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Current Password</Text>
        {renderPasswordInput(currentPassword, setCurrentPassword, "Enter current password", showCurrentPassword, setShowCurrentPassword)}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.label}>New Password</Text>
        {renderPasswordInput(newPassword, setNewPassword, "Enter new password", showNewPassword, setShowNewPassword)}

        <Text style={styles.label}>Confirm New Password</Text>
        {renderPasswordInput(confirmNewPassword, setConfirmNewPassword, "Confirm new password", showConfirmPassword, setShowConfirmPassword)}

        <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
          <Text style={styles.changeButtonText}>Change Password</Text>
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
  },
  label: {
    fontSize: 16,
    color: '#ffd20a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'right',
    marginBottom: 16,
  },
  changeButton: {
    backgroundColor: '#ffd20a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  changeButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
