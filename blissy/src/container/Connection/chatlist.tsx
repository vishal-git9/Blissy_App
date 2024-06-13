// ChatListScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationStackProps } from '../Prelogin/onboarding';
import colors from '../../constants/colors';
import { RouteBackButton } from '../../common/button/BackButton';
import { Image } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import { Badge } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveUserListSelector, ChatList, Message, MessageSelector, addMessage, chatListSelector, getActiveUserList, newMessagesSelector, pushChatlist } from '../../redux/messageSlice';
import { AuthSelector } from '../../redux/uiSlice';
import { formatDateTime } from '../../utils/formatedateTime';
import { useMarkReadMessageMutation } from '../../api/chatService';
import ChatItemSkeleton from '../../common/loader/skeleton';
import { Empty } from '../../common/Empty/Empty';
import moment from 'moment';

const ChatListScreen: React.FC<NavigationStackProps> = ({ navigation }) => {
  const newMessages = useSelector(MessageSelector);
  const chatlistdata = useSelector(chatListSelector);
  const { socket, user } = useSelector(AuthSelector);
   const loadItems = useRef<any[]>(new Array(5).fill(0))
  const dispatch = useDispatch();
  const { activeUserList } = useSelector(ActiveUserListSelector);
  // const findMyMessage = useCallback((message: Message, newChatlistdata: ChatList[]) => {
  //   console.log("message---->", message);
  //   console.log("newChatlistData---->", newChatlistdata);
  //   try {
  //     const newChatlist: ChatList[] = newChatlistdata.map((chatItem) => {
  //       const partnerMessages = message.senderId === chatItem.chatPartner._id;
  //       const partnerSocketId = activeUserList.find((el) => el.userId._id === chatItem.chatPartner._id);

  //       if (partnerMessages) {
  //         console.log("here----->", partnerSocketId);
  //         return { ...chatItem, newMessages: [...chatItem.newMessages, message], socketId: partnerSocketId?.socketId };
  //       }
  //       return chatItem;
  //     });

  //     console.log(newChatlist, "newChatlist--->");
  //     const newMessage = { ...message, sender: "them" };
  //     dispatch(addMessage(newMessage));
  //     dispatch(pushChatlist(newChatlist));
  //   } catch (error) {
  //     console.error("An error occurred---->", error);
  //     // Handle the error appropriately, such as logging or displaying an error message
  //   }
  const findNewMessage = useCallback(() => {

     const sortedChatlist = chatlistdata.sort((a,b)=>moment(a.newMessages[0]?.createdAt).diff(b.newMessages[0].createdAt))

     console.log(sortedChatlist,"sortedChatlist--->")
    
  }, [dispatch, chatlistdata]);

  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      findNewMessage()
    })
    return unsubscribe

  }, [navigation,chatlistdata]);


  console.log(newMessages, chatlistdata, "chatlistscreen==")

  const renderChatItem = ({ item }: { item: ChatList }) => {

    const newMessageIds: any[] = []
    const FindSender = () => {
      item.allMessages.forEach((el) => {
        if (el?.receiverId === user?._id && el?.isRead === false) {
          newMessageIds.push(el?._id)
          return;
        }

        return;
      })
    }

    FindSender()

    const socketId = activeUserList?.find((el) => el?.userId?._id === item?.chatPartner?._id)
    console.log(item.newMessages?.length, "item----->", item.newMessages, newMessageIds)



    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          // if(newMessageIds?.length > 0) {
          //   markRead(newMessageIds)
          // }
          navigation.navigate('ChatWindow', { socketId: socketId?.socketId, userDetails: item.chatPartner, Chats: item,senderUserId:null })
        }}
      >
        <Image source={{ uri: item.chatPartner.profilePic }} style={styles.avatar} />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{item.chatPartner.name}</Text>
          <View style={{ flexDirection: "row", columnGap: actuatedNormalize(10), alignItems: "center", marginTop: actuatedNormalize(5) }}>
            <Text style={styles.lastMessage}>{item.allMessages[item.allMessages?.length - 1].message}</Text>
            {newMessageIds?.length > 0 && <Badge size={20} style={{ backgroundColor: colors.primary, color: colors.white, fontFamily: fonts.NexaXBold }}>{newMessageIds?.length}</Badge>
            }
          </View>
        </View>
        <Text style={styles.timestamp}>{formatDateTime(item?.allMessages[item?.allMessages?.length - 1].createdAt,"Date_time")}</Text>
      </TouchableOpacity>
    )

  }

  return (
    <View style={styles.container}>
      <RouteBackButton onPress={() => navigation.goBack()} />
      <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(20) }}>Chats</Text>
      {/* Icons can be added here */}

      {
        false ? (
          loadItems.current.map(el => <ChatItemSkeleton />)) : (
          chatlistdata.length >0  ? <FlatList
            data={chatlistdata}
            contentContainerStyle={{
              rowGap: actuatedNormalize(10),
              marginHorizontal: actuatedNormalize(10),
              marginTop: actuatedNormalize(40),
            }}
            keyExtractor={item => item.chatPartner._id}
            renderItem={renderChatItem}
          /> : <Empty/>
          )
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: actuatedNormalize(20)
  },
  //   headerTitle: {
  //     fontSize: 24,
  //     fontWeight: 'bold',
  //   },
  chatItem: {
    flexDirection: 'row',
    padding: actuatedNormalize(15),
    borderRadius: actuatedNormalize(10),
    borderBottomColor: '#ececec',
    backgroundColor: colors.dark, // Assuming a white background for each chat item
    alignItems: 'center',
  },
  avatar: {
    width: actuatedNormalize(60),
    height: actuatedNormalize(60),
    borderRadius: actuatedNormalize(30), // Makes it circular
    marginRight: actuatedNormalize(15),
  },
  chatDetails: {
    flex: 1,
    rowGap: actuatedNormalize(5),
  },
  chatName: {
    fontSize: actuatedNormalize(18),
    color: colors.white,
    fontFamily: fonts.NexaBold,
  },
  lastMessage: {
    color: colors.gray,
    fontSize: actuatedNormalize(14),
  },
  timestamp: {
    color: colors.gray,
    fontSize: actuatedNormalize(12),
  },
});

export default ChatListScreen;
