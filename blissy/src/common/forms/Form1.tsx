// Form1.tsx
import React, {Dispatch, useRef} from 'react';
import {Text} from 'react-native';
import {View, TextInput, StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import LabelInputComponent from '../inputs/labelInput';
import {Action} from '../../container/Registration/Registration';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import { LabelWithDesc } from '../labels/label1';

interface Form1Props {
  state: {
    username: string;
  };
  dispatch: Dispatch<Action>;
}
const Form1: React.FC<Form1Props> = ({state, dispatch}) => {
  const animatableRef = useRef<Animatable.View>(null);
  return (
    <View>
      <View style={[styles.inputForm, {marginTop: actuatedNormalize(25)}]}>
        <LabelWithDesc label="What's Your Name?" sublabel='it will appear to other user while talking'/>
        <LabelInputComponent
          value={state.username}
          type={'username'}
          name={'name'}
          // errorText={'Name is part of our alogrithm'}
          onChangeText={dispatch}
          IconProvider={AntDesign}
          IconName={'user'}
        />
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: actuatedNormalize(40),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: actuatedNormalize(5),
    paddingHorizontal: actuatedNormalize(10),
  },
  inputForm: {
    rowGap: actuatedNormalize(20),
    marginTop: actuatedNormalize(20),
  },
});

export default Form1;
