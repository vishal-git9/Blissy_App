import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {RootStackParamList} from '../../AppNavigation/navigatorType';
import {useNavigation} from '@react-navigation/native';
import {Action} from '../Registration/Registration';
import MobileInput from '../../common/login/LoginInput';
import OTPInput from '../../common/login/otpInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { NavigationStackProps } from '../Prelogin/onboarding';
import RouteBackButton from '../../common/button/BackButton';

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
  console.log("---------login screen")
  // const {width: SCREEN_WIDTH} = useWindowDimensions();
  const [state, dispatch] = useReducer(reducerAction, intialState);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  // const [getOtp] = useGetOtpMutation();
  const handleSubmitMobileNumber = async () => {
    setIsOtpSent(true);
    // try {
    //   await getOtp({mobileNumber});
    // } catch (error) {}
  };

  const [progressDuration, setProgressDuration] = useState(30);
  const timerRef = useRef<NodeJS.Timeout>();
  const handleOtpSubmit = () => {
    clearInterval(timerRef.current);
    navigation.navigate('Registration');
    console.log('Verifying OTP:', state.OTP);
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
          state={state}
          dispatch={dispatch}
          navigation={navigation}
          handleOtp={handleSubmitMobileNumber}
        />
      ) : (
        <OTPInput
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
