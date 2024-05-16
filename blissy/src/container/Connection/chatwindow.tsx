import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Animated as NativeAnimated,
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
import { ChatList, Message, MessageSelector, addMessage, chatListSelector, chatScreenActiveSelector, pushChatlist, resetMessageCount, setChatScreenActive } from '../../redux/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';
import moment from 'moment';
import { useGetChatlistQuery, useMarkReadMessageMutation, useSendMessageMutation } from '../../api/chatService';
import generateRandomId from '../../utils/randomIdGenerator';
import Animated, { SharedTransition, withSpring }  from 'react-native-reanimated';

const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    // originX: withSpring(values.targetOriginX),
    // originY: withSpring(values.targetOriginY),
  };
});

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChatWindow'>;


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

const ChatWindowScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userDetails, socketId, Chats } = route.params;
  const currentTime = moment();
  const messageTimestamp = currentTime.format();
  const { socket, user } = useSelector(AuthSelector)
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const chatlistdata = useSelector(chatListSelector);
  const [markRead, { }] = useMarkReadMessageMutation()
  const [istyping, setIsTyping] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout>();
  const yValue = useRef(new NativeAnimated.Value(0)).current;
  const [sendMsg, { isError, isLoading, isSuccess, reset, data }] = useSendMessageMutation()

  const messages = useSelector(MessageSelector);

  console.log(userDetails, socketId, messages, "params------>", Chats)
  const dispatch = useDispatch()


  const addMyMessage = useCallback((message: Message, newChatlistdata: ChatList[]) => {
    console.log("message---->", message);
    console.log("newChatlistData---->", newChatlistdata);
    try {
      const newChatlist: ChatList[] = newChatlistdata.map((chatItem) => {
        const myMessage = message.receiverId === chatItem.chatPartner._id;

        if (myMessage) {
          return { ...chatItem, newMessages: [...chatItem.newMessages, message] };
        }
        return chatItem;
      });

      console.log(newChatlist, "newChatlistinWindow--->");
      const newMessage = { ...message, sender: "them" };
      // dispatch(addMessage(newMessage));
      dispatch(pushChatlist(newChatlist));
    } catch (error) {
      console.error("An error occurred---->", error);
      // Handle the error appropriately, such as logging or displaying an error message
    }
  }, [dispatch, chatlistdata.length]);


  const MarkMessageRead = useCallback(async (newMessages: Message[] | undefined) => {
    console.log(newMessages, "newMessages2------>")
    const newMessageIds: any[] = []
      newMessages?.forEach((el) => {
        if (el.receiverId === user?._id && el.isRead === false) {
          newMessageIds.push(el.messageId)
          return;
        }

        return;
      })
    console.log(newMessageIds, "newMessageIds---->")

    newMessageIds.length > 0 && await markRead(newMessageIds)
  }, [chatlistdata.length])

  // Function to send a messagce
  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        messageId: generateRandomId(24),
        senderId: user?._id,
        receiverId: userDetails?._id,
        isRead: false,
        // chatId:  Chats.newMessagesId,
        message: inputText.trim(),
        createdAt: messageTimestamp,
      };
      yValue.setValue(0); // Reset the animation
      Chats ?  addMyMessage(newMessage, chatlistdata) : dispatch(addMessage(newMessage)); // dispatching message into global message

      //adding my message to chatlist newMessages

      if (socketId) { // if user is online 
        console.log("message sent")
        socket?.emit('privateMessageSendSuccessful', { message: newMessage, userid: socketId }); //calling the sockets
        socket?.emit("private_typing_state", { socketId, typingState: false })
        sendMsg(newMessage)
      } else { // if user is offline
        sendMsg(newMessage)
      }
      setInputText('');
      flatListRef.current?.scrollToEnd({ animated: true }); // Scroll to the end to show new message

      // Animate the new message sliding in
      NativeAnimated.timing(yValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };


  useEffect(() => {
    if (Chats) {
      const newMessages = chatlistdata.find((el) => el.chatPartner._id === Chats.chatPartner._id)?.newMessages
      timerRef.current = setTimeout(() => {
        MarkMessageRead(newMessages)
      }, 1000);
    }

    socket?.on("notify_typing_state", (typingState: boolean) => {
      console.log("hi")
      setIsTyping(typingState)
    })

    return () => {
      socket?.off("notify_typing_state")
      clearTimeout(timerRef.current)
    }
  }, [chatlistdata])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dispatch(resetMessageCount())
        return false; // Return true to prevent default behavior (going back)
      }
    );
    return () => backHandler.remove();
  }, [])

  // Render each chat message
  const renderMessageItem = ({ item, index }: { item: Message, index: number }) => {


    console.log(item, "itemchat----->", chatlistdata, messages)

    const isLastMessage = index === (Chats ? chatlistdata.filter((el) => el.chatPartner._id === Chats.chatPartner._id)[0].newMessages.length : messages.length);

    const messageStyle = isLastMessage
      ? {
        transform: [{
          translateY: yValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0] // Adjust values as needed
          })
        }],
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
          item.senderId === user?._id ? styles.myMessage : styles.theirMessage,
          messageStyle
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </Animated.View>
    );
  };

  // console.log(messages.filter((el) => (el.senderId === userDetails?._id && el.receiverId === user?._id || el.senderId === user?._id && el.receiverId === userDetails?._id)), "messages---->")
  const getItemLayout = (data:any, index:any) => (
    { length: actuatedNormalize(70), offset: actuatedNormalize(70) * index, index } // assuming each item has a height of 70
  );
  const lastMessageIndex = Chats ? chatlistdata.filter((el) => el.chatPartner._id === Chats.chatPartner._id)[0].newMessages.length - 1 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <RouteBackButton2 onPress={async () => {
          socket?.emit("private_typing_state", { socketId, typingState: false })
          navigation.goBack()
        }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerContent} onPress={()=>navigation.navigate('ChatPartnerDetails', {chatPartner:userDetails})}>
          <Animated.Image style={styles.avatar} source={{uri:userDetails?.profilePic}} sharedTransitionTag='profile' />
          {/* <Image source={{ uri: userDetails?.profilePic }} style={styles.avatar} /> */}
          <View>
            <Animated.Text style={styles.userName} sharedTransitionTag='ChatPartnerName'>{userDetails?.name}</Animated.Text>
            <Text style={styles.userStatus}>{istyping ? "Typing..." : socketId ? "online" : "offline"}</Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}

      >
        <FlatList
          ref={flatListRef}
          data={Chats ? chatlistdata.filter((el) => el.chatPartner._id === Chats.chatPartner._id)[0].newMessages : messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.messageId}
          renderItem={renderMessageItem}
          contentContainerStyle={{ marginTop: actuatedNormalize(10), paddingBottom: actuatedNormalize(10) }}
          initialScrollIndex={lastMessageIndex}
          getItemLayout={getItemLayout}
          onLayout={() => flatListRef.current?.scrollToIndex({ index: lastMessageIndex, animated: true })}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50, // render items when at least 50% of the item is visible
          }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={(text) => {
              socket?.emit("private_typing_state", { socketId, typingState: true })
              setInputText(text)
            }}
            placeholder="Type here..."
            style={styles.input}
            placeholderTextColor={colors.gray}

          />
          <TouchableOpacity style={styles.iconContainer} onPress={sendMessage}>
            <MaterialCommunityIcons style={styles.sendIcon} name='send-circle' size={40} />
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
    color: colors.white,
    fontFamily: fonts.NexaRegular
  },
  inputContainer: {
    flexDirection: 'row',
    // backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 20, // Updated to make the container rounded
    margin: 10,
    color: colors.black,
    position: "relative",
  },

  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: colors.white,
    borderRadius: 20, // Updated for rounded corners
    backgroundColor: colors.dark, // Updated for the input background color
    // Remove borderWidth and borderColor if previously set
  },

  iconContainer: {
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
    marginTop: actuatedNormalize(20),
    marginLeft: actuatedNormalize(20),
    columnGap: actuatedNormalize(15)
    // backgroundColor:colors.dark,
    // marginHorizontal:actuatedNormalize(10),borderRadius:actuatedNormalize(10)
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    columnGap: actuatedNormalize(10),
    padding:actuatedNormalize(5)
  },
  backButton: {
    fontSize: 18,
    color: '#fff',
    padding: 8,
    marginLeft: 10,
  },
  userName: {
    fontSize: actuatedNormalize(16),
    color: colors.white,
    fontFamily: fonts.NexaRegular,
  },
  userStatus: {
    fontSize: actuatedNormalize(14),
    color: colors.white,
    fontFamily: fonts.NexaRegular,
  },
  avatar: {
    width: actuatedNormalize(45),
    height: actuatedNormalize(45),
    borderRadius: actuatedNormalize(30), // Makes it circular
  }
});

export default ChatWindowScreen;
