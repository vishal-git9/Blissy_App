import React, {Dispatch, SetStateAction, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {Text} from 'react-native';
import {fonts} from '../../constants/fonts';

export const ToggleButton = ({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => setValue('healers')}
          style={[
            styles.button,
            {
              backgroundColor:
                value === 'healers' ? colors.primary : colors.transparent,
            },
          ]}>
          <Feather
            name="smile"
            size={24}
            color={value === 'healers' ? colors.white : colors.black}
          />
          <Text
            style={{
              color: value === 'healers' ? colors.white : colors.black,
              fontFamily: fonts.NexaBold,
            }}>
            Healers
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => setValue('random')}
        style={[
          styles.button,
          {
            backgroundColor:
              value === 'random' ? colors.primary : colors.transparent,
          },
        ]}>
        <AntDesign
          name="API"
          size={24}
          color={value === 'random' ? colors.white : colors.black}
        />
        <Text
          style={{
            color: value === 'random' ? colors.white : colors.black,
            fontFamily: fonts.NexaBold,
          }}>
          People
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    width: '85%',
    height: actuatedNormalize(60),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: actuatedNormalize(10),
    padding: actuatedNormalize(5),
    marginTop: actuatedNormalize(40),
  },
  button: {
    backgroundColor: colors.white,
    height: actuatedNormalize(50),
    width: actuatedNormalize(150),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: actuatedNormalize(10),
    columnGap: actuatedNormalize(10),
  },
});
