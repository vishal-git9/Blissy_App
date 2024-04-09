import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View, BackHandler, Alert, PermissionsAndroid} from 'react-native';
import colors from '../../constants/colors';
import {Loader} from '../../common/loader/loader';
import {Button} from 'react-native';
import {NavigationStackProps} from '../Prelogin/onboarding';
import TopBar from '../../common/tab/topbar';
import {ToggleButton} from '../../common/tab/switch';
import {FlatList} from 'react-native';
import ProfileCard from '../../common/cards/healercard';
import {HealerMockData} from '../../mockdata/healerData';
import {
  actuatedNormalize,
} from '../../constants/PixelScaling';
import OfferBadge from '../../common/badge';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {RoundedIconContainer} from '../../common/button/rounded';
import TalkNowButton from '../../common/button/Talknow';
import AutoLoopCarousel, {reviewsArray} from '../../common/cards/review';
import io from 'socket.io-client';
import {ApiEndPoint} from '../../config';
import MicrophonePermissionModal from '../../common/permissions/microphone';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector, UserInterface } from '../../redux/uiSlice';
import {requestBluetoothPermission, requestMicrophonePermission} from '../../utils/permission';
import checkMicrophonePermission from '../../common/permissions/checkMicroPermission';
import checkLocationPermission from '../../common/permissions/checkLocationPermission';
import AnimatedBackground from '../../common/animation/animatedBackground';
import { resetMessageCount, resetMessages } from '../../redux/messageSlice';
import { AppState } from 'react-native';

interface iconsLabelI {
  id: number;
  label: string;
  iconName: string;
  navigate: any;
}
[];
const iconsLabel: iconsLabelI[] = [
  {
    id: 1,
    label: 'chats',
    iconName: 'chatbox-ellipses',
    navigate: 'ComingsoonScreen',
  },
  {
    id: 2,
    label: 'calls',
    iconName: 'call',
    navigate: 'ComingsoonScreen',
  },
  {
    id: 3,
    label: 'coupons',
    iconName: 'gift',
    navigate: 'ComingsoonScreen',
  },
];
export const HomeScreen: React.FC<NavigationStackProps> = ({navigation}) => {
  const [data, setData] = useState(HealerMockData.slice(0, 10)); // Initial data for first 10 cards
  const [value, setValue] = useState<string>('healers');
  const {user} = useSelector(AuthSelector)
  const dispatch = useDispatch()
  const [healerAnimate, sethealerAnimate] = useState(true);
  const [PeopleAnimate, setPeopleAnimate] = useState(true);
  const [permission, setpermission] = useState(false);
  const otherUserScoketId = useRef<string | null>(null);
  console.log(user,"user home screens")
  const socket = useMemo(
    () =>
      io(ApiEndPoint, {
        secure: true,
        transports: ['websocket'],
         query:{
          userId:user?._id
        }
      }),
    [user?._id],
  ); // Empty dependency array means this runs once on mount
console.log(socket.id)
  // Function to load more cards
  const loadMoreData = () => {
    setData(prevData => {
      const nextIndex = prevData.length;
      const newData = HealerMockData.slice(nextIndex, nextIndex + 10); // Load next 10 cards
      return [...prevData, ...newData];
    });
  };

  const handleMicrophonePermissionResult = (granted: boolean) => {
    if (granted) {
      Alert.alert('Microphone permission granted');
      // 
      // You can now proceed with microphone-related functionality
    } else {
      Alert.alert('Microphone permission denied You can not use App Services');
      // Handle the denial of microphone permission accordingly
    }
  };

  const intiateRandomConnection = ()=>{
    navigation.navigate("AudioCallScreen",{socket:socket,user:user})
    console.log("emitted the event for call")
    socket.emit('connectRandom')
  }
  
  useEffect(() => {
    const verifyMicroPhonePermissions = async () => {
      try {
        const result = await checkMicrophonePermission();
        if (result === 'granted') {
          // Permission is granted
          console.log("Microphone permission granted");
        } else {
          // Handle other permission states accordingly
          console.log("Microphone permission not granted");
          requestMicrophonePermission()
        //   return <MicrophonePermissionModal
        //   onPermissionResult={handleMicrophonePermissionResult}
        // />
        }
      } catch (error) {
        console.error(error);
      }
    };

    const verifyLocationPermissions = async () => {
      try {
        const result = await checkLocationPermission();
        if (result === 'granted') {
          // Permission is granted
          console.log("location permission granted");
        } else {
          // Handle other permission states accordingly
          requestBluetoothPermission()
          console.log("location permission not granted");
        }
      } catch (error) {
        console.error(error);
      }
    };

    verifyMicroPhonePermissions()
    verifyLocationPermissions()
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp(); // Close the app when back button is pressed
        return true; // Return true to prevent default behavior (going back)
      },
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // calling off the animation after first render
    const timingAnim = setTimeout(() => {
      sethealerAnimate(false);
    }, 5000);
    return () => {
      sethealerAnimate(false);
      clearTimeout(timingAnim);
    };
  }, []);

  useEffect(() => {
    
    return () => {
      console.log("removed from screen home screen")
      socket.on("connect",()=>{
        console.log("user connected",socket.id)
      })

      socket.on('initiateCall', (data: { matchedUser: UserInterface, callerId: string }) => {
        otherUserScoketId.current = data.callerId
        // console.log(data, "data of paired user")
      })
      socket.on('disconnect', () => {
        dispatch(resetMessageCount())
        dispatch(resetMessages())
        socket.emit("callEnded",otherUserScoketId.current)
        console.log('user disconnected from socket');
      });
    };
  }, []);

  return (
    // <AnimatedBackground source={{uri:"https://images.unsplash.com/photo-1710563138874-4bac91c14e51?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D"}}>
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ToggleButton value={value} setValue={setValue} />
      {value === 'healers' ? (
        <View style={styles.healerContainer}>
          <OfferBadge />
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <ProfileCard shouldAnimate={healerAnimate} {...item} />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreData} // Load more data when user reaches the end
            onEndReachedThreshold={0.1} // Load more when 90% of the list is scrolled
          />
        </View>
      ) : (
        <View style={styles.peopleContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {iconsLabel.map((item, id) => (
              <Animatable.View
                onAnimationEnd={() =>
                  setTimeout(() => {
                    setPeopleAnimate(false);
                  }, 2000)
                }
                animation={PeopleAnimate ? 'bounceIn' : undefined}
                key={item.id}
                delay={id * 500}>
                <RoundedIconContainer
                  onpress={() => navigation.navigate(item.navigate,{screenName:item.label})}
                  label={item.label}
                  iconName={item.iconName}
                />
              </Animatable.View>
            ))}
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '90%',
              alignSelf: 'center',
            }}>
            <TalkNowButton
              label="Connect Now"
              onPress={intiateRandomConnection}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '90%',
            }}>
            <AutoLoopCarousel reviews={reviewsArray} />
          </View>
        </View>
      )}
    </View>
    // </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  healerContainer: {
    marginTop: actuatedNormalize(30),
    width: '90%',
    rowGap: actuatedNormalize(20),
    paddingBottom: actuatedNormalize(200),
  },
  peopleContainer: {
    flex: 1,
    marginTop: actuatedNormalize(40),
    width: '90%',
  },
});
