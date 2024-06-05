import * as React from 'react';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../container/Prelogin/onboarding';
import {Registration} from '../container/Registration/Registration';
import {RootStackParamList} from './navigatorType';
import {LoginScreen} from '../container/login/login';
import { HealerList } from '../common/healerList/healerlist';
import { Healerdetails } from '../common/healerList/healerdetails';
import {DrawerNavigator} from './Drawer';
import ChatListScreen from '../container/Connection/chatlist';
import ChatWindowScreen from '../container/Connection/chatwindow';
import ReviewScreen from '../container/Connection/review';
import CallListScreen from '../container/Connection/callList';
import GlobalBackHandler from './Globalbackhandler';
import VoiceCall from '../container/audioCall/audiocall';
import { ComingSoon } from '../container/comingsoon/comingsoon';
import { Coupons } from '../container/coupons/coupons';
import ChatPartnerDetails from '../container/Connection/chatPartnerDetails';
import CallScreen from '../common/call/incomingcallMain';
import { Linking } from 'react-native';
import { navigationRef } from '../utils/RootNavigation';
// import { navigationRef } from '../utils/notificationService';

const deepLinksConf = {
  screens: {
    HomeRoutes: {
      screens: {
        Chatlist: 'Chatlist',
        Chatwindow: 'Chatwindow',
      },
    },
  },
};

const linking: LinkingOptions = {
  prefixes: ['myapp://', 'https://app.myapp.com'],
  config: deepLinksConf,
  // async getInitialURL() {
  //   // Check if app was opened from a deep link
  //   const url = await Linking.getInitialURL();

  //   if (url != null) {
  //     return url;
  //   }

  //   // Check if there is an initial firebase notification
  //   const message = await messaging().getInitialNotification();

  //   // Get deep link from data
  //   // if this is undefined, the app will open the default/home page
  //   return message?.data?.link;
  // },
  // subscribe(listener) {
  //   const onReceiveURL = ({url}: {url: string}) => listener(url);

  //   // Listen to incoming links from deep linking
  //   Linking.addEventListener('url', onReceiveURL);

  //   // Listen to firebase push notifications
  //   const unsubscribeNotification = messaging().onNotificationOpenedApp(
  //     (message) => {
  //       const url = message?.data?.link;

  //       if (url) {
  //         // Any custom logic to check whether the URL needs to be handled

  //         // Call the listener to let React Navigation handle the URL
  //         listener(url);
  //       }
  //     },
  //   );

  //   return () => {
  //     // Clean up the event listeners
  //     Linking.removeEventListener('url', onReceiveURL);
  //     unsubscribeNotification();
  //   };
  // },
}


const Stack = createNativeStackNavigator<RootStackParamList>();

interface MainNavigatorProps {
  isLoggedIn: Boolean;
  isNewUser: Boolean;
}
const MainNavigator: React.FC<MainNavigatorProps> = ({
  isLoggedIn,
  isNewUser,
}) => {
  console.log(isLoggedIn,isNewUser,"isLoggedin")
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
       initialRouteName={
        isLoggedIn
          ? isNewUser
            ? 'Registration' // If the user is logged in and is a new user, navigate to the 'Registration' screen.
            : 'Drawer' // If the user is logged in but is not a new user, navigate to the 'Home' screen.
          : 'Onboarding' // If the user is not logged in, navigate to the 'Onboarding' screen.
      }
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationTypeForReplace: 'push',
          animation: 'slide_from_left',
          animationDuration: 2000,
          contentStyle: {backgroundColor: 'rgb(0, 0, 0)'},
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Healerlist" component={HealerList} />
        <Stack.Screen name="Healerdetails" component={Healerdetails} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="Chatlist" component={ChatListScreen} />
        <Stack.Screen name="Calllist" component={CallListScreen} />
        <Stack.Screen name="ChatWindow" component={ChatWindowScreen} />
        <Stack.Screen name="ReviewScreen" component={ReviewScreen} /> 
        <Stack.Screen name="AudioCallScreen" component={VoiceCall} /> 
        <Stack.Screen name="CouponsScreen" component={Coupons}/>
        <Stack.Screen name="ComingsoonScreen" component={ComingSoon} /> 
        <Stack.Screen name='ChatPartnerDetails' component={ChatPartnerDetails}/>
        {/* <Stack.Screen name="IncomingCall" component={CallScreen} />  */}
      </Stack.Navigator>
      <GlobalBackHandler/>
    </NavigationContainer>
  );
};

export default MainNavigator;
