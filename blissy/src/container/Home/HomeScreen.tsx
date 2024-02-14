import React, { useEffect } from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import colors from '../../constants/colors';
import { Loader } from '../../common/loader/loader';
import HealerCarousel from '../../common/tinder/carousel';

export const HomeScreen: React.FC = () => {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp(); // Close the app when back button is pressed
      return true; // Return true to prevent default behavior (going back)
    });
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <HealerCarousel/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
