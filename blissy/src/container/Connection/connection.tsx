import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import {RouteBackButton} from '../../common/button/BackButton';
import {NavigationStackProps} from '../Prelogin/onboarding';
import LottieView from 'lottie-react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants/PixelScaling';
import CallingScreen from './callingscreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';

interface ContainerProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  leave:()=>void;
  toggleMic:()=>void;
}

export const Connection: React.FC<ContainerProps> = ({navigation,leave,toggleMic}) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);
    // Return a cleanup function to clear the timeout
    return () => clearTimeout(timeout);
  }, []);
  return (
    <View style={styles.container}>
      <RouteBackButton onPress={() => navigation.goBack()} />
      {!loading &&       <CallingScreen toggleMic={toggleMic} leave={leave} navigation={navigation}/> }
      {loading && (
        <LottieView
          source={require('../../../assets/animation/networking3.json')}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            alignSelf: 'center',
          }}
          autoPlay
          loop
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: colors.white,
  },
});
