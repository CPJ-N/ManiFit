import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { BOTTOM_TABS, HOME, LOGIN, USER_DETAILS_FORM } from '../../constants/screenNames';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getUser } from '../../utils/controllers/userController';
import Constants from 'expo-constants'

WebBrowser.maybeCompleteAuthSession();

export default function SignUp({ navigation }: { navigation: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  // Updated code: clientId removed from the configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleWebClientId,
    iosClientId: Constants.expoConfig?.extra?.firebaseIosClientId,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then(async (userCredential) => {
            const user = userCredential.user;
            const userInfo = await getUser(user.uid);
            if (userInfo) {
              dispatch(setUser(userInfo));
              navigation.replace(BOTTOM_TABS, { screen: HOME });
            } else {
              const newUser = {
                uid: user.uid,
                email: user.email
              };
              navigation.navigate(USER_DETAILS_FORM, { user: newUser });
            }
          })
          .catch((error) => {
            console.error('Error during Firebase sign-in:', error);
            setError('Google Sign-In failed. Try again later.');
          });
      }
    }
  }, [response]);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        const newUser = {
          uid: user.uid,
          email: user.email,
        };
        navigation.navigate(USER_DETAILS_FORM, { user: newUser });
      })
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
        console.log(errorCode, error.message);
      });
  };

  const handleSignUpWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setError('Google Sign-In failed. Try again later.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />
      <Text style={styles.header}>Create Your Account</Text>
      <Text style={styles.subheader}>
        Sign up now to get access to personalized workouts and achieve your fitness goals.
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          placeholder="Email"
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
          style={styles.input}
          placeholderTextColor="grey"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          placeholder="Password"
          value={userPassword}
          onChangeText={text => setUserPassword(text)}
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholderTextColor="grey"
        />
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          onPress={() => setShowPassword(!showPassword)}
          size={20}
          color="#666"
          style={styles.inputIcon}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.loginText} onPress={() => navigation.navigate(LOGIN)}>
        Already have an account? Log in
      </Text>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.socialButtonGoogle} onPress={handleSignUpWithGoogle}>
        <Ionicons name="logo-google" size={20} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  header: {
    fontSize: 26,
    color: '#FFD20A',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 5,
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
    backgroundColor: '#FFD20A',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
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
    justifyContent: 'center',
    backgroundColor: '#DB4437', // Google red color
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  socialButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
