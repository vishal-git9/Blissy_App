import { Platform } from 'react-native';
import {request, PERMISSIONS, Permission } from 'react-native-permissions';

  export const requestBluetoothPermission = async () => {

  let permission: Permission;

  if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  } else if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  } else {
    console.error("Unsupported platform");
    return false;
  }


    await request(permission);
}

export const requestMicrophonePermission = async () => {
  let permission: Permission;

  if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
  } else if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.MICROPHONE;
  } else {
    console.error("Unsupported platform");
    return false; 
  }

     await request(permission);

}

