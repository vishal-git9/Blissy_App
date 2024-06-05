/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from "redux-persist/integration/react"
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from './src/constants/colors';
import {Provider} from 'react-redux';
import * as RootNavigation from './src/utils/RootNavigation.js';
import { store,persistor } from './src/redux';
import { Navigator } from './src/AppNavigation/Navigator';
import { SplashScreenAnimated } from './src/common/splashscreen.tsx/splash';
import setupNotificationListener from './src/utils/notificationService';
import notifee, { EventType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';

const App:React.FC = ()=> {
  const isDarkMode = useColorScheme() === 'dark';
  const [hasSplash,setHasSplash] = useState<boolean>(true)
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
 


  useEffect(() => {
    // const timer = setTimeout(() => {
    //   setHasSplash(false)
    // }, 4200);
    
    setupNotificationListener()
    // return ()=> clearTimeout(timer)
  }, []);





  console.log(hasSplash,"---hassplash---")

  return (
    <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <SafeAreaProvider style={backgroundStyle}>
        <View style={[styles.AppContainer, backgroundStyle]}>
          <StatusBar
            barStyle={'light-content'}
            animated={true}
            backgroundColor={colors.black}
          />
          <Navigator/>
        </View>
      </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  AppContainer: {
    flex: 1,
  },
});

export default App;
