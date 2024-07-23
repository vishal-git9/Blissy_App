import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Action } from '../Registration/Registration';
import MobileInput from '../../common/login/LoginInput';
import OTPInput from '../../common/login/otpInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationStackProps } from '../Prelogin/onboarding';
import { useGetOtpMutation, useVerifyOtpMutation } from '../../api/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector, setNewlyInstalled, setSessionStatus, setUserState } from '../../redux/uiSlice';
import { useGetUserQuery } from '../../api/userService';
import { TextInput } from 'react-native-paper';
import { Loader } from '../../common/loader/loader';
import { actuatedNormalize } from '../../constants/PixelScaling';
import HelloModal from '../../common/modals/middleScreen';

interface LoginInterface {
  email: string;
  OTP: string;
}
const intialState: LoginInterface = {
  email: '',
  OTP: '',
};

export const validateEmail = (email: string) => {
  const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  console.log(EmailRegex.test(email), "from regex", email)
  return EmailRegex.test(email);
};

export const reducerAction = (state: LoginInterface, action: Action) => {
  const key = action.type;
  switch (action.type) {
    case action.type: {
      // Note: This should be case key:
      return {
        ...state,
        [key]: action.payload,
      };
    }
    case "RESET":
      return intialState

    default:
      return state;
  }
};
export const LoginScreen: React.FC<NavigationStackProps> = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducerAction, intialState);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [resendOtp, setResendOtp] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(true)
  const [AlreadyloggedinCase, setAlreadyloggedinCase] = useState<boolean>(false)
  const [progressDuration, setProgressDuration] = useState(60);
  const [otpAlreadySentCase, SetotpAlreadySentCase] = useState(false)
  const [invalidEmail, setEnvalidEmail] = useState<boolean>(false);
  const [welcomeModal, setwelcomeModal] = useState<{ visible: boolean, isNew: boolean }>({ visible: false, isNew: false });
  const timerRef = useRef<NodeJS.Timeout>();
  const [getOtp, { error, data, isLoading, reset: resetMobile }] = useGetOtpMutation();
  const { token, isAuthenticated, user, isRegisterd,isNewlyInstalled } = useSelector(AuthSelector)
  const { data: userData, isLoading: userLoading, refetch } = useGetUserQuery()
  const [OtpVerify, { error: verifyOtpErr, data: verifyOtpData, isLoading: verifyOtpLoading, reset }] = useVerifyOtpMutation()

  const reduxDispatch = useDispatch()
  // console.log(user, isNewUser, isRegisterd, "------user--------")
  const handleSubmitMobileNumber = async () => {
    if (validateEmail(state.email)) {
      const res = await getOtp({ email: `${state.email}` });
      console.log(res, "---res-----", error)
      if ('data' in res) {
        console.log(data, "data of MobileNumber")
        setIsOtpSent(true);
      } else if ('error' in res) {
        if (res.error?.data?.message === "OTP already sent") {
          setIsOtpSent(true);
          SetotpAlreadySentCase(true)
        } else if (res.error?.data?.code === "GEN_800") {
          if(!isNewlyInstalled){
            setAlreadyloggedinCase(true)
          }
        }
        console.log(error)
      }
    } else {
      setEnvalidEmail(true)
    }
  };

  const handleOtpSubmit = async () => {
    const res = await OtpVerify({ email: `${state.email}`, otp: parseInt(state.OTP) });
    if ('data' in res) {
      console.log(res, "data of OTP")
      const isNewuser =  (await refetch()).data
      // fetch user details
      // console.log(isNewUser, "newUser from login---")
      clearInterval(timerRef.current);
      setModalState(false)
      console.log(isNewuser, "---user isnewuser")
      if (isNewuser?.data?.user?.isNewUser) {
        console.log(isNewuser?.data?.user, "---user here isnewuser")
        reduxDispatch(setSessionStatus(false))
        reduxDispatch(setNewlyInstalled(false))
        setwelcomeModal({ visible: true, isNew: true })
      } else {
        console.log(isNewuser?.data?.user, "---user here2 isnewuser")
        setwelcomeModal({ visible: true, isNew: false })
        reduxDispatch(setSessionStatus(false))
        reduxDispatch(setUserState(false))
      }
    } else if ('error' in res) {
      console.log(res, "res of otp")
      console.log(verifyOtpErr, "error of otp")
    }
  };

  useEffect(() => {
    // Start the timer when isOtpSent is true
    if (isOtpSent || resendOtp) {
      timerRef.current = setInterval(() => {
        setProgressDuration(prevDuration => {
          if (prevDuration === 0) {
            // Stop the timer when duration reaches 0
            clearInterval(timerRef.current);
          }
          return prevDuration > 0 ? prevDuration - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOtpSent, resendOtp]);

  useEffect(() => {
    if (state.OTP.length === 4) {
      // Call OTP verification function here
      Keyboard.dismiss();
      handleOtpSubmit()
    }
  }, [state.OTP]);



  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      style={styles.container}>

      {
        welcomeModal.visible ? welcomeModal.isNew ? <HelloModal
          modalTitleStyle={{ marginTop: actuatedNormalize(-20) }}
          onPressPrimaryButton={() => {
            setwelcomeModal({ visible: false, isNew: false })
            navigation.navigate('Registration', { UserData: null });
          }}
          showLottie={true}
          lottieAnimationPath={require('../../../assets/animation/hello.json')}
          title={`Hello Healer`}
          description="there is lot to discover out there but let's set you up first"
          visible={welcomeModal.visible}
          onClose={() => console.log("closed")}
        /> : <HelloModal
          modalTitleStyle={{ marginTop: actuatedNormalize(-20) }}
          onPressPrimaryButton={() => {
            setwelcomeModal({ visible: false, isNew: false })
            navigation.navigate('Drawer');
          }}
          showLottie={true}
          lottieAnimationPath={require('../../../assets/animation/hello.json')}
          title={`Welcome Back`}
          description={`${user?.name} We're glad to have you with us again`}
          visible={welcomeModal.visible}
          onClose={() => console.log("closed")}
        /> : null
      }
      {!isOtpSent ? (
        <MobileInput
          AlreadyloggedinCase={AlreadyloggedinCase}
          setAlreadyloggedinCase={setAlreadyloggedinCase}
          invalidEmail={invalidEmail}
          isLoading={isLoading}
          modalState={modalState}
          state={state}
          dispatch={dispatch}
          navigation={navigation}
          handleOtp={handleSubmitMobileNumber}
        />
      ) : (
        <OTPInput
          otpAlreadySent={otpAlreadySentCase}
          setAlreadyOtpSent={SetotpAlreadySentCase}
          setIsOtpSent={setIsOtpSent}
          setResendOtp={setResendOtp}
          isError={verifyOtpErr}
          handleSubmitMobileNumber={handleSubmitMobileNumber}
          isLoading={verifyOtpLoading}
          modalState={modalState}
          state={state}
          changeMobileNumber={() => {
            dispatch({ type: "OTP", payload: "" })
            setIsOtpSent(false)
            reset()
            clearInterval(timerRef.current)
            setProgressDuration(60)
          }}
          retry={reset}
          resendOtp={resendOtp}
          dispatch={dispatch}
          progressDuration={progressDuration}
          setProgressDuration={setProgressDuration}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  loaderContainer: {
    position: "absolute",
    backgroundColor: "red",
    zIndex: 200,
    top: actuatedNormalize(250),
    left: actuatedNormalize(150),
  }
});
