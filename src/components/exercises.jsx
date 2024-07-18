import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchExercisesByBodypart } from '../api/exerciseDB';
// import { demoExercises } from '../constants';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExerciseList from '../components/ExerciseList';
import { ScrollView } from 'react-native-virtualized-view'

export default function Exercises() {
    const router = useRouter();
    const [exercises, setExercises] = useState([]);
    const item = useLocalSearchParams();
    // console.log('got item: ', item);

    useEffect(()=>{
        if(item) getExercises(item.name);
    },[item]);

    const getExercises = async (bodypart)=>{
        let data = await fetchExercisesByBodypart(bodypart);
        // console.log('got data: ', data);
        setExercises(data);
    }
  return (
    <ScrollView>
        <StatusBar style="light" />
        <Image 
            source={item.image}
            style={{width: wp(100), height: hp(45), borderBottomLeftRadius: 40, borderBottomRightRadius: 40}}
        />
        <TouchableOpacity
            onPress={()=> router.back()}
            style={[styles.roseButton, {height: hp(5.5), width: hp(5.5), marginTop: hp(7)}]}
        >
                 <Ionicons name="caret-back-outline" size={hp(4)} color="white" />
        </TouchableOpacity>

        {/* exercises */}
        <View style={styles.contentContainer}>
            <Text style={[styles.textStyle, {fontSize: hp(3)}]}>
                {item.name} exercises
            </Text>
            <View style={{marginBottom: 40}}>
                <ExerciseList data={exercises} />
            </View>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    roseButton: {
        backgroundColor: '#f43f5e',
        marginHorizontal: 16,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 4,
        borderRadius: 1000,
    },
    contentContainer: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    textStyle: {
        fontWeight: '600',
        color: '#4A5568',
    }
});
