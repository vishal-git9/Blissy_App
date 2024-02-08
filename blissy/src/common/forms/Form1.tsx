// Form1.tsx
import React, {Dispatch} from 'react';
import {Text} from 'react-native';
import {View, TextInput, StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import LabelInputComponent from '../inputs/labelInput';
import {Action} from '../../container/Registration/Registration';
import GenderSelect from '../selectable/genderSelectable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

interface Form1Props {
  state: {
    username: string;
  };
  dispatch: Dispatch<Action>;
}
const Form1: React.FC<Form1Props> = ({state, dispatch}) => {
  return (
    <View style={[styles.container]}>
      <Text
        style={{
          color: colors.white,
          fontFamily: fonts.NexaBold,
          fontSize: actuatedNormalize(20),
          alignSelf: 'flex-start',
          marginTop: actuatedNormalize(50),
        }}>
        Name
      </Text>
      <LabelInputComponent
        value={state.username}
        type={'username'}
        name={'name'}
        // errorText={'Name is part of our alogrithm'}
        onChangeText={dispatch}
        IconProvider={AntDesign}
        IconName={'user'}
      />
      <Text
        style={{
          color: colors.white,
          fontFamily: fonts.NexaBold,
          fontSize: actuatedNormalize(20),
          alignSelf: 'flex-start',
          marginTop: actuatedNormalize(10),
        }}>
        Gender
      </Text>
      <GenderSelect
        selectedGender={'male'}
        onSelectGender={gender => console.log(gender)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default Form1;
