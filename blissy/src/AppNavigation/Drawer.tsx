import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {Userprofile} from '../container/DrawerScreens/Userprofile';
import {Help} from '../container/DrawerScreens/help';
import {HomeScreen} from '../container/Home/HomeScreen';
import colors from '../constants/colors';
import CustomDrawer from '../common/drawer/customdrawer';
import {fonts} from '../constants/fonts';
import {actuatedNormalize} from '../constants/PixelScaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
export const Drawer = createDrawerNavigator();

export const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: colors.black},
        sceneContainerStyle: {backgroundColor: colors.black},
        drawerType: 'slide',
        swipeEnabled: true,
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.white,
        drawerItemStyle: {
          borderRadius: actuatedNormalize(10),
          paddingHorizontal: actuatedNormalize(5),
        },
        drawerInactiveTintColor: colors.gray,
        drawerLabelStyle: {
          fontFamily: fonts.NexaBold,
          marginLeft: actuatedNormalize(-15),
          fontSize: actuatedNormalize(16),
        },
        drawerAllowFontScaling: true,
      }}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        options={{
          drawerIcon: ({}) => (
            <Ionicons name="home" size={24} color={colors.white} />
          ),
        }}
        component={HomeScreen}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({}) => (
            <AntDesign name="user" size={24} color={colors.white} />
          ),
        }}
        name="Profile"
        component={Userprofile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({}) => (
            <Octicons name="stack" size={24} color={colors.white} />
          ),
          title:"Call History"
        }}
        name="Callhistory"
        component={Help}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({}) => (
            <Ionicons name="chatbox" size={24} color={colors.white} />
          ),
          title:"Chat room"
        }}
        name="Chatroom"
        component={Help}
      />
         {/* <Drawer.Screen
        options={{
          drawerIcon: ({}) => (
            <Ionicons name="bug" size={24} color={colors.white} />
          ),
          title:"Report a Problem"
        }}
        name="Help"
        component={Help}
      /> */}
    </Drawer.Navigator>
  );
};
