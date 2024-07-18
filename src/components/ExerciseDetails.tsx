import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Anticons from 'react-native-vector-icons/AntDesign';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function exerciseDetails() {
    const item = useLocalSearchParams();
    const router = useRouter();
  return (
    <View style={{flex: 1}}>
        <View style={styles.imageContainer}>
            <Image  
                source={{uri: item.gifUrl}}
                contentFit='cover'
                style={styles.image}
            />
        </View>

        <TouchableOpacity 
            onPress={()=> router.back()}
            style={styles.closeButton}
        >
            <Anticons name="closecircle" size={hp(4.5)} color="#f43f5e" />
        </TouchableOpacity>

        {/* details */}

        <ScrollView style={{marginHorizontal: wp(4)}} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 60, paddingTop: hp(0.75)}}>
            <Animated.Text
                entering={FadeInDown.duration(300).springify()}
                style={styles.headerText}
            >
                {item.name}
            </Animated.Text>
            <Animated.Text
                entering={FadeInDown.delay(100).duration(300).springify()}
                style={styles.detailText}
            >
                Equipment <Text style={styles.boldText}>
                    {item?.equipment}
                </Text>
            </Animated.Text>
            <Animated.Text
                entering={FadeInDown.delay(200).duration(300).springify()}
                style={styles.detailText}
            >
                Secondary Muscles <Text style={styles.boldText}>
                    {item?.secondaryMuscles}
                </Text>
            </Animated.Text>
            <Animated.Text
                entering={FadeInDown.delay(300).duration(300).springify()}
                style={styles.detailText}
            >
                Target <Text style={styles.boldText}>
                    {item?.target}
                </Text>
            </Animated.Text>

            <Animated.Text
                entering={FadeInDown.delay(400).duration(300).springify()}
                style={styles.headerText}
            >
                Instructions
            </Animated.Text>

            {
                item.instructions?.split(',').map((instruction, index)=>{
                    return (
                        <Animated.Text
                            entering={FadeInDown.delay((index+5)*100).duration(300).springify()}
                            key={index}
                            style={styles.instructionText}
                        >
                            {instruction}
                        </Animated.Text>
                    )
                })
            }
        </ScrollView>
      
    </View>
  )
}

const styles = StyleSheet.create({
    imageContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: 'white',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    image: {
        width: wp(100),
        height: wp(100),
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    closeButton: {
        position: 'absolute',
        right: wp(2),
        marginTop: hp(2),
        borderRadius: 1000,
    },
    headerText: {
        fontSize: hp(3.5),
        fontWeight: '600',
        color: '#4A5568',
        letterSpacing: 0.1,
    },
    detailText: {
        fontSize: hp(2),
        color: '#4A5568',
        letterSpacing: 0.1,
        marginBottom: hp(0.75),
    },
    boldText: {
        fontWeight: 'bold',
        color: '#4A5568',
    },
    instructionText: {
        fontSize: hp(1.7),
        color: '#4A5568',
    }
});