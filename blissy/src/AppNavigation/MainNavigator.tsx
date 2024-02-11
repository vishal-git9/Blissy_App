import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../container/Prelogin/onboarding';
import {Registration} from '../container/Registration/Registration';
import {RootStackParamList} from './navigatorType';
import {LoginScreen} from '../container/login/login';
import {HomeScreen} from '../container/Home/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface MainNavigatorProps {
  isLoggedIn: Boolean;
  isNewUser: Boolean;
}
const MainNavigator: React.FC<MainNavigatorProps> = ({
  isLoggedIn,
  isNewUser,
}) => {
  console.log(isLoggedIn,isNewUser,"isLoggedin")
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName={
        isLoggedIn
          ? isNewUser
            ? 'Registration' // If the user is logged in and is a new user, navigate to the 'Registration' screen.
            : 'Home' // If the user is logged in but is not a new user, navigate to the 'Home' screen.
          : 'Onboarding' // If the user is not logged in, navigate to the 'Onboarding' screen.
      }
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationTypeForReplace: 'push',
          animation: 'slide_from_left',
          animationDuration: 2000,
          contentStyle: {backgroundColor: 'rgb(0, 0, 0)'},
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
