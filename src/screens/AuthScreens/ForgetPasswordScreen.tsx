import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PASSWORD_RESET } from '../../constants/screenNames';

export default function ForgottenPassword({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Forgotten Password</Text>
      </View>
      <View style={styles.centeredContainer}>
        <Text style={styles.description}>
          Please enter your email address below to receive a link to reset your password.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="grey"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(PASSWORD_RESET)}>
          <Text style={styles.buttonText}>Continue</Text>
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
    position: 'relative',
    marginTop: 40,
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
    textAlign: 'center',
    marginBottom: 30,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 150,
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
    marginTop: 10,
  },
  buttonText: {
    color: '#1e1e1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});