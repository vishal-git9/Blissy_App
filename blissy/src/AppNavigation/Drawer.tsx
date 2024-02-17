import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {Userprofile} from '../container/DrawerScreens/Userprofile';
import {Help} from '../container/DrawerScreens/help';
import {HomeScreen} from '../container/Home/HomeScreen';
import colors from '../constants/colors';
import CustomDrawer from '../common/drawer/customdrawer';
import { fonts } from '../constants/fonts';
import { actuatedNormalize } from '../constants/PixelScaling';

export const Drawer = createDrawerNavigator();

export const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: colors.dark},
        sceneContainerStyle: {backgroundColor: colors.black},
        drawerType: 'slide',
        swipeEnabled: true,
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.white,
        drawerItemStyle:{borderRadius:actuatedNormalize(10)},
        drawerInactiveTintColor: colors.gray,
        drawerLabelStyle: {
          fontFamily: fonts.NexaBold,
          fontSize: actuatedNormalize(16),
        }
      }}
      initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={Userprofile} />
      <Drawer.Screen name="Help" component={Help} />
    </Drawer.Navigator>
  );
};
