import {RouteProp} from '@react-navigation/native';
import {useEffect, useReducer, useState} from 'react';
import {BackHandler, Dimensions, Text, View, useWindowDimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RouteBackButton} from '../../common/button/BackButton';
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
import { useGetUserQuery, usePostUserMutation } from '../../api/userService';
import { Loader } from '../../common/loader/loader';

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
  payload?: string | string[] | number; // Change the type of text as per your requirement
}

export interface UserState {
  name: string;
  gender: string;
  language: string[];
  interest: string[];
  age: number;
  profilePic:string
}

interface error1 {
  name?: string;
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

type RegistrationRouteProp = RouteProp<RootStackParamList, 'Registration'>;

interface RegistrationInterface { 
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route:RegistrationRouteProp
}

// interface error5 {
//   age:string;
// }

const initialState: UserState = {
  name: '',
  gender: 'male',
  language: ['English'],
  interest: ['Music'],
  age: 16,
  profilePic:""
};

export const reducerAction = (state: UserState, action: Action) => {
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
export const Registration: React.FC<RegistrationInterface> = ({navigation,route}) => {
  const UserData = route?.params?.UserData
  //handle error params of undefined
  // handle undefined is not a function
  const RegistrationState = UserData || initialState
  const [state, dispatch] = useReducer(reducerAction,RegistrationState);
  const [error, setError] = useState<(error1 | error2 | error3 | error4)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [UsernameModal, setUsernameModal] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const [steps, setSteps] = useState<number>(1);
  const [postUser,{isLoading,isError,data}] = usePostUserMutation()
  const {data:userData,isLoading:userLoading,refetch} = useGetUserQuery()
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
    console.log(state,"state of the user")
    
    const res = await postUser(state)

    console.log(res,"resof===")
    if('data' in res){
      console.log(res,"data of user")
      setCompleteModal(false);
      await refetch()
      navigation.navigate('Drawer');
      setSteps(1)
    }else if('error' in res){
      console.log(error)
    }
  };

  const validateForm = (state: UserState) => {
    const errors: error1 = {};
    const errors2: error2 = {};
    const errors3: error3 = {};
    const errors4: error4 = {};

    if (state.name.trim() === '') {
      errors.name = 'name is required';
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  console.log(state, '--registration state---');
  console.log(isLoading, userLoading,"===loadingstate===")
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}>
      {steps !== 1 && (
        <RouteBackButton onPress={() => setSteps(steps => steps - 1)} />
      )}
      {(isLoading || userLoading) && <Loader size={50} />}
      <HelloModal
        modalTitleStyle={{marginTop: actuatedNormalize(-20)}}
        onPressPrimaryButton={() => {
          setUsernameModal(false);
          setSteps(steps => steps + 1);
        }}
        showLottie={true}
        lottieAnimationPath={require('../../../assets/animation/hello.json')}
        title={`Hello ${state.name}`}
        description="there is lot to discover out there but let's set you up first"
        visible={UsernameModal}
        onClose={() => setUsernameModal(false)}
      />
      <HelloModal
        onPressPrimaryButton={() => {
          handleSubmitUserProfile();
        }}
        title={`You're all set`}
        description={userData ? "Your account has been updated now let's start healing" : "Your account set up is completed now let's start healing"}
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
                label={steps === 5 ? userData ? "Let's Update" : "Let's Heal" : 'Next'}
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
