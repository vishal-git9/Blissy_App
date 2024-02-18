import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import RouteBackButton from '../../common/button/BackButton';
import {NavigationStackProps} from '../Prelogin/onboarding';
import LottieView from 'lottie-react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants/PixelScaling';

export const Connection: React.FC<NavigationStackProps> = ({navigation}) => {
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
      <Text style={styles.text}>Connection Found</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
  },
});
