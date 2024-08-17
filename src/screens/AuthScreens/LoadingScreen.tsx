import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import TempHome from './TempHome';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/ManiFit Logo.png')}
        style={styles.logo}
      />
      {/* <Text style={styles.brandName}>MANIFIT</Text> */}
      {/* <TempHome /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD20A', // This is a gold color, adjust the hex as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%', // Set the width as per your logo's aspect ratio
    // height: 150, // Set the height as per your logo's aspect ratio
    resizeMode: 'contain'
  },
  brandName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black' // Adjust the text color as needed
  }
});

export default LoadingScreen;
