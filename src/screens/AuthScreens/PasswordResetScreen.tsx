import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordReset({ navigation }: { navigation: any }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    // Add logic to reset password
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Set Password</Text>
      </View>
        <View style={styles.centeredContainer}>
            <Text style={styles.description}>
                Please enter your new password below. Make sure it is strong and secure.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
    paddingTop: 50, // Add padding to move content below the status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40, // Corrected typo in marginTop
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 40, // Reduced margin to decrease the gap
    textAlign: 'center',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120, // Corrected typo in marginTop
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: '#2e2e2e',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%', // Ensure the input takes the full width of the container
    height: 50,
  },
  button: {
    backgroundColor: '#FFD20A',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Ensure the button takes the full width of the container
    height: 50,
    marginTop: 10, // Added margin to separate the button from the input
  },
  buttonText: {
    color: '#1e1e1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});