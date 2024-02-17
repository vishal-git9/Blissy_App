import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {fonts} from '../../constants/fonts';
const CustomDrawer: React.FC<any> = props => {
  return (
    <View style={{flex: 1, marginTop: actuatedNormalize(15)}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.shadowBox}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Image
              source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
                marginBottom: 10,
              }}
            />
            <View style={{flexDirection:"row",columnGap:actuatedNormalize(5)}}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: actuatedNormalize(14),
                  fontFamily: fonts.NexaRegular,
                  marginRight: actuatedNormalize(5),
                }}>
                280
              </Text>
              <FontAwesome5 name="coins" size={14} color={colors.yellow} />
            </View>
          </View>
          <Text
            style={{
              color: colors.white,
              fontSize: actuatedNormalize(18),
              fontFamily: fonts.NexaRegular,
              marginBottom: actuatedNormalize(5),
            }}>
            John Doe
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.gray,
                fontSize: actuatedNormalize(14),
                fontFamily: fonts.NexaRegular,
                marginRight: actuatedNormalize(5),
              }}>
              9106517547
            </Text>
          </View>
        </View>
        <View style={{flex: 1, paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: actuatedNormalize(20), borderTopWidth: 1, borderTopColor: colors.gray}}>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center',columnGap:actuatedNormalize(5)}}>
            <Ionicons name="share-social-outline" size={22} color={colors.white} />
            <Text
              style={{
                fontSize: actuatedNormalize(16),
                fontFamily: fonts.NexaRegular,
                marginLeft: actuatedNormalize(5),
                color:colors.gray
              }}>
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center',columnGap:actuatedNormalize(5)}}>
            <Ionicons name="exit-outline" size={22} color={colors.white} />
            <Text
              style={{
                fontSize: actuatedNormalize(16),
                fontFamily: fonts.NexaRegular,
                marginLeft: actuatedNormalize(5),
                color:colors.gray
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    elevation: 5, // Add elevation for shadow
  },
});

export default CustomDrawer;
