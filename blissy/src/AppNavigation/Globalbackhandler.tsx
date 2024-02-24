import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './navigatorType';

const GlobalBackHandler: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const onBackPress = () => {
        console.log('backpressed')
      if (navigation.isFocused()) {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true; // prevent default behavior (app exit)
        }
        // Add your exit confirmation logic here if needed
      }
      return false; // let the default thing happen
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [navigation]); // Re-run this effect if the navigation prop changes

  return null; // This component doesn't render anything
};

export default GlobalBackHandler;
