import { Platform } from 'react-native';
import {request, PERMISSIONS, Permission, requestMultiple } from 'react-native-permissions';

  export const requestBluetoothPermission = async () => {

   let permission: Permission[];

  if (Platform.OS === 'android') {
    permission = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,PERMISSIONS.ANDROID.RECORD_AUDIO];
  } else if (Platform.OS === 'ios') {
    permission = [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,PERMISSIONS.IOS.MICROPHONE];
  } else {
    console.error("Unsupported platform");
    return false;
  }


    await requestMultiple(permission);
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

export const requestMultplePermissions =async()=>{
  let permission: Permission[];

  if (Platform.OS === 'android') {
    permission = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,PERMISSIONS.ANDROID.RECORD_AUDIO];
  } else if (Platform.OS === 'ios') {
    permission = [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,PERMISSIONS.IOS.MICROPHONE];
  } else {
    console.error("Unsupported platform");
    return false;
  }


  let response = await requestMultiple(permission);
  console.log(response,"from permission ts fle")
  // return response;
}