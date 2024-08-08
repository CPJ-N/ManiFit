import React, { useState }  from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or any other icon library
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { BOTTOM_TABS, HOME, LOGIN, USER_DETAILS_FORM, WELCOME } from '../../constants/screenNames';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
// import { AppDispatch } from '../store/reduxStore';

export default function SignUp({navigation}) {
  const [showPassword, setShowPassword] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const dispatch = useDispatch();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(user.email)
      // console.log(user)

      const newUser = {
        uid: user.uid, 
        email: user.email
      }

      // createUser(newUser);
      // dispatch(setUser(newUser));

      navigation.navigate(USER_DETAILS_FORM);
      // navigation.navigate(BOTTOM_TABS, {screen: {HOME}});
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode, errorMessage)
    });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <Text style={styles.header}>Create Your Account 💪</Text>
      <Text style={styles.subheader}>Sign up now to get access to personalized workouts and achieve your fitness goals.</Text>

      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          placeholder="Email" 
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
          style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          placeholder="Password" 
          value={userPassword}
          onChangeText={text => setUserPassword(text)}
          secureTextEntry={!showPassword} 
          style={styles.input} />
        <Icon name="eye-outline" onPress={() => setShowPassword(!showPassword)} size={20} color="#666" style={styles.inputIcon} />
      </View>

      <TouchableOpacity
       style={styles.button}
       onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text 
        style={styles.loginText} 
        onPress={() => navigation.navigate(LOGIN)}>
        Already have an account? Log in
      </Text>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.socialButtonGoogle}>
        <Icon name="google" size={20} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButtonApple}>
        <Icon name="apple" size={20} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButtonFacebook}>
        <Icon name="facebook" size={20} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingLeft: 10,
  },
  inputIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  orText: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButtonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dd4b39',
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  socialButtonApple: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  socialButtonFacebook: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 25,
  },
  socialButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
});
