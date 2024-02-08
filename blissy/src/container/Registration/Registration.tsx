import React, {useReducer, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RouteBackButton from '../../common/button/BackButton';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LabelInputComponent from '../../common/inputs/labelInput';
import {fonts} from '../../constants/fonts';
import colors from '../../constants/colors';
import ProgressBar from '../../common/login/ProgressBar';
import GenderSelect from '../../common/selectable/genderSelectable';
import InterestSelect from '../../common/selectable/interestSelectable';
import Form1 from '../../common/forms/Form1';
import Form2 from '../../common/forms/Form2';
import {PrimaryButton} from '../../common/button/PrimaryButton';
import StepperFormAnimation from '../../common/forms/StepperFormAnimation';
import Form3 from '../../common/forms/Form3';
import Form4 from '../../common/forms/Form4';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// export const reducerAction = (state, action) => {
//   const key = action.type;
//   switch (action.type) {
//     case action.type: {
//       return {
//         ...state,
//         [key]: action.text,
//       };
//     }
//   }
// };

export interface Action {
  type: string;
  text: string; // Change the type of text as per your requirement
}

interface State {
  username: string;
  gender: string;
  language: string[];
  interest: string[];
  age: number;
  // Define the structure of your state as needed
}

const initialState: State = {
  username: '',
  gender: '',
  language: [],
  interest: [],
  age: 18,
};

export const reducerAction = (state: State, action: Action) => {
  const key = action.type;
  switch (action.type) {
    case action.type: {
      // Note: This should be case key:
      return {
        ...state,
        [key]: action.text,
      };
    }
    default:
      return state;
  }
};
export const Registration: React.FC = () => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const [steps, setSteps] = useState<number>(1);
  const navigation = useNavigation();

  const [state, dispatch] = useReducer(reducerAction, initialState);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}>
      <RouteBackButton onPress={() => navigation.goBack()} />

      <View
        style={{
          flex: 3,
          width: SCREEN_WIDTH,
          paddingHorizontal: actuatedNormalize(20),
          paddingVertical: actuatedNormalize(20),
          rowGap: actuatedNormalize(20),
        }}>
        <StepperFormAnimation
          currentStep={steps}
          onNext={() => setSteps(steps => steps + 1)}>
          <Form1 state={state} dispatch={dispatch} />
          <Form2 />
          <Form3 />
          <Form4 />
        </StepperFormAnimation>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            margin: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: actuatedNormalize(5),
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: fonts.NexaXBold,
                fontSize: actuatedNormalize(20),
              }}>
              {steps}
            </Text>
            <Text
              style={{
                color: colors.white,
                fontFamily: fonts.NexaRegular,
                fontSize: actuatedNormalize(16),
              }}>
              /4
            </Text>
          </View>
          <ProgressBar duration={4} progressDuration={steps} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth,
    paddingHorizontal: actuatedNormalize(20),
    paddingVertical: actuatedNormalize(20),
  },
});
