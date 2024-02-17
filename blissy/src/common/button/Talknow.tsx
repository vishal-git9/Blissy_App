import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const TalkNowButton = () => {
  return (
    <TouchableOpacity style={styles.buttonContainer}>
      <Text style={styles.buttonText}>Call Now</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 2,
    borderColor: '#00ff00', // Initial border color (green)
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    // Glowing effect
    shadowColor: '#00ff00', // Green shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: actuatedNormalize(16),
    color:colors.white,
    fontFamily:fonts.NexaBold
  },
});

export default TalkNowButton;
