import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {Action} from '../Registration/Registration';
import MobileInput from '../../common/login/LoginInput';
import OTPInput from '../../common/login/otpInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { NavigationStackProps } from '../Prelogin/onboarding';
import { useGetOtpMutation, useVerifyOtpMutation } from '../../api/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';
import { useGetUserQuery } from '../../api/userService';
import { TextInput } from 'react-native-paper';

export const validateMobileNumber = (mobile:string) => {
  console.log(mobile,"mobile")
  const MobileRegex = /^[6-9]{1}[0-9]{9}$/;
  return MobileRegex.test(mobile);
};

interface LoginInterface {
  mobileNumber: string;
  OTP: string;
}
const intialState: LoginInterface = {
  mobileNumber: '',
  OTP: '',
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
    default:
      return state;
  }
};
export const LoginScreen : React.FC<NavigationStackProps> = ({navigation}) => {
  const [state, dispatch] = useReducer(reducerAction, intialState);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [modalState,setModalState] = useState<boolean>(true)
   const [getOtp,{error,data,isLoading}] = useGetOtpMutation();
   const {token,isAuthenticated,user} = useSelector(AuthSelector)
   const {data:userData,isLoading:userLoading,refetch} = useGetUserQuery()
   const [OtpVerify,{error:verifyOtpErr,data:verifyOtpData,isLoading:verifyOtpLoading}] = useVerifyOtpMutation()
  const handleSubmitMobileNumber = async () => {
      const res = await getOtp({mobileNumber:`+91${state.mobileNumber}`});
      console.log(res,"---res-----")
      if('data' in res){
        console.log(data,"data of MobileNumber")
        setIsOtpSent(true);
      }else if('error' in res){
        console.log(error)
      }
  };

  const [progressDuration, setProgressDuration] = useState(30);
  const timerRef = useRef<NodeJS.Timeout>();
  const handleOtpSubmit = async() => {
    const res = await OtpVerify({mobileNumber:`+91${state.mobileNumber}`,otp:parseInt(state.OTP)});
    if('data' in res){
      console.log(res,"data of OTP")
      const isNewuser = await refetch().then(res=>res.data.data.user.isNewUser)
      // fetch user details
      clearInterval(timerRef.current);
      setModalState(false)
      console.log(user?.isNewUser,"---user isnewuser")
      if(isNewuser){
        navigation.navigate('Registration');  
      }else{
        navigation.navigate('Home');  
      }
    }else if('error' in res){
      console.log(verifyOtpErr,"error of otp")
    }
  };
  
  useEffect(() => {
    // Start the timer when isOtpSent is true
    if (isOtpSent) {
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
  }, [isOtpSent]);

  useEffect(() => {
    if (state.OTP.length === 4) {
      // Call OTP verification function here
      Keyboard.dismiss();
      handleOtpSubmit()
    }
  }, [state.OTP]);


  console.log(isOtpSent,"---isotpsent---")
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}
      style={styles.container}>
      {!isOtpSent ? (
        <MobileInput
        modalState={modalState}
          state={state}
          dispatch={dispatch}
          navigation={navigation}
          handleOtp={handleSubmitMobileNumber}
        />
      ) : (
        <OTPInput
        modalState={modalState}
          changeMobileNumber={() => setIsOtpSent(false)}
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
  },
});
