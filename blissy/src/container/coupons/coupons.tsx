import React, { useEffect, useRef } from 'react'
import {View, FlatList, Text, TouchableOpacity, StyleSheet, Animated as NativeAnimated, Button} from 'react-native';
import { NavigationStackProps } from '../Prelogin/onboarding';
import { RouteBackButton } from '../../common/button/BackButton';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';
import {AuthSelector} from '../../redux/uiSlice'
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import RewardCard from '../../common/cards/rewardCard';
import { Empty } from '../../common/Empty/Empty';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated'
const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

type animatedProps = {
  value : any,
  duration:any
}

 const AnimatedNumber:React.FC<animatedProps> = ({ value, duration }) => {
    const animatedValue = useSharedValue(10);
  
    useEffect(() => {
      animatedValue.value = withTiming(value, {
        duration: duration || 1000,
        easing: Easing.linear,
      });
    }, [value, duration, animatedValue]);
  
    return (
      <Animated.Text style={[{ fontSize: 24, fontWeight: 'bold', color:colors.white }]}>
        {animatedValue.value}
      </Animated.Text>
    );
  };

export const Coupons: React.FC<NavigationStackProps> = ({navigation}) => {
  const {user} = useSelector(AuthSelector)

  const scrollY = useRef(new NativeAnimated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.9],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE / 2, -380],
    extrapolate: 'clamp',
  });


  return (
    <View style={styles.container}>
      <RouteBackButton  onPress={()=>navigation.goBack()}/>
      <NativeAnimated.ScrollView contentContainerStyle={[
          {paddingTop: HEADER_MAX_HEIGHT + 60},
          {padding:30},
        ]}
        scrollEventThrottle={16}
        onScroll={NativeAnimated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
      <View style={styles.usernameContainer}>
          <Text style={styles.username}>Hi, {user?.name?.split(" ")[0]}</Text>
          <LottieView autoPlay
              loop source={require("../../../assets/animation/hey.json")} style={{ width: actuatedNormalize(300), height: actuatedNormalize(300),alignSelf:"center" }} />
      </View>
      <View style={styles.cardContainer}>
        <RewardCard coins={"200"} shouldAnimate={false} />
        <AnimatedNumber duration={500} value={100} />
      </View>
      <Empty/>

      </NativeAnimated.ScrollView>
      <NativeAnimated.View
        style={[styles.header, {transform: [{translateY: headerTranslateY}]}]}>
          {/* <ProfilePic launchingCamera={setProfilePic}/> */}
          {/* <Button /> */}
        <NativeAnimated.Image
          style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{translateY: imageTranslateY}],
            },
          ]}
          source={{uri:'https://ik.imagekit.io/gqdvppqpv/avatar_men/avatar-punjabiboy.png?updatedAt=1713636201775'}}
          
        />
      </NativeAnimated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      // alignItems: 'center',
      // padding:actuatedNormalize(30),
      // paddingTop: actuatedNormalize(70),
  },
  username:{
      color:colors.white,
      fontFamily:fonts.NexaBold,
      fontSize:actuatedNormalize(40),
  },
  usernameContainer:{
    flexDirection:"row",
    height:"30%",
    backgroundColor:colors.accent,
    padding:actuatedNormalize(30),
    paddingTop: actuatedNormalize(65),
  },
  cardContainer:{
    // width:'90%',
    marginTop:actuatedNormalize(-45),
    alignItems:'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
})

// import React, {useEffect, useRef, useState} from 'react';
// import {
//   Text,
//   TouchableOpacity,
//   View,
//   Animated,
//   StyleSheet,
//   Easing,
// } from 'react-native';
// import {NavigationStackProps} from '../Prelogin/onboarding';
// import {RouteBackButton} from '../../common/button/BackButton';
// import colors from '../../constants/colors';
// type AnimatedValueXY = Animated.ValueXY;
// export const Coupons: React.FC<NavigationStackProps> = ({navigation}) => {
//   const coinsNo = 10;
//   const initPosition = {
//     // Assuming the screen height is 800 and you want the balls initially at the bottom
//     x:0,
//     y: 0  
//   };
  
//   const flyX = useRef(
//     Array.from({length: 10}, (_, index) => new Animated.ValueXY({x: 0, y: 750 - index * 50 })),
//   ).current;
//   const [coinSet, setCoinSet] = useState(1);

//   // const flyX = useRef(
//   //   repeat(coinsNo).map(() => new Animated.ValueXY({ x: 0, y: 0 }))
//   // ).current;
//   console.log(flyX, "transitions array")

//   const handleAnimation = (translation:AnimatedValueXY, index:any, delay:any) => {
//     const yOffset = 50 * index;
//     const initialY = initPosition.y * 2 - 100 - yOffset;
  
//     Animated.parallel([
//       Animated.timing(translation.x, {
//         toValue: -40,
//         duration: 400,
//         useNativeDriver: true,
//         delay:delay
//       }),
//       Animated.timing(translation.y, {
//         toValue: initialY,
//         duration: 400,
//         useNativeDriver: true,
//         delay:delay
//       })
//     ]).start(({ finished }) => {
//       // Animated.parallel([
//       //   Animated.timing(translation.x, {
//       //     toValue: -150,
//       //     duration: 400,
//       //     useNativeDriver: true,
//       //     delay:delay
//       //   }),
//       //   Animated.timing(translation.y, {
//       //     toValue: initPosition.y * 2 - 10 - yOffset,
//       //     duration: 400,
//       //     useNativeDriver: true,
//       //     delay:delay
//       //   })
//       // ]).start(({ finished }) => {
//         // Animated.parallel([
//         //   Animated.timing(translation.x, {
//         //     toValue: 150,
//         //     duration: 400,
//         //     useNativeDriver: true,
//         //     delay:delay
//         //   }),
//         //   Animated.timing(translation.y, {
//         //     toValue: initPosition.y / 12,
//         //     duration: 400,
//         //     useNativeDriver: true,
//         //     delay:delay
//         //   })
//         // ]).start();
//       // });
//     });
//   };
  
//   const animateBalls = () => {
//     for (let i = 0; i < flyX.length; i++) {
//       const translation = flyX[i];
//       const delay = i * 200;
//       handleAnimation(translation, i, delay);
//     }
//   };

//   return (
//     <View style={{padding: 20}}>
//       <RouteBackButton onPress={() => navigation.goBack()} />
//       <View style={{flexDirection: 'row', width: '100%'}}>
//         <Text>Helllo</Text>
//         <View style={{alignItems: 'flex-end', flex: 1}}>
//           <View style={styles.walletContainer}>
//             <Text style={styles.walletText}>Wallet</Text>
//           </View>
//         </View>
//       </View>
//       <View
//         style={{
//           height: '100%',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <TouchableOpacity onPress={animateBalls} style={styles.redeemButton}>
//           <Text style={styles.redeemButtonText}>Redeem</Text>
//         </TouchableOpacity>
//         {coinSet === 0 ? null : (
//           <View>
//           {flyX.map((translation, index) => (
//             <Animated.View
//               key={index}
//               style={{
//                 height: 50,
//                 width: 50,
//                 backgroundColor: colors.bag10Bg,
//                 transform: [{ translateX: translation.x }, { translateY: translation.y }],
//                 borderRadius: 100,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Text>{index + 1}</Text>
//             </Animated.View>
//           ))}
//         </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   walletContainer: {
//     height: 30,
//     width: 50,
//     borderRadius: 30,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   walletText: {
//     color: '#fff',
//   },
//   redeemButton: {
//     height: 50,
//     width: 100,
//     borderRadius: 20,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//   },
//   redeemButtonText: {
//     color: '#fff',
//   },
//   coinStyle: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'red',
//     borderRadius: 100,
//     width: 50,
//     height: 50,
//     position: 'absolute',
//   },
// });
