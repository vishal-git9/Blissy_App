import {useNavigation} from '@react-navigation/native';
import {useEffect, useReducer, useState} from 'react';
import {Dimensions, Text, View, useWindowDimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RouteBackButton from '../../common/button/BackButton';
import StepperFormAnimation from '../../common/forms/StepperFormAnimation';
import {actuatedNormalize} from '../../constants/PixelScaling';
import React from 'react';
import Form1 from '../../common/forms/Form1';
import Form2 from '../../common/forms/Form2';
import Form3 from '../../common/forms/Form3';
import Form4 from '../../common/forms/Form4';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import ProgressBar from '../../common/login/ProgressBar';
import {StyleSheet} from 'react-native';
import {PrimaryButton} from '../../common/button/PrimaryButton';
import Form5 from '../../common/forms/Form5';
import HelloModal from '../../common/modals/middleScreen';
import {Snackbar} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppNavigation/navigatorType';
import {NavigationStackProps} from '../Prelogin/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  payload: string | string[] | number; // Change the type of text as per your requirement
}

interface State {
  username: string;
  gender: string;
  language: string[];
  interest: string[];
  age: number;
  // Define the structure of your state as needed
}

interface error1 {
  username?: string;
}
interface error2 {
  interest?: string;
}
interface error3 {
  language?: string;
}
interface error4 {
  gender?: string;
}

// interface error5 {
//   age:string;
// }

const initialState: State = {
  username: '',
  gender: 'male',
  language: ['English'],
  interest: ['Music'],
  age: 16,
};

export const reducerAction = (state: State, action: Action) => {
  const key = action.type;
  switch (action.type) {
    case action.type: {
      // Note: This should be case key:
      return {
        ...state,
        [key]: action.payload,
      };
    }
    default:
      return state;
  }
};
export const Registration: React.FC<NavigationStackProps> = ({navigation}) => {
  const [state, dispatch] = useReducer(reducerAction, initialState);
  const [error, setError] = useState<(error1 | error2 | error3 | error4)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [UsernameModal, setUsernameModal] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const [steps, setSteps] = useState<number>(1);
  const [completeModal, setCompleteModal] = useState<boolean>(false);

  const handleUserName = () => {
    const errorPostion = error[steps - 1];
    console.log(errorPostion, 'error positon');
    setErrorMessage(Object.values(errorPostion)[0]);
    if (Object.keys(errorPostion).length !== 0) {
      setErrorSnackbar(true);
      return;
    } else {
      setUsernameModal(true);
    }
  };

  const handleCompleteModal = () => {
    setCompleteModal(true);
  };

  const handleSubmitUserProfile = async() => {
    //call api here
    setCompleteModal(false);
    await AsyncStorage.setItem('isRegistered','true');
    navigation.navigate('Home');
  };

  const validateForm = (state: State) => {
    const errors: error1 = {};
    const errors2: error2 = {};
    const errors3: error3 = {};
    const errors4: error4 = {};

    if (state.username.trim() === '') {
      errors.username = 'Username is required';
    }
    if (state.interest.length < 3) {
      errors2.interest = 'Select at least 3 Interest';
    }
    if (state.language.length === 0) {
      errors3.language = 'Language  is required';
    }
    if (state.gender.trim() === '') {
      errors4.gender = 'Gender is required';
    }
    return [errors, errors2, errors3, errors4];
  };

  const validateStepsForm = () => {
    const errorPostion = error[steps - 1];
    console.log(errorPostion, 'error positon');
    setErrorMessage(Object.values(errorPostion)[0]);
    if (Object.keys(errorPostion).length !== 0) {
      setErrorSnackbar(true);
      return;
    } else {
      setSteps(prev => prev + 1);
    }
  };

  useEffect(() => {
    const res = validateForm(state);
    console.log(res, 'Res');
    setError(res);
    // ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
  }, [state]);

  console.log(state, '--registration state---');
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}>
      {steps !== 1 && (
        <RouteBackButton onPress={() => setSteps(steps => steps - 1)} />
      )}

      <HelloModal
        modalTitleStyle={{marginTop: actuatedNormalize(-20)}}
        onPressPrimaryButton={() => {
          setUsernameModal(false);
          setSteps(steps => steps + 1);
        }}
        showLottie={true}
        lottieAnimationPath={require('../../../assets/animation/hello.json')}
        title={`Hello ${state.username}`}
        description="there is lot to discover out there but let's set you up first"
        visible={UsernameModal}
        onClose={() => setUsernameModal(false)}
      />
      <HelloModal
        onPressPrimaryButton={() => {
          handleSubmitUserProfile();
          console.log('hey there navigating to the homepage');
        }}
        title={`You're all set`}
        description="Your account set up is completed now let's start healing"
        visible={completeModal}
        lottieAnimationPath={require('../../../assets/animation/verified.json')}
        showLottie={true}
        onClose={() => setCompleteModal(false)}
      />
      <View
        style={{
          flex: 3,
          width: SCREEN_WIDTH,
          paddingHorizontal: actuatedNormalize(20),
          paddingVertical: actuatedNormalize(20),
          rowGap: actuatedNormalize(20),
        }}>
        <StepperFormAnimation currentStep={steps} onNext={validateStepsForm}>
          <Form1 state={state} dispatch={dispatch} />
          <Form2 state={state} dispatch={dispatch} />
          <Form3 state={state} dispatch={dispatch} />
          <Form4 state={state} dispatch={dispatch} />
          <Form5 state={state} dispatch={dispatch} />
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
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '30%',
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
                  color: steps === 5 ? colors.primary : colors.white,
                  fontFamily: fonts.NexaRegular,
                  fontSize: actuatedNormalize(16),
                }}>
                /5
              </Text>
            </View>
            <View style={{width: '50%'}}>
              <PrimaryButton
                label={steps === 5 ? "Let's Heal" : 'Next'}
                handleFunc={
                  steps === 1
                    ? handleUserName
                    : steps === 5
                    ? handleCompleteModal
                    : validateStepsForm
                }
              />
            </View>
          </View>
          <ProgressBar duration={5} progressDuration={steps} />
          <Snackbar
            duration={2000}
            visible={errorSnackbar}
            style={{backgroundColor: colors.black}}
            onDismiss={() => setErrorSnackbar(false)}
            action={{
              theme: {
                fonts: {
                  regular: {fontFamily: fonts.NexaRegular},
                  medium: {fontFamily: fonts.NexaBold},
                  light: {fontFamily: fonts.NexaBold},
                  thin: {fontFamily: fonts.NexaRegular},
                },
              },
              label: 'Okay',
              labelStyle: {fontFamily: fonts.NexaBold},
              onPress: () => {
                // Do something
                setErrorSnackbar(false);
              },
            }}>
            {errorMessage}
          </Snackbar>
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
