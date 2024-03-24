import Sound from 'react-native-sound';

const playNotificationSound = (): void => {
  // Define a new Sound object
  const notificationSound = new Sound(require("../../../assets/sounds/level-up.mp3"), (error?: Error) => {
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
    }
    console.log("sounded played success")
  });
};

export default playNotificationSound;
