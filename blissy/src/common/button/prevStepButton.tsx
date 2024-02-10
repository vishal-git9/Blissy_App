import React from 'react';
import { TouchableOpacity, View, StyleSheet, Button } from 'react-native';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { NavigationStackProps } from '../../container/Prelogin/onboarding';

interface BackButtonProps {
  onpress: () => void;
}

const PrevStepButton: React.FC<BackButtonProps> = ({ onpress }) => {
  return (
    <TouchableOpacity onPressIn={onpress} style={styles.container}>
      <View style={styles.button}>
        <FontAwesome5 name="angle-left" size={15} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    // backgroundColor:"red",
    height:actuatedNormalize(35),
    width:actuatedNormalize(35),
    left: 20,
    zIndex: 100, // Ensure the button is on top of other components
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Transparent background
    borderRadius: 30, // Rounded border
    padding: actuatedNormalize(10),
    borderWidth:1,
    borderColor:colors.white,
    justifyContent:"center",
    alignItems:"center"
  },
});

export default PrevStepButton;