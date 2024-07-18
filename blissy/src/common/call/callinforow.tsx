import Animated, { Extrapolate, FadeInUp, FadeOutUp, SharedValue, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated"
import SwipeableRow from "../animation/swipetodelete"
import React from "react"
import { Dimensions, Image, StyleProp, StyleSheet, ViewStyle } from "react-native"
import { View } from "react-native"
import { Text } from "react-native"
import { actuatedNormalize } from "../../constants/PixelScaling"
import colors from "../../constants/colors"
import { fonts } from "../../constants/fonts"
import { convertSeconds, getFormattedDate } from "../../utils/formatedateTime"
import { defaultStyles } from "../styles/defaultstyles"
import { TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ViewToken } from "react-native"
import { Calls } from "../../redux/callSlice"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../AppNavigation/navigatorType"
import { UserInterface } from "../../redux/uiSlice"
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ITEM_SIZE =  75

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);


interface Item {
    id: string;
    name: string;
    date: string;
    incoming: boolean;
    missed: boolean;
    img: string;
    video: boolean;
}

interface CallInforowProps {
    scrollY:SharedValue<number>;
    viewableItems: Animated.SharedValue<ViewToken[]>;
    animatedRowStyles:StyleProp<ViewStyle>;
    animatedPosition:StyleProp<ViewStyle>;
    item:Calls;
    index:number;
    removeCall:(value:Calls)=>void;
    navigation: NativeStackNavigationProp<RootStackParamList>;
    user:UserInterface
}

 const CallinforRow: React.FC<CallInforowProps> = ({user,scrollY,viewableItems,animatedRowStyles,animatedPosition,item,index,removeCall,navigation}) => {

// console.log(item,"itesm------>")
    const listanimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollY.value, [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)], [1, 1, 1, 0], Extrapolate.CLAMP);
        const opacity = interpolate(scrollY.value, [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)], [1, 1, 1, 0], Extrapolate.CLAMP);
        // console.log("hey------>",scale,opacity)
    
        return {
          transform: [{ scale }],
          opacity,
        };
      });

    // const itemPosition = index * ITEM_HEIGHT;
    // const isVisible = scrollY.value >= itemPosition - SCREEN_HEIGHT && scrollY.value <= itemPosition + SCREEN_HEIGHT;

    // const rStyle = useAnimatedStyle(() => {
    //   return {
    //     opacity: withTiming(isVisible ? 1 : 0),
    //     transform: [
    //       {
    //         scale: withTiming(isVisible ? 1 : 0.6),
    //       },
    //     ],
    //   }
    // })
    return (
        <SwipeableRow onDelete={() => removeCall(item)}>
            <AnimatedTouchableOpacity
            onPress={() => {
                navigation.navigate('ChatWindow', {
                    Chats:null,socketId:undefined,userDetails:item.UserCallsInfoList[0],senderUserId:user?._id || null                });
              }}
                entering={FadeInUp.delay(index * 20)}
                exiting={FadeOutUp}
                style={[listanimatedStyle, {flexDirection: 'row', alignItems: 'center' }]}
            >
                <AnimatedTouchableOpacity
                    style={[animatedPosition, { paddingLeft: 8 }]}
                    onPress={() => removeCall(item)}
                >
                    <Ionicons name="remove-circle" size={24} color={colors.red} />
                </AnimatedTouchableOpacity>
                <Animated.View
                
                    style={[defaultStyles.item, { paddingLeft: 10 }, animatedRowStyles]}
                >
                    <Image source={{ uri: item?.UserCallsInfoList[0]?.profilePic }} style={styles.avatar} />
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text style={{ fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(18), color: item.isMissed ? colors.lightRed2 : colors.white }}>
                            {item.UserCallsInfoList[0].name}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: actuatedNormalize(6), alignItems: "center" }}>
                            <Ionicons name={'call'} size={16} color={colors.gray} />
                            <Text style={{ fontSize: actuatedNormalize(14), color: colors.gray, flex: 1, fontFamily: fonts.NexaItalic }}>
                                {/* {item.incoming ? 'Incoming' : 'Outgoing'} */}
                                {item.callType} {convertSeconds(item.callDuration)}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: actuatedNormalize(12), color: colors.gray, fontFamily: fonts.NexaRegular }}>{getFormattedDate(item.createdAt)}</Text>
                        {/* <Ionicons name="information-circle-outline" size={24} color={colors.primary} /> */}
                    </View>
                </Animated.View>
            </AnimatedTouchableOpacity>
        </SwipeableRow>
    )
}

const styles= StyleSheet.create({
    avatar: {
        width: actuatedNormalize(50),
        height: actuatedNormalize(50),
        borderRadius: actuatedNormalize(30),
      },
})

export default React.memo(CallinforRow);
