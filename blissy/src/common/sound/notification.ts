import Sound from 'react-native-sound';

const playNotificationSound = (): void => {
  // Define a new Sound object
  Sound.setCategory('Playback');

  const notificationSound = new Sound("level-up.mp3", Sound.MAIN_BUNDLE,(error?: Error) => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
    console.log('Sound loaded successfully');
  });

  // Play the notification sound
  notificationSound.play((success: boolean) => {
    if (!success) {
      console.log('Failed to play the sound');
    }else{
      console.log("sounded played success")
    }
  });

  notificationSound.release()
};

export default playNotificationSound;
