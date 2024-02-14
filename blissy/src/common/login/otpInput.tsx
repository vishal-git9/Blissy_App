import React, { Dispatch } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {fonts} from '../../constants/fonts';
import colors from '../../constants/colors';
import ProgressBar from './ProgressBar';
import OTPTextInput from 'react-native-otp-textinput';
import RouteBackButton from '../button/BackButton';
import { Action } from '../../container/Registration/Registration';
import { Loader } from '../loader/loader';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

interface OTPInputProps {
  progressDuration: number;
  changeMobileNumber:()=>void;
  setProgressDuration: (a: number) => void;
  dispatch:Dispatch<Action>;
  modalState:boolean;
  isLoading:boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  progressDuration,
  setProgressDuration,
  dispatch,
  changeMobileNumber,
  modalState,
  isLoading
}) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  console.log("at the otp screen")
  return (
    <>
    <Modal
      isVisible={modalState}
      style={styles.modal}
      backdropColor="transparent"
      animationInTiming={1000}
      animationIn="slideInUp"
      animationOut="slideOutDown">
       <RouteBackButton onPress={changeMobileNumber} />
       {isLoading && <View style={styles.loaderContainer}><Loader size={50}/></View>}
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
          {'Enter Your OTP'}
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
          {`Enter OTP we sent to 910XXXX547 This code will expire in ${progressDuration}s`}
        </Text>

        <ProgressBar duration={30} progressDuration={progressDuration} />
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
          handleTextChange={text => dispatch({type:"OTP",payload:text})}
          textInputStyle={styles.otpStyles}
        />
        {/* <PrimaryButton
          handleFunc={() => {
            clearInterval(timer);
          }}
          label="Verify"
        /> */}
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
            <TouchableWithoutFeedback onPress={() => setProgressDuration(30)}>
              <Text style={{color: '#1E5128', fontFamily: fonts.NexaXBold}}>
                Resend OTP
              </Text>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
  loaderContainer:{
    position:"absolute",
    zIndex:2,
    flex:1,
    height:screenHeight,
    width:screenWidth,
    justifyContent:"center",
    alignItems:"center",
     backgroundColor:colors.darkOverlayColor2
  }
});

export default OTPInput;
