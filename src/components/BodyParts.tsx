import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { exerciseCategories } from '../constants/categories';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BodyParts() {
  return (
    <View style={{marginHorizontal: 5}} >
      <Text style={styles.semiboldTextNeutral}>
        Exercises
      </Text>

      <FlatList
        data={exerciseCategories}
        numColumns={2}
        keyExtractor={item=> item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50, paddingTop: 20}}
        columnWrapperStyle={{
            justifyContent: 'space-between'
        }}
        renderItem={({item, index})=> <BodyPartCard index={index} item={item} />}
      />
    </View>
  )
}

const BodyPartCard = ({item, index})=>{
    return (
        <Animated.View entering={FadeInDown.duration(400).delay(index*200).springify()}>
            <TouchableOpacity
                // onPress={()=> router.push({pathname: '/exercises', params: item})}
                style={[styles.flexJustifyEndPadding,{width: wp(44), height: wp(52)}]}
                >
                    <Image 
                        source={item.image}
                        resizeMode='cover'
                        style={[styles.roundedAbsolute, {width: wp(44), height: wp(52)}]}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.9)']}
                        style={[styles.absoluteBottomRoundedBottom, {width: wp(44), height: hp(15)}]}
                        start={{x: 0.5, y: 0}}
                        end={{x: 0.5, y: 1}}
                    />

                    <Text
                        style={[styles.whiteTextSemiboldCenterWide, {fontSize: hp(2.3)}]}
                    >
                        {item?.name}
                    </Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
  semiboldTextNeutral: {
      fontWeight: '600',  // 'bold' if '600' is not supported
      color: '#4A5568',
      fontSize: hp(3)
  },
  flexJustifyEndPadding: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 16,
      marginBottom: 16,
  },
  roundedAbsolute: {
      borderRadius: 35,
      position: 'absolute',
  },
  absoluteBottomRoundedBottom: {
      position: 'absolute',
      bottom: 0,
      borderBottomLeftRadius: 35,
      borderBottomRightRadius: 35,
  },
  whiteTextSemiboldCenterWide: {
      color: 'white',
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 1,
  },
});