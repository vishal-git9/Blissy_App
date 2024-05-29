/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import notifee, { EventType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import { name as appName } from './app.json';
import colors from './src/constants/colors';
// import { handleNotification } from './src/utils/notificationService';
 var EventEmitter = require('eventemitter3');
 export const eventEmitter = new EventEmitter();

import * as RootNavigation from './src/utils/RootNavigation.js';
import { handleNotification } from './src/utils/notificationService';
import { UserInterface } from './src/redux/uiSlice';

interface RemoteMessageI {
  data: {
    senderData: any;
    messageDetails?: any;
  };
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
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
    // await handleNotification(remoteMessage);


    // notifee.getInitialNotification().then(notification => {
    //     if (notification) {
    //         console.log('Notification caused app to open from quit state:', notification);
    //         handleNotification(notification);
    //     }
    // });
});
notifee.onForegroundEvent(
    async ({ type, detail, }) => {
      console.log(
        `The type is`,
        type,
        "the detail is----->",
        detail
      );
      switch (type) {
        case EventType.PRESS:
          if (detail.notification) {
            eventEmitter.emit('notificationReceived',detail.notification.data);
          }
          break;
        case EventType.ACTION_PRESS:
          console.log(`It was an ACTION PRESS THO`)
          break;
      }
    }
  );

notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log(type, "BackgroundType1--->",EventType.PRESS,detail)

    const { notification, pressAction } = detail;
    if (type === EventType.PRESS) {
        console.log(type, "BackgroundTyoe--->",EventType.PRESS)
        eventEmitter.emit('notificationReceived',notification?.data);
    
        // await notifee.cancelNotification(notification?.id);
      }

    
});

AppRegistry.registerComponent(appName, () => App);
