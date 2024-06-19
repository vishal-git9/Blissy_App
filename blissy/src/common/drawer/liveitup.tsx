import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';

const LiveItUpComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Live</Text>
      <Text style={styles.mainText}>it up!</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Crafted with </Text>
        <Icon name="heart" size={16} color="red" />
        <Text style={styles.footerText}> in Delhi, India</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#f5f5f5',
    justifyContent:"center",
    padding: actuatedNormalize(20),
    marginTop:actuatedNormalize(50)
  },
  mainText: {
    fontSize: actuatedNormalize(50),
    color: '#7f7f7f',
    fontFamily:fonts.NexaXBold,
    alignSelf:"flex-start",
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: actuatedNormalize(20),
  },
  footerText: {
    fontSize: actuatedNormalize(16),
    fontFamily:fonts.NexaRegular,
    color: '#7f7f7f',
  },
});

export default LiveItUpComponent;
