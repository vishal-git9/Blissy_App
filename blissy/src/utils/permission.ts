import { PermissionsAndroid, PermissionStatus } from 'react-native';

export default async function requestBluetoothPermission(): Promise<boolean> {
  const granted: PermissionStatus = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "Bluetooth Permission",
      message:
        "This app needs access to your location " +
        "to discover and connect to Bluetooth devices.",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    }
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  } else {
    return false;
  }
}
