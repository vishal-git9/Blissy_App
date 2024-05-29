import messaging from '@react-native-firebase/messaging';
import { AppState } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import notifee, { EventType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import colors from '../constants/colors';
import { store } from '../redux';
import { pushChatlist } from '../redux/messageSlice';
import { serverBaseUrl } from './globalVariable';
import { UserInterface } from '../redux/uiSlice';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

// data: {
//   senderData: JSON.stringify(getNotificationSenderData[0]),
//   messageDetails:JSON.stringify({messageId,messageText})
// },

export const MarkMessageDelivered = async (messageId: string) => {
  console.log(messageId,"messageId----->")
  // try {
  //   const response = await axios.put(`${serverBaseUrl}/chat/markRead`,{messageIds:[messageId],updateType:"isDelivered"});
  //   return response.data;
  // } catch (error) {
  //   console.error('Error Marking Message Delivered:', error);
  //   throw error;
  // }
};

export const handleNotification = async (remoteMessage: any) => {
  console.log(remoteMessage,"BackgroundremoteMessage------>")
  const senderData = JSON.parse(remoteMessage.data?.senderData);
  const messageDetails = JSON.parse(remoteMessage.data?.messageDetails);
  MarkMessageDelivered(messageDetails.messageId)

  // const chatList = store.getState().Message.chatList
  // console.log(chatList,"Chatlist----->",AppState.currentState)
      // navigationRef?.current?.navigate('Chatlist');

  if (!messageDetails) {
    console.warn('No messageDetails in the notification payload');
    return;
  }

  // if (AppState.currentState === 'active' || AppState.currentState === 'background') {
  //   console.log('ForegroundBackgroundClick------->');
  //   // Do not fetch data; rely on Socket.io updates
  //   if (senderData && navigationRef.current) {
  //     navigationRef.current.navigate('Chatlist', { senderData });
  //   }
  // } else if (AppState.currentState === 'inactive') {
  //   console.log('App is in quit state, fetching updated data');
  //   try {
  //     // const updatedData = await fetchUpdatedData(dataKey);
  //     // console.log('Fetched updated data:', updatedData);
  //     // Handle the fetched data, e.g., update the state or local storage
  //     // store.dispatch(pushChatlist(updatedData))
  //     if (senderData && navigationRef.current) {
  //       navigationRef.current.navigate('Chatlist', { senderData });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data in quit state:', error);
  //   }
  // }

  // console.log(remoteMessage)
};

interface RemoteMessageI {
  data: {
    senderData: any;
    messageDetails?: any;
  };
}



const setupNotificationListener = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('FCM Message received:', remoteMessage);
    const RemoteMessage:RemoteMessageI = {
      data:{
        senderData:remoteMessage?.data?.senderData,
        messageDetails:remoteMessage.data?.messageDetails
      }
    }
    const senderData : UserInterface = JSON.parse(RemoteMessage.data.senderData);
    const messageDetails = JSON.parse(RemoteMessage.data.messageDetails);
    await handleNotification(remoteMessage);
    await notifee.displayNotification({
      title: senderData.name,
      body: messageDetails.messageText,
      data:{senderData : senderData},
      android: {
        channelId: "default8",
        smallIcon: 'ic_stat_name', // ensure this icon is in your drawable folder
        largeIcon: senderData.profilePic, // URL of the sender's profile picture
        color:colors.primary,
        circularLargeIcon:true,
        
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        categoryId: 'default',
        attachments: [
          {
            url: remoteMessage?.data?.profilePictureUrl as string, // URL of the sender's profile picture
            thumbnailHidden: false,
            
          },
        ],
      },
    });
  });
  // messaging().onNotificationOpenedApp(remoteMessage => {
  //   console.log('Notification caused app to open from background state:', remoteMessage);
  //   handleNotification(remoteMessage);
  // });

  // messaging()
  //   .getInitialNotification()
  //   .then(remoteMessage => {
  //     if (remoteMessage) {
  //       console.log('Notification caused app to open from quit state:', remoteMessage);
  //       handleNotification(remoteMessage);
  //     }
  //   });

  // notifee.onBackgroundEvent(async ({ type, detail }) => {
  //   const { notification, pressAction } = detail;
  //   if (type === EventType.ACTION_PRESS) {
  //     handleNotification(notification)
  //   }
  // });

  // notifee.onForegroundEvent(async ({ type, detail }) => {
  //   const { notification, pressAction } = detail;
  //   if (type === EventType.ACTION_PRESS && pressAction?.id === 'default') {
  //     handleNotification(BackgroundremoteMessage------>notification)
  //   }
  // });
  // notifee.getInitialNotification().then(notification => {
  //   if (notification) {
  //     console.log('Notification caused app to open from quit state:', notification);
  //     handleNotification(notification);
  //   }
  // });
  
};

export default setupNotificationListener;

// for fullscren like call

// fullScreen: {
//   title: 'Full-screen',
//   body: 'notification',
//   android: {
//     channelId: 'fullscreen',
//     // Recommended to set a category
//     category: AndroidCategory.CALL,
//     // Recommended to set importance to high
//     importance: AndroidImportance.HIGH,
//     visibility: AndroidVisibility.PUBLIC,
//     sound: 'default',
//     fullScreenAction: {
//       id: 'default',
//       // mainComponent: 'full-screen-main-component'
//       launchActivity: 'com.example.CustomActivity',
//     },
//   },
//   ios: {
//     sound: 'default',
//   },
// },