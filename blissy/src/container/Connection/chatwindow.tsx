import React, { useState, useRef, useEffect } from 'react';
import { BackHandler, Image } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { NavigationStackProps } from '../Prelogin/onboarding';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { RouteBackButton2 } from '../../common/button/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageSelector, addMessage, chatScreenActiveSelector, resetMessageCount, setChatScreenActive } from '../../redux/messageSlice';
import { useDispatch, useSelector } from 'react-redux';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChatWindow'>;


interface Message {
  id: string;
  text: string;
  sender: string;
}

interface ProfileScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: ProfileScreenRouteProp;
}

// Sample starting messages
// const initialMessages: Message[] = [
//   { id: '1', text: 'Yes sure but this is not something I like though.', sender: 'them' },
//   { id: '2', text: "Okay, No problem! We can provide you other options.", sender: 'me' },
//   { id: '3', text: "That's Great! Thanks.", sender: 'them' },
//   { id: '4', text: "You're Welcome!", sender: 'me' },
// ];

const ChatWindowScreen: React.FC<ProfileScreenProps> = ({navigation,route}) => {
  const { userDetails,socketId ,socket} = route.params;
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [istyping,setIsTyping] = useState<boolean>(false)
  const yValue = useRef(new Animated.Value(0)).current;

  const messages = useSelector(MessageSelector);

  const dispatch = useDispatch()
  console.log(socket)
  // Function to send a messagce
  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'me',
      };
      yValue.setValue(0); // Reset the animation
      dispatch(addMessage(newMessage));
      socket.emit('privateMessageSendSuccessful', {message: newMessage,userid:socketId }); //calling the sockets
      setInputText('');
      flatListRef.current?.scrollToEnd({ animated: true }); // Scroll to the end to show new message

      // Animate the new message sliding in
      Animated.timing(yValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };


  useEffect(()=>{
    socket.on("notify_typing_state",()=>{
      console.log("hi")
      setIsTyping(true)
    })

    return ()=>{
      socket.off("notify_typing_state")
    }
  },[])


    
  useEffect(()=>{
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dispatch(resetMessageCount())
        return false; // Return true to prevent default behavior (going back)
      }
    );
    return () => backHandler.remove();
  })

  // Render each chat message
  const renderMessageItem = ({ item,index }: { item: Message,index: number }) => {
    const isLastMessage = index === messages.length;

    const messageStyle = isLastMessage
      ? {
          transform: [{ translateY: yValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0] // Adjust values as needed
          })}],
          opacity: yValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1]
          })
        }
      : {};
    return (
      <Animated.View
        style={[
          styles.messageBubble,
          item.sender === 'me' ? styles.myMessage : styles.theirMessage,
          messageStyle
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <RouteBackButton2 onPress={()=>{
              dispatch(setChatScreenActive(false))
              dispatch(resetMessageCount())
              navigation.goBack()
            }}/>
        <View style={styles.headerContent}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.avatar} />
          <View>
          <Text style={styles.userName}>{userDetails?.name}</Text>
          <Text style={styles.userStatus}>{istyping ? "Typing...":"online"}</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}

      >
        <FlatList
          ref={flatListRef}
          data={messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={{marginTop:actuatedNormalize(10)}}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={(text)=>{
              socket.emit("private_typing_state",socketId)
              setInputText(text)
            }}
            placeholder="Type here..."
            style={styles.input}
            placeholderTextColor={colors.gray}
            
          />
          <TouchableOpacity style={styles.iconContainer} onPress={sendMessage}>
            <MaterialCommunityIcons style={styles.sendIcon} name='send-circle' size={40}/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  messageBubble: {
    padding: actuatedNormalize(10),
    borderRadius: actuatedNormalize(20),
    marginVertical: actuatedNormalize(10),
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    marginRight: actuatedNormalize(20),
  },
  theirMessage: {
    backgroundColor: colors.dark,
    marginLeft: actuatedNormalize(20),
  },
  messageText: {
    fontSize: actuatedNormalize(16),
    color:colors.white,
    fontFamily:fonts.NexaRegular
  },
  inputContainer: {
    flexDirection: 'row',
    // backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 20, // Updated to make the container rounded
    margin: 10,
    color:colors.black,
    position:"relative",
  },
  
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color:colors.white,
    borderRadius: 20, // Updated for rounded corners
    backgroundColor: colors.dark, // Updated for the input background color
    // Remove borderWidth and borderColor if previously set
  },

  iconContainer:{
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  
  sendIcon: {
    color: colors.lightGray, // Example color for the icon
    // Rest of the styles remain unchanged
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:actuatedNormalize(20),
    marginLeft:actuatedNormalize(20),
    columnGap:actuatedNormalize(15)
    // backgroundColor:colors.dark,
    // marginHorizontal:actuatedNormalize(10),borderRadius:actuatedNormalize(10)
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems:"center",
    columnGap:actuatedNormalize(10)
  },
  backButton: {
    fontSize: 18,
    color: '#fff',
    padding: 8,
    marginLeft: 10,
  },
  userName: {
    fontSize: actuatedNormalize(16),
    color:colors.white,
    fontFamily:fonts.NexaRegular,
  },
  userStatus:{
    fontSize: actuatedNormalize(14),
    color:colors.white,
    fontFamily:fonts.NexaRegular,
  },
  avatar:{
    width: actuatedNormalize(45),
    height: actuatedNormalize(45),
    borderRadius: actuatedNormalize(30), // Makes it circular
  }
});

export default ChatWindowScreen;
