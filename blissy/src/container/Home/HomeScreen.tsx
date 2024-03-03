import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View, BackHandler, Alert} from 'react-native';
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
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  actuatedNormalize,
} from '../../constants/PixelScaling';
import OfferBadge from '../../common/badge';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {RoundedIconContainer} from '../../common/button/rounded';
import TalkNowButton from '../../common/button/Talknow';
import ShockwavePulseButton from '../../common/button/callnow';
import AutoLoopCarousel, {reviewsArray} from '../../common/cards/review';
import io, {Socket} from 'socket.io-client';
import {ApiEndPoint} from '../../config';
import MicrophonePermissionModal from '../../common/permissions/microphone';
import WebRTCComponent from './webrtc';
import VoiceCall from './webrtc';

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
    navigate: 'Chatlist',
  },
  {
    id: 2,
    label: 'calls',
    iconName: 'call',
    navigate: 'Calllist',
  },
  {
    id: 3,
    label: 'coupons',
    iconName: 'gift',
    navigate: 'Coupons',
  },
];
export const HomeScreen: React.FC<NavigationStackProps> = ({navigation}) => {
  const [data, setData] = useState(HealerMockData.slice(0, 10)); // Initial data for first 10 cards
  const [value, setValue] = useState<string>('healers');
  const [healerAnimate, sethealerAnimate] = useState(true);
  const [PeopleAnimate, setPeopleAnimate] = useState(true);
  const [permission, setpermission] = useState(false);
  const socket = useMemo(
    () =>
      io(ApiEndPoint, {
        secure: true,
        transports: ['websocket'],
      }),
    [],
  ); // Empty dependency array means this runs once on mount

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
      navigation.navigate('Connection');
      setpermission(false)
      // You can now proceed with microphone-related functionality
    } else {
      Alert.alert('Microphone permission denied');
      setpermission(false)
      // Handle the denial of microphone permission accordingly
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp(); // Close the app when back button is pressed
        return true; // Return true to prevent default behavior (going back)
      },
    );
    return () => backHandler.remove();
  }, []);

  // console.log(shouldAnimate,"shouldAnimate")

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
    // socket.connect();
    // socket.on('connect', () => {
    //   console.log('Connected to socket server');
    // });
    // return () => {
    //   socket.on('disconnect', () => {
    //     console.log('user disconnected from socket');
    //   });
    // };
  }, []);

  return (
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
                  onpress={() => navigation.navigate(item.navigate)}
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
            {/* <ShockwavePulseButton /> */}
            {permission && (
              <MicrophonePermissionModal
                onPermissionResult={handleMicrophonePermissionResult}
              />
            )}
            {/* <TalkNowButton
              label="Call Now"
              onPress={() => setpermission(true)}
            /> */}
                  <VoiceCall navigation={navigation} socket={socket}/>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '90%',
            }}>
            {/* <TalkNowButton label='Connect Now' onPress={()=>navigation.navigate("Connection")} /> */}
            <AutoLoopCarousel reviews={reviewsArray} />
          </View>
        </View>
      )}
    </View>
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
