import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function TempHome() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Hello</Text>
      <TouchableOpacity
        // onPress={() => navigation.navigate('Login')}
        style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        // onPress={() => navigation.navigate('Signup')}
        style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: '#1e90ff',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
  });