import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Assuming you're using this library
import CheckBox from '@react-native-community/checkbox';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [isSelected, setSelection] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const navigation = useNavigation()

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.replace('Welcome')
      }
    })

    return unsubscribe
  }, [])

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.email)
      console.log(user)
      navigation.navigate('Welcome')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage)
    });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <Text style={styles.welcomeBack}>Welcome Back! </Text>
      <Text style={styles.subtext}>Sign in to access your personalized workouts and track your progress.</Text>

      <View style={styles.inputField}>
        <Icon name="email-outline" size={24} color="grey" />
        <TextInput 
          placeholder="Email" 
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
          style={styles.input} 
          placeholderTextColor="grey"
        />
      </View>

      <View style={styles.inputField}>
        <Icon name="lock-outline" size={24} color="grey" />
        <TextInput 
          placeholder="Password" 
          value={userPassword}
          onChangeText={text => setUserPassword(text)}
          secureTextEntry={!showPassword} 
          style={styles.input} 
          placeholderTextColor="grey"
        />
        <Icon onPress={() => setShowPassword(!showPassword)} name="eye-off-outline" size={24} color="grey" />
      </View>

      <View style={styles.rememberMeContainer}>
        {/* <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
        />
        <Text style={{color: '#fff'}}>Remember me</Text> */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
       style={styles.loginButton}
       onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Icon name="google" size={20} color="#fff" />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleButton}>
        <Icon name="apple" size={20} color="#fff" />
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebookButton}>
        <Icon name="facebook" size={20} color="#fff" />
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  welcomeBack: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 10,
  },
  subtext: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 20,
  },
  inputField: {
    flexDirection: 'row',
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  input: {
    color: '#fff',
    paddingLeft: 10,
    flex: 1,
  },
  rememberMeContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  forgotPassword: {
    justifyContent: 'center',
    alignContent: 'center',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  or: {
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 20,
  },
  googleButton: {
    backgroundColor: '#dd4b39',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  appleButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
