import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons';

export default function ScreenHeader({screenName, back}: {screenName: string, back: any}) {
  return (
    <View style={styles.header}>
      <StatusBar style="light" />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="chevron-back" size={24} color="#ffd20a" style={styles.icon} onPress={back} />
          <Text style={styles.greeting}>
            {screenName}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={24} color="white" style={styles.icon} />
          <Ionicons name="notifications" size={24} color="white" style={styles.icon} />
          <Ionicons name="person" size={24} color="white" style={styles.icon} />
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
      },
      subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        padding: 20,
      },
      greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD20A',
      },
      subGreeting: {
        fontSize: 14,
        color: '#f4f4f4',
      },
      headerIcons: {
        flexDirection: 'row',
      },
      icon: {
        paddingRight: 10,
      },
})