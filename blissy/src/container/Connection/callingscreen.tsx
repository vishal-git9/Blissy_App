import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {fonts} from '../../constants/fonts';
import AnimatedCounter from '../../common/counter/counter';
import {NavigationStackProps} from '../Prelogin/onboarding';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserInterface } from '../../redux/uiSlice';
import { IconButton } from '../../common/button/iconbutton';
import ChatWindowScreen from './chatwindow';
import UserProfile from '../DrawerScreens/Userprofile';
import { Socket } from 'socket.io-client';

interface IconContainerProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  leave:()=>void;
  toggleMic:()=>void;
  toggleSpeaker:()=>void;
  ConnectedUserData:UserInterface | null;
  speakerEnabled:boolean;
  muteEnabled:boolean;
}

interface CallingScreenProps extends IconContainerProps {
  socketId:string| null;
  socket:Socket;
}

const IconContainer: React.FC<IconContainerProps> = ({ConnectedUserData,navigation,leave,toggleMic,toggleSpeaker,speakerEnabled,muteEnabled}) => {
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity style={[styles.icon, styles.leftIcon,{backgroundColor:muteEnabled ? colors.primary : colors.white}]} onPress={toggleMic}>
        {/* Add your left icon here */}
        <Entypo name="sound-mute" color={muteEnabled ? colors.white : colors.black} size={30} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.icon, styles.middleIcon]}
        onPress={() =>{
          leave()
          navigation.navigate('ReviewScreen', {name: ConnectedUserData?.name})
        }
        }>
        {/* Add your middle icon here */}
        <MaterialIcons name="call-end" color={'white'} size={30} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.icon, styles.rightIcon,{backgroundColor:speakerEnabled ? colors.primary : colors.white}]} onPress={toggleSpeaker}>
        {/* Add your right icon here */}
        <Entypo name="sound" color={speakerEnabled ? colors.white : colors.black} size={30} />
      </TouchableOpacity>
    </View>
  );
};

const CallingScreen: React.FC<CallingScreenProps> = ({navigation,leave,toggleMic,ConnectedUserData,toggleSpeaker,socketId,socket}) => {
  const [seconds, setSeconds] = useState(0);
  const [mute,setMute] = useState(false);
  const [speaker,setSpeaker] = useState(false)
const [userChannel,setUserChannel] = useState<string>("Call")

  const handleToggleMic = ()=>{
    toggleMic()
    setMute(!mute)
  }
  const handleToggleSpeaker = ()=>{
    toggleSpeaker()
    setSpeaker(!speaker)
  }

  // switch (userChannel) {
  //   case "Chat" :
  //     return <ChatWindowScreen navigation={navigation} />
  //   case "Profile" :
  //     return <UserProfile navigation={navigation}/>
  // }
  return (
    <SafeAreaView style={styles.container}>
      {/* User section */}
      <View style={styles.userSection}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.connectedText}>You connected with {ConnectedUserData?.name}</Text>
          <Text style={styles.timeText}>
            {Math.floor(seconds / 60)
              .toString()
              .padStart(2, '0')}{' '}
            mins ago
          </Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image
            blurRadius={10}
            source={{uri: 'https://randomuser.me/api/portraits/women/2.jpg'}} // Replace with actual image path
            style={styles.avatar}
          />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center',width:"100%"}}>
          <Text style={styles.knowText}>
            Know What {ConnectedUserData?.name} and You have common
          </Text>
          <TouchableOpacity style={styles.readReceiptsButton}  >
            <Text style={styles.readReceiptsText}>View Profile</Text>
          </TouchableOpacity>
            <IconButton
            IconProvider={MaterialIcons}
            iconame="chat"
            label="Chat"
            iconcolor={colors.white}
            onpress={() => navigation.navigate("ChatWindow",{userDetails:ConnectedUserData,socketId:socketId,socket:socket})}   
               size={18}
            styles={styles.SecondaryButton}
            textSize={actuatedNormalize(18)}
            textcolor={colors.white}
          />
          {/* <TouchableOpacity style={styles.readReceiptsButton}>
            <Text style={styles.readReceiptsText}>View Profile</Text>
          </TouchableOpacity> */}
        </View>
        <AnimatedCounter seconds={seconds} setSeconds={setSeconds} />
      </View>

      {/* Action buttons */}
      <IconContainer speakerEnabled={speaker} muteEnabled={mute} ConnectedUserData={ConnectedUserData} navigation={navigation} leave={leave} toggleMic={handleToggleMic} toggleSpeaker={handleToggleSpeaker}  />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black, 
    paddingVertical:actuatedNormalize(10)
  },
  userSection: {
    flex: 1,
    marginTop:actuatedNormalize(50),
    alignItems: 'center',
    rowGap: actuatedNormalize(20),
  },
  connectedText: {
    fontSize: actuatedNormalize(22),
    fontFamily: fonts.NexaBold,
    color: colors.white,
  },
  timeText: {
    fontSize: actuatedNormalize(16),
    color: colors.gray,
    fontFamily: fonts.NexaRegular,
  },
  avatar: {
    width: actuatedNormalize(110),
    height: actuatedNormalize(110),
    borderRadius: actuatedNormalize(60),
    alignSelf: 'center',
  },
  avatarContainer: {
    width: actuatedNormalize(120),
    height: actuatedNormalize(120),
    borderRadius: actuatedNormalize(60),
    borderWidth: 3,
    justifyContent: 'center',
    borderColor: colors.primary,
  },
  knowText: {
    fontSize: actuatedNormalize(16),
    color: colors.lightGray,
    textAlign: 'center',
    width:"80%",
    lineHeight:actuatedNormalize(20),
    fontFamily: fonts.NexaRegular,
    marginBottom: actuatedNormalize(16),
  },
  readReceiptsButton: {
    backgroundColor: '#fff',
    borderRadius: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(10),
  },
  readReceiptsText: {
    color: colors.black,
    fontSize: actuatedNormalize(16),
    fontFamily: fonts.NexaBold,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 40,
  },
  micIcon: {
    fontSize: 36,
    color: '#fff',
  },
  messageIcon: {
    fontSize: 36,
    color: '#fff',
  },
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'space-around',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 50,
    height: 50,
  },
  middleIcon: {
    position: 'relative',
    top: -30,
    backgroundColor: colors.red,
    borderRadius: 50,
    alignSelf: 'center',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  rightIcon: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 50,
    height: 50,
  },

  SecondaryButton: {
    borderRadius: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginTop:actuatedNormalize(10),
    borderColor: colors.lightGray,
    columnGap: actuatedNormalize(10),
  },
});

export default CallingScreen;
