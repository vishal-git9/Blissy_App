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
import playNotificationSound from '../../common/sound/notification';
import { formatDateTime } from '../../utils/formatedateTime';
import { useGetChatlistQuery, useMarkReadMessageMutation } from '../../api/chatService';
import ChatItemSkeleton from '../../common/loader/skeleton';

const ChatListScreen: React.FC<NavigationStackProps> = ({ navigation }) => {
  const newMessages = useSelector(MessageSelector);
  const chatlistdata = useSelector(chatListSelector);
  const { socket, user } = useSelector(AuthSelector);
  const loadItems = useRef<any[]>(new Array(5).fill(0))
  const dispatch = useDispatch();
  const { refetch, data: newChatlistData ,isLoading,isFetching} = useGetChatlistQuery(user?._id)
  // const [markRead,{isError,isLoading,isSuccess}] = useMarkReadMessageMutation()
  const { activeUserList } = useSelector(ActiveUserListSelector);
console.log(newChatlistData,"----->chatdata",isFetching)
  const findMyMessage = useCallback((message: Message, newChatlistdata: ChatList[]) => {
    console.log("message---->", message);
    console.log("newChatlistData---->", newChatlistdata);
    try {
      const newChatlist: ChatList[] = newChatlistdata.map((chatItem) => {
        const partnerMessages = message.senderId === chatItem.chatPartner._id;
        const partnerSocketId = activeUserList.find((el) => el.userId._id === chatItem.chatPartner._id);

        if (partnerMessages) {
          console.log("here----->", partnerSocketId);
          return { ...chatItem, newMessages: [...chatItem.newMessages, message], socketId: partnerSocketId?.socketId };
        }
        return chatItem;
      });

      console.log(newChatlist, "newChatlist--->");
      const newMessage = { ...message, sender: "them" };
      dispatch(addMessage(newMessage));
      dispatch(pushChatlist(newChatlist));
    } catch (error) {
      console.error("An error occurred---->", error);
      // Handle the error appropriately, such as logging or displaying an error message
    }
  }, [dispatch, activeUserList, chatlistdata.length]);

  useEffect(() => {
    socket?.on("privateMessageSuccessfulAdd", (newMessages) => {
      console.log("newMessage----->", newMessages);
      findMyMessage(newMessages, chatlistdata);
      console.log("newMessage2----->", newMessages);
      playNotificationSound();
    });
    socket?.on('newActiveUser', (user) => {
      dispatch(getActiveUserList(user))
      console.log(user, "activeUserList new-------->")
    })
    return () => {
      socket?.off("privateMessageSuccessfulAdd")
      socket?.off("newActiveUser")
    }

  }, [chatlistdata, socket]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await refetch().then((res) => dispatch(pushChatlist(res.data.chatList))).catch((err) => console.log(err))
    })
    return unsubscribe

  }, [navigation]);


  console.log(newMessages, chatlistdata, "chatlistscreen==")

  const renderChatItem = ({ item }: { item: ChatList }) => {

    const newMessageIds: any[] = []
    const FindSender = () => {
      item.newMessages.forEach((el) => {
        if (el.receiverId === user?._id && el.isRead === false) {
          newMessageIds.push(el._id)
          return;
        }

        return;
      })
    }

    FindSender()

    const socketId = activeUserList.filter((el) => el.userId._id === item.chatPartner._id)
    console.log(item.newMessages.length, "item----->", item.newMessages, newMessageIds)



    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          // if(newMessageIds.length > 0) {
          //   markRead(newMessageIds)
          // }
          navigation.navigate('ChatWindow', { socketId: socketId[0]?.socketId, userDetails: item.chatPartner, Chats: item })
        }}
      >
        <Image source={{ uri: item.chatPartner.profilePic }} style={styles.avatar} />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{item.chatPartner.name}</Text>
          <View style={{ flexDirection: "row", columnGap: actuatedNormalize(10), alignItems: "center", marginTop: actuatedNormalize(5) }}>
            <Text style={styles.lastMessage}>{item.newMessages[item.newMessages.length - 1].message}</Text>
            {newMessageIds.length > 0 && <Badge size={20} style={{ backgroundColor: colors.primary, color: colors.white, fontFamily: fonts.NexaXBold }}>{newMessageIds.length}</Badge>
            }
          </View>
        </View>
        <Text style={styles.timestamp}>{formatDateTime(item?.newMessages[item?.newMessages?.length - 1].createdAt)}</Text>
      </TouchableOpacity>
    )

  }

  return (
    <View style={styles.container}>
      <RouteBackButton onPress={() => navigation.goBack()} />
      <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(20) }}>Chats</Text>
      {/* Icons can be added here */}

      {
        isFetching ? (
          loadItems.current.map(el => <ChatItemSkeleton />)) : (<FlatList
            data={chatlistdata}
            contentContainerStyle={{
              rowGap: actuatedNormalize(10),
              marginHorizontal: actuatedNormalize(10),
              marginTop: actuatedNormalize(40),
            }}
            keyExtractor={item => item.chatPartner._id}
            renderItem={renderChatItem}
          />)
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
