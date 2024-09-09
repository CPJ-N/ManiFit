import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { BOTTOM_TABS, HOME } from '../../constants/screenNames';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { getUser } from '../../utils/controllers/userController';
import { StatusBar } from 'expo-status-bar';
import { getImageUrl } from '../../utils/controllers/imageController';
import { firebaseBucketName } from '../../constants/firebaseContant';

export default function Login({navigation}) {
  const [isSelected, setSelection] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.replace(BOTTOM_TABS, { screen: HOME })
      }
    })

    return unsubscribe
  }, [])

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userInfo = await getUser(user.uid)

      dispatch(setUser(userInfo));

      if(userInfo?.profilePhotoName) {
        const imageUrl = await getImageUrl(firebaseBucketName.userImages, userInfo.profilePhotoName)
        console.log('Image URL:', imageUrl);
        console.log('UserImage:', userInfo.profilePhotoName);
        dispatch(setUserImageUrl(imageUrl))
      }

      navigation.navigate(BOTTOM_TABS, {screen: {HOME}})
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorCode);
      console.log(errorCode, errorMessage)
    });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <StatusBar style="light" />
      <Text style={styles.welcomeBack}>Welcome Back! </Text>
      <Text style={styles.subtext}>Sign in to access your personalized workouts and track your progress.</Text>

      <View style={styles.inputField}>
        <Ionicons name="mail-outline" size={24} color="grey" />
        <TextInput 
          placeholder="Email" 
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
          style={styles.input} 
          placeholderTextColor="grey"
        />
      </View>

      <View style={styles.inputField}>
        <Ionicons name="book-outline" size={24} color="grey" />
        <TextInput 
          placeholder="Password" 
          value={userPassword}
          onChangeText={text => setUserPassword(text)}
          secureTextEntry={!showPassword} 
          style={styles.input} 
          placeholderTextColor="grey"
        />
        <Ionicons onPress={() => setShowPassword(!showPassword)} name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="grey" />
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
       style={styles.loginButton}
       onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Ionicons name="logo-google" size={20} color="#fff" />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleButton}>
        <Ionicons name="logo-apple" size={20} color="#fff" />
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebookButton}>
        <Ionicons name="logo-facebook" size={20} color="#fff" />
        <Text style={styles.buttonText}>Continue with Facebook</Text>
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
  welcomeBack: {
    fontSize: 26,
    color: '#FFD20A',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 10,
  },
  subtext: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputField: {
    flexDirection: 'row',
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    padding: 10,
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
    backgroundColor: '#FFD20A',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    margin: 10,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    margin: 10,
    textAlign: 'center',
  },
});
function setUserImageUrl(arg0: string): any {
  throw new Error('Function not implemented.');
}

