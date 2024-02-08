import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../common/prelogin/onboarding';
import LoginScreen from '../common/login/LoginInput';
import { Registration } from '../container/Registration/Registration';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
          animationDuration: 1000,
          contentStyle: {backgroundColor: 'rgb(0, 0, 0)'},
        }}>
        <Stack.Screen name="Home" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
