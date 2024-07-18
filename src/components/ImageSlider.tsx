import { Dimensions, View, Text } from 'react-native'
import React from 'react'
// import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import { sliderImages } from '../constants/categories';
import Carousel from 'react-native-reanimated-carousel';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function ImageSlider() {
    const width = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

// export default function ImageSlider() {
//   return (
//     <Carousel
//         data={sliderImages}
//         loop={true}
//         autoplay={true}
//         renderItem={ItemCard}
//         hasParallaxImages={true}
//         sliderWidth={wp(100)}
//         firstItem={1}
//         autoplayInterval={4000}
//         itemWidth={wp(100)-70}
//         slideStyle={{display: 'flex', alignItems: 'center'}}
//     />

//   )
// }

// const ItemCard = ({item, index}, parallaxProps)=>{
//     return (
//         <View style={{width: wp(100)-70, height: hp(25)}}>
//             <ParallaxImage
//                 key={index}
//                 source={item}
//                 containerStyle={{borderRadius: 30, flex:1}}
//                 style={{resizeMode: 'contain'}}
//                 parallaxFactor={1}
//                 {...parallaxProps}
//             />
//         </View>
//     )
// }