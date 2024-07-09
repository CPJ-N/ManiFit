import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'
import ExerciseManager from '../components/ExcerciseManager'

// TO DO: Change the Welcome component to Excercise Home Page

export default function Welcome({navigation}) {

  const handleSignOut = () => {
    signOut(auth)
    .then((res) => {
      console.log(res)
      navigation.navigate('Home') // Update the navigate function call
      console.log('signed out')
    })
    .catch((error) => {
      console.log(error)
      alert(error.message)
    })
  }

  return (
    <View style={styles.container}>
      {/* <Text>Welcome</Text>
      
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity
       style={styles.button}
       onPress={handleSignOut}>
        <Text style={styles.buttonText}> Sign Out </Text>
      </TouchableOpacity> */}
      <ExerciseManager />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#0782f9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  }
})