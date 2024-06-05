import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, BackHandler, Alert, PermissionsAndroid, Linking, Platform } from 'react-native';
import colors from '../../constants/colors';
import { NavigationStackProps } from '../Prelogin/onboarding';
import TopBar from '../../common/tab/topbar';
import { ToggleButton } from '../../common/tab/switch';
import { FlatList } from 'react-native';
import ProfileCard from '../../common/cards/healercard';
import { HealerMockData } from '../../mockdata/healerData';
import {
  actuatedNormalize,
} from '../../constants/PixelScaling';
import notifee, { EventType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import OfferBadge from '../../common/badge';
import * as Animatable from 'react-native-animatable';
import { RoundedIconContainer } from '../../common/button/rounded';
import AutoLoopCarousel, { reviewsArray } from '../../common/cards/review';
import io from 'socket.io-client';
import { ApiEndPoint } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector, UserInterface, setFcmToken, setSocket } from '../../redux/uiSlice';
import { requestMultplePermissions } from '../../utils/permission';
import checkMicrophonePermission from '../../common/permissions/checkMicroPermission';
import checkLocationPermission from '../../common/permissions/checkLocationPermission';
import { ActiveUserList, ActiveUserListSelector, addMessage, chatListSelector, getActiveUserList, pushChatlist, resetMessageCount, resetMessages } from '../../redux/messageSlice';
import { SwipeButtonComponent } from '../../common/button/swipebutton';
import { fonts } from '../../constants/fonts';
import PermissionDenied from '../../common/permissions/permissiondenied';
import { PermissionStatus } from 'react-native-permissions';
import { useGetChatlistQuery, useMarkReadMessageMutation } from '../../api/chatService';
import checkNotificationPermission from '../../common/permissions/checkNotificationPermission';
import { eventEmitter } from '../../..';
import { useAddFcmTokenMutation, useGetUserQuery, usePostUserDevieInfoMutation } from '../../api/userService';
import DeviceInfo from 'react-native-device-info';
import { getDeviceUniqueId } from '../../utils/getDeviceUniqueId';
import { playNotificationSound } from '../../common/sound/notification';

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
    navigate: 'IncomingCall',
  },
  {
    id: 3,
    label: 'coupons',
    iconName: 'gift',
    navigate: 'CouponsScreen',
  },
];
export const HomeScreen: React.FC<NavigationStackProps> = ({ navigation }) => {
  const [data, setData] = useState(HealerMockData.slice(0, 10)); // Initial data for first 10 cards
  const [value, setValue] = useState<string>('random');
  const { user, fcmToken } = useSelector(AuthSelector)
  const { activeUserList } = useSelector(ActiveUserListSelector)
  const dispatch = useDispatch()
  const chatlistdata = useSelector(chatListSelector);
  const { refetch, isError, isLoading, isSuccess } = useGetChatlistQuery(user?._id)
  const { refetch:refetchUser, isError:isErrorUser, isLoading:isLoadingUser, isSuccess:isSuccessUser } = useGetUserQuery()
  const [postDeviceinfo, { isError: postDeviceinfoError, isLoading: postDeviceinfoLoading, data: postDeviceinfoData }] = usePostUserDevieInfoMutation()
  const [postFcmToken, {  }] = useAddFcmTokenMutation()

  // const {refetch:fetchNewMsg,isError:newMsgerr,isLoading:newMsgLoading,isSuccess:newMsgsuccess} = useGetNewMessageQuery({userId:user?._id})
  const [healerAnimate, sethealerAnimate] = useState(true);
  const [PeopleAnimate, setPeopleAnimate] = useState(true);
  const [permission, setpermission] = useState(false);
  const [markRead, { }] = useMarkReadMessageMutation()
  const [permissionType, setpermissionType] = useState('');
  const otherUserScoketId = useRef<string | null>(null);
  console.log(user, "user home screens")
  const socket = useMemo(
    () =>
      io(ApiEndPoint, {
        secure: true,
        transports: ['websocket'],
        query: {
          userId: user?._id
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

  const handlePermissions = (response: any) => {
    for (const permissionKey in response) {
      const permissionResult: PermissionStatus = response[permissionKey];
      switch (permissionResult) {
        case 'granted':
          console.log(`${permissionKey} permission granted.`);
          // Handle logic for granted permission
          // setpermission(false);
          break;
        case 'denied':
          console.log(`${permissionKey} permission denied.`);
          // Handle logic for denied permission
          break;
        case 'blocked':
          console.log(`${permissionKey} permission blocked.`);
          // showBlockedModal(permissionKey);
          setpermission(true)
          if (permissionKey === "android.permission.ACCESS_FINE_LOCATION") {
            setpermissionType('Location')
          } else if (permissionKey === "android.permission.RECORD_AUDIO") {
            setpermissionType("Microphone")
          } else if (permissionKey === "android.permission.POST_NOTIFICATIONS") {
            setpermissionType("Notifications")
          }
          // Handle logic for blocked permission
          break;
        default:
          console.log(`${permissionKey} permission unknown status.`);
          // Handle logic for unknown status
          break;
      }
    }
  };

  const intiateRandomConnection = () => {
    navigation.navigate("AudioCallScreen", { user: user })
    console.log("emitted the event for call")
    socket.emit('connectRandom')
  }

  const handleNotificationReceived = useCallback( (Chatdata:any)=>{
    console.log("I am here Yarr------>", chatlistdata, Chatdata,activeUserList);
    if (Chatdata?.senderData) {
      // Dispatch actions to refetch the latest data when a new notification is received


      const ChatPartnerData = chatlistdata?.find((el) => el?.chatPartner?._id === Chatdata?.senderData?._id);
      const socketId = activeUserList?.find((el) => el?.userId?._id === Chatdata?.senderData?._id)?.socketId;

      if (!ChatPartnerData) {
        navigation.navigate("ChatWindow", {
          userDetails: Chatdata.senderData,
          Chats: null,
          socketId: socketId,
          senderUserId: Chatdata.senderData._id
        });
      } else {
        navigation.navigate("ChatWindow", {
          userDetails: Chatdata.senderData,
          Chats: ChatPartnerData,
          socketId: socketId,
          senderUserId: Chatdata.senderData._id
        });
      }
    }

  },[chatlistdata?.length,activeUserList?.length])

  useEffect(() => {

    // verifyMicroPhonePermissions()
    // verifyLocationPermissions()
    console.log(activeUserList, "Home screen activeuserList From redux")
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp(); // Close the app when back button is pressed
        return true; // Return true to prevent default behavior (going back)
      },
    );
    return () => backHandler.remove();
  }, []);

  const verifyLocationPermissions = async () => {
    try {
      const locationRes = await checkLocationPermission();
      const microphoneRes = await checkMicrophonePermission();
      if (locationRes === 'granted' && microphoneRes === 'granted') {
        // Permission is granted
        console.log(locationRes, microphoneRes, "permissions from home check if ")
        console.log("location permission granted");
      } else {
        // Handle other permission states accordingly
        // requestBluetoothPermission()
        const response = await requestMultplePermissions();
        handlePermissions(response);
        console.log(response, "location permission not granted ");
        console.log(locationRes, microphoneRes, "permissions from home check else")
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFCMToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      console.log("I am here----->")
      if (!!fcmToken) {
        console.log("OLD FCM_TOKEN FOUND", fcmToken)
      } else {
        const token = await messaging().getToken();
        //inserting device token to db
        let platform = Platform.OS === "ios" ? "IOSMOBILE" : "ANDROIDMOBILE";
        // let platform = 'HUAWEIMOBILE'

        let devName = await DeviceInfo.getDeviceName()

        let devType = DeviceInfo.getDeviceType() == 'Handset' ? 'MOBILE' : DeviceInfo.getDeviceType() == 'Tablet' ? 'TABLET' : 'MOBILE'

        let getApplicationName = DeviceInfo.getApplicationName()

        let getBuildId = await DeviceInfo.getBuildId()

        let getBrand = DeviceInfo.getBrand()

        let getBundleId = DeviceInfo.getBundleId()

        let getBuildNumber = DeviceInfo.getBuildNumber()

        let getDeviceId = DeviceInfo.getDeviceId()

        let getIpAddress = await DeviceInfo.getIpAddress()

        let getMacAddress = await DeviceInfo.getMacAddress()

        let getManufacturer = await DeviceInfo.getManufacturer()

        let getSystemName = DeviceInfo.getSystemName()

        let getUniqueId = await getDeviceUniqueId()

        let getUserAgent = await DeviceInfo.getUserAgent()

        const deviceInfo =
        {
          appVersion: DeviceInfo.getVersion(),
          platform: platform,
          deviceType: devType,
          platformVersion: DeviceInfo.getSystemVersion(),
          deviceModel: DeviceInfo.getModel(),
          deviceName: devName,
          mpinEnabled: "N",
          faceIdEnabled: "N",
          bioMetricEnabled: "N",
          applicationName: getApplicationName,
          buildId: getBuildId,
          brand: getBrand,
          bundleId: getBundleId,
          buildNumber: getBuildNumber,
          deviceId: getDeviceId,
          ipAddress: getIpAddress,
          macAddress: getMacAddress,
          manufacturer: getManufacturer,
          systemName: getSystemName,
          uniqueId: getUniqueId,
          userAgent: getUserAgent
        }
        await postDeviceinfo({
          deviceData: {
            ...deviceInfo
          },
          uniqueDeviceId:deviceInfo.uniqueId
        })

        await postFcmToken({
          fcmToken:token
        })

        await refetchUser()

        //dispatch(setFcmToken(token)) // currently saving into local mobile state later on will save in db
        console.log("NEW FCM_TOKEN", token)
      }
    } catch (error) {
      console.log("error during generating token", error)
    }
  }

  async function requestUserPermission() {

    if (Platform.OS == 'android' && Platform.Version >= 33) {
      const res = await checkNotificationPermission()
      console.log(res, "notifyPermission----->")
      if (res === "granted") {
        getFCMToken()
      } else {
        console.log("permission denied")
      }
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFCMToken()
      }
    }
  }

  useEffect(() => {
    const getInitialNotificationDetail = async () => {
      const getInitialNotification = await notifee.getInitialNotification()
      console.log(getInitialNotification, "getInitialNotification------>")
      if (getInitialNotification) {
        navigation.navigate("Chatlist");
      }
    }

    // event listens for background and foreground mode
    eventEmitter.on('notificationReceived',handleNotificationReceived);

    getInitialNotificationDetail()
    return () => {
      eventEmitter.off('notificationReceived');
    };
  }, [activeUserList?.length]);
  useEffect(() => {
    socket?.on("privateMessageSuccessfulAdd", async (data) => {
      console.log("newMessage----->", data);
      // findMyMessage(newMessages, chatlistdata);
      dispatch(pushChatlist(data.chatList));
      console.log("newMessage2----->", data);
      playNotificationSound();
      await markRead({messageIds:[data.messageId],updateType:"isDelivered"})
      socket.emit("messageReceived", { userId: data.senderId, socketId: data.otherEndsocketId })
    });
    // socket?.on('newActiveUser', (user) => {
    //   dispatch(getActiveUserList(user))
    //   console.log(user, "activeUserList new-------->")
    // })

    socket?.on("messageDelivered", (data) => {
      console.log(data, "Deliveredupdateddata------>")
      dispatch(pushChatlist(data.chatList));
    })

    socket?.on("messageSeen", (data) => {
      console.log(data, "Seenupdateddata------>")
      dispatch(pushChatlist(data.chatList));
    })
    return () => {
      socket?.off("privateMessageSuccessfulAdd")
      socket?.off("messageDelivered")
      socket?.off("messageSeen")
    }

  }, [chatlistdata, socket]);


  useEffect(() => {

    verifyLocationPermissions().then(()=>requestUserPermission()).catch((err)=>console.log(err));
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
    dispatch(resetMessages())
    socket.on("connect", () => {
      console.log("user connected", socket.id)
      console.log(socket, "sockeet state")
      socket.emit("getActiveUserList")
      dispatch(setSocket(socket))
      refetch().then((res) => dispatch(pushChatlist(res.data.chatList))).catch((err) => console.log(err))
      // fetchNewMsg().then((res)=>dispatch(pushCurrentMessage(res.data.chat))).catch((err)=>console.log(err))

    })

    socket.on('initiateCall', (data: { matchedUser: UserInterface, callerId: string }) => {
      otherUserScoketId.current = data.callerId
      // console.log(data, "data of paired user")
    })
    socket.on('activeUserList', (activeUserListres: ActiveUserList[]) => {
      dispatch(getActiveUserList(activeUserListres))
      console.log(activeUserListres, "activeUserList from home =")
    })

    socket.on('newActiveUser', (user) => {
      dispatch(getActiveUserList(user))
      console.log(user, "activeUserList new-------->")
    })

    return () => {
      socket.off("initiateCall")
      socket.off('activeUserList')
      socket.off("newActiveUser")
      socket.on('disconnect', () => {
        dispatch(resetMessageCount())
        dispatch(resetMessages())
        socket.emit("callEnded", otherUserScoketId.current)
        console.log('user disconnected from socket');
      })

      console.log("user out of app")
    }
  }, []);

  console.log(chatlistdata, "chatlistdata")

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
            renderItem={({ item }) => (
              <ProfileCard shouldAnimate={healerAnimate} {...item} />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreData} // Load more data when user reaches the end
            onEndReachedThreshold={0.1} // Load more when 90% of the list is scrolled
          />
        </View>
      ) : (
        <View style={styles.peopleContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
                  size={25}
                  onpress={() => navigation.navigate(item.navigate, { screenName: item.label })}
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
            {/* <TalkNowButton
              label="Connect Now"
              onPress={intiateRandomConnection}
            /> */}
          </View>
          <SwipeButtonComponent updateSwipeStatus={intiateRandomConnection} />
          <Text style={styles.infoText}>Swipe to connect to random caller</Text>
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
      <PermissionDenied visible={permission} permissionType={permissionType} close={() => { Linking.openSettings(); setpermission(false); }} />
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

  infoText: {
    fontFamily: fonts.NexaRegular,
    color: colors.darkGray,
    alignSelf: "center",
    fontSize: actuatedNormalize(12),
    marginTop: actuatedNormalize(5)
  }
});
