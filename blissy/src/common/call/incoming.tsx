// src/notifications.ts
import notifee, { AndroidImportance, AndroidCategory, AndroidVisibility } from '@notifee/react-native';

interface DisplayCallNotificationAndroidProps {
  callId: string;
  callerName: string;
  hasVideo: boolean;
}

export const displayCallNotificationAndroid = async ({
  callId,
  callerName,
  hasVideo,
}: DisplayCallNotificationAndroidProps): Promise<void> => {
  console.log('📞 📥  displayCallNotificationAndroid: ', callId);

  // const channelId = await notifee.createChannel({
  //   id: 'nugget-calls',
  //   name: 'nugget-calls',
  //   importance: AndroidImportance.HIGH,
  // });

  const dnr = await notifee.displayNotification({
    title: callerName,
    body: `is calling you on ${hasVideo ? 'video' : 'voice'}...`,
    id: callId,
    android: {
      channelId:"nuggets-call2",
      smallIcon: 'ic_stat_name',
      color: '#dedede',
      loopSound:true,
      ongoing:true,
      timeoutAfter:10000,
      category: AndroidCategory.CALL,
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: "default",
        // launchActivity: 'com.blissy.CustomActivity',
        // mainComponent:"custom"
        launchActivity: 'default',
    },
      fullScreenAction: {
        id: 'default',
        // launchActivity: 'com.blissy.CustomActivity',
        // mainComponent:"custom"
        launchActivity: 'default',

    },
      actions: [
        {
          title: 'Decline',
          pressAction: {
            id: 'decline-call',
          },
        },
        {
          title: 'Answer',
          pressAction: {
            id: 'answer-call',
            launchActivity: 'default',
          },
        },
      ],
      lightUpScreen: true,
      colorized: true,
    },
  });
  console.log('🔭 displayNotification result: ', dnr);
};
