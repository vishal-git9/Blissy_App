import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../container/Prelogin/onboarding';
import { Registration } from '../container/Registration/Registration';
import { RootStackParamList } from './navigatorType';
import { LoginScreen } from '../container/login/login';

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='Onboarding'
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationTypeForReplace: 'pop',
          animation: 'fade',
          animationDuration: 1000,
          contentStyle: {backgroundColor: 'rgb(0, 0, 0)'},
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
