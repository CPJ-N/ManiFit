import React from 'react'
import { ScrollView, View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageSlider from '../components/ImageSlider';
import BodyParts from '../components/BodyParts';

export default function ExerciseScreen() {
  return (
    <SafeAreaView style={styles.flex1BgWhiteSpaceY5}>
      <StatusBar style="dark" />
      {/* punchilne and avatar */}
      <View style={styles.flexRowJustifyBetweenItemsCenterMx5}>
        <View style={{ marginTop: 20 }}>
            <Text
                style={styles.fontBoldTrackingWiderTextNeutral700}
            >
                READY TO
            </Text>
            <Text
                style={styles.fontBoldTrackingWiderTextRose500}
            >
                WORKOUT
            </Text>
        </View>

        <View style={styles.flexJustifyCenterItemsCenterSpaceY2}>
            <Image 
                source={require('../assets/images/avatar.png')}
                style={{height: hp(6), width: hp(6), borderRadius: 100, margin: 5}} 
            />
            <View
              style={styles.bgNeutral200RoundedFullFlexJustifyCenterItemsCenterBorder3Neutral300}
            >
                <Ionicons name="notifications" size={hp(3)} color="gray" />
            </View>
        </View>
      </View>

      {/* image slider */}
      <View>
        <ImageSlider />
      </View>

        {/* body parts list */}
      <View style={{flex: 1}}>
        <BodyParts />
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex1BgWhiteSpaceY5: {
    flex: 1,
    backgroundColor: 'white',
    // React Native doesn't support space-y, you'll have to manually add margin or padding in the component children
  },
  flexRowJustifyBetweenItemsCenterMx5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginHorizontal: 5,
    margin: 5
  },
  fontBoldTrackingWiderTextNeutral700: {
    fontWeight: 'bold',
    letterSpacing: 1, // Adjust the value based on your design, React Native does not directly support tracking-wider
    color: '#4B5563', // Assuming text-neutral-700 corresponds to a mid-tone gray
    fontSize: hp(4.5)
  },
  fontBoldTrackingWiderTextRose500: {
    fontWeight: 'bold',
    letterSpacing: 1, // Adjust as needed
    color: '#f43f5e', // Hex for Tailwind's text-rose-500
    fontSize: hp(4.5)
  },
  flexJustifyCenterItemsCenterSpaceY2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Space-y equivalent needs to be handled manually in child components
  },
  bgNeutral200RoundedFullFlexJustifyCenterItemsCenterBorder3Neutral300: {
    backgroundColor: '#E5E7EB', // Hex for Tailwind's bg-neutral-200
    borderRadius: 100,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#D1D5DB', // Hex for Tailwind's border-neutral-300
    height: hp(5.5), 
    width: hp(5.5)
  }
});