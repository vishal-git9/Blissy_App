import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import OTPTextInput from 'react-native-otp-textinput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {withSpring} from 'react-native-reanimated';
import {actuatedNormalize} from '../../constants/PixelScaling';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../../constants/fonts';
import LottieView from 'lottie-react-native';
import colors from '../../constants/colors';
import ProgressBar from './ProgressBar';
import {PrimaryButton} from '../button/PrimaryButton';
import RouteBackButton from '../button/BackButton';
import {useGetOtpMutation} from '../../api/authService';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const LoginScreen: React.FC = () => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState<string>('');
  // const [getOtp] = useGetOtpMutation();
  const handleOtp = async () => {
    setIsOtpSent(true);
    // try {
    //   await getOtp({mobileNumber});
    // } catch (error) {}
  };

  const onOtpSubmit = () => {
    console.log('otp submitted');
  };

  const [progressDuration, setProgressDuration] = useState(30);
  let timer: any;

  useEffect(() => {
    if (isOtpSent) {
      if (progressDuration <= 0) {
        clearInterval(timer);
        console.log('cleared');
      } else {
        timer = setInterval(() => {
          setProgressDuration(progressDuration => progressDuration - 1);
        }, 1000);
        console.log('running', progressDuration);
      }
    }
    return () => clearInterval(timer);
  }, [progressDuration, isOtpSent]);

  console.log(isOtpSent, 'isotpsent');
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}>
      {/* <Animated.View
        sharedTransitionTag="getStarted"
        style={{
          alignSelf: 'flex-start',
          marginTop: actuatedNormalize(280),
          paddingHorizontal: actuatedNormalize(20),
        }}>
        <Text
          style={{
            fontFamily: fonts.NexaXBold,
            color: 'white',
            fontSize: actuatedNormalize(55),
            alignSelf: 'flex-start',
          }}>
          GET
        </Text>
        <Text
          style={{
            fontFamily: fonts.NexaXBold,
            color: '#1E5128',
            fontSize: actuatedNormalize(55),
            alignSelf: 'flex-start',
          }}>
          STARTED..
        </Text>
      </Animated.View> */}
      <RouteBackButton onPress={() => console.log('his')} />
      {!isOtpSent ? (
        <Modal
          isVisible={isOtpSent === false}
          style={styles.modal}
          backdropColor="transparent"
          animationInTiming={1000}
          animationIn="slideInUp"
          animationOut="slideOutDown">
          <LottieView
            source={require('../../../assets/animation/AnimationMobile.json')}
            style={{
              width: SCREEN_WIDTH * 0.9,
              height: SCREEN_WIDTH * 0.9,
              alignSelf: 'center',
            }}
            autoPlay
            loop
          />
          <View
            style={{
              alignSelf: 'center',
              paddingHorizontal: actuatedNormalize(20),
              gap: actuatedNormalize(5),
              marginBottom: actuatedNormalize(20),
            }}>
            <Text
              style={{
                fontFamily: fonts.NexaBold,
                // color: '#868787',
                color: colors.white,
                fontSize: actuatedNormalize(26),
                alignSelf: 'center',
              }}>
              {!isOtpSent ? 'Enter Your Number' : 'Enter Your OTP'}
            </Text>
            <View></View>
            <Text
              style={{
                fontFamily: fonts.NexaBold,
                color: '#868787',
                textAlign: 'center',
                fontSize: actuatedNormalize(12),
                alignSelf: 'center',
                lineHeight: actuatedNormalize(20),
              }}>
              {!isOtpSent
                ? ''
                : `Enter OTP we sent to 910XXXX547 This code will expire in ${progressDuration}s`}
            </Text>
            {isOtpSent && (
              <ProgressBar duration={30} progressDuration={progressDuration} />
            )}
          </View>
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              {/* <Text style={{fontWeight:"bold",color:"white",fontSize:actuatedNormalize(25),alignSelf:"center"}}>Enter Your Number</Text> */}
              {/* <ColorWaveText/> */}
              <TextInput
                label="Phone No."
                activeUnderlineColor="#1E5128"
                keyboardType="number-pad"
                selectionColor="#1E5128"
                underlineColor="black"
                underlineStyle={{borderWidth: 0, borderColor: '#1E5128'}}
                placeholderTextColor={colors.white}
                style={styles.input}
                contentStyle={{
                  color: colors.white,
                  fontFamily: fonts.NexaXBold,
                }}
                // right={<TextInput.Icon icon="eye" />}
              />
              <PrimaryButton handleFunc={() => handleOtp()} label="GET OTP" />
            </View>
          </View>
        </Modal>
      ) : (
        <Modal
          isVisible={isOtpSent}
          style={styles.modal}
          backdropColor="transparent"
          animationInTiming={2000}
          animationIn="slideInUp"
          animationOut="slideOutDown">
          <LottieView
            source={require('../../../assets/animation/AnimationMobile.json')}
            style={{
              width: SCREEN_WIDTH * 0.9,
              height: SCREEN_WIDTH * 0.9,
              alignSelf: 'center',
            }}
            autoPlay
            loop
          />
          <View
            style={{
              alignSelf: 'center',
              paddingHorizontal: actuatedNormalize(20),
              gap: actuatedNormalize(5),
              marginBottom: actuatedNormalize(20),
            }}>
            <Text
              style={{
                fontFamily: fonts.NexaBold,
                // color: '#868787',
                color: 'white',
                fontSize: actuatedNormalize(26),
                alignSelf: 'center',
              }}>
              {!isOtpSent ? 'Enter Your Number' : 'Enter Your OTP'}
            </Text>
            <View></View>
            <Text
              style={{
                fontFamily: fonts.NexaBold,
                color: '#868787',
                textAlign: 'center',
                fontSize: actuatedNormalize(12),
                alignSelf: 'center',
                lineHeight: actuatedNormalize(20),
              }}>
              {!isOtpSent
                ? 'Click on GET OTP to receive otp message on your device'
                : `Enter OTP we sent to 910XXXX547 This code will expire in ${progressDuration}s`}
            </Text>
            {isOtpSent && (
              <ProgressBar duration={30} progressDuration={progressDuration} />
            )}
          </View>
          <View
            style={[
              styles.modalContent,
              {
                justifyContent: 'center',
                alignItems: 'center',
                rowGap: actuatedNormalize(15),
              },
            ]}>
            <OTPTextInput
              containerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: actuatedNormalize(5),
              }}
              inputCount={4}
              autoFocus
              handleTextChange={text => console.log(text)}
              textInputStyle={styles.otpStyles}
            />
            <PrimaryButton
              handleFunc={() => {
                clearInterval(timer);
                navigation.navigate('Registration');
              }}
              label="Verify"
            />
            {progressDuration === 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  columnGap: actuatedNormalize(10),
                }}>
                <Text style={{color: '#868787', fontFamily: fonts.NexaRegular}}>
                  Didn't receive the code?
                </Text>
                <TouchableWithoutFeedback
                  onPress={() => setProgressDuration(30)}>
                  <Text style={{color: '#1E5128', fontFamily: fonts.NexaXBold}}>
                    Resend OTP
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
        </Modal>
      )}
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
  inputContainer: {
    flex: 1,
    width: '100%',
    gap: actuatedNormalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    fontFamily: fonts.NexaXBold,
    backgroundColor: 'black',
    borderBottomWidth: 0,
    elevation: 3,
    borderTopRightRadius: actuatedNormalize(10),
    borderTopLeftRadius: actuatedNormalize(10),
    borderBottomRightRadius: actuatedNormalize(10),
    borderBottomLeftRadius: actuatedNormalize(10),
  },
  otpStyles: {
    backgroundColor: 'black',
    elevation: 2,
    borderWidth: 0,
    color: 'white',
    height: 60,
    width: 60,
    padding: actuatedNormalize(5),
    borderTopRightRadius: actuatedNormalize(10),
    borderTopLeftRadius: actuatedNormalize(10),
    borderBottomRightRadius: actuatedNormalize(10),
    borderBottomLeftRadius: actuatedNormalize(10),
    borderColor: 'white',
    borderBottomWidth: 0,
  },
  img: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#191A19',
    height: screenHeight / 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: actuatedNormalize(20),
  },
});

export default LoginScreen;
