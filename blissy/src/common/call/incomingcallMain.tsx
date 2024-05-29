import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';

const IncomingCallScreen: React.FC = () => {
  return (
    <LinearGradient colors={[colors.primary, colors.dark]} style={styles.container}>
      <Text style={styles.callStatus}>Incoming Call</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }} // Replace with the caller's image URL
        style={styles.callerImage}
      />
      <Text style={styles.callerName}>Katy Perry</Text>
      <Text style={styles.callerNumber}>+380 44 333 4545</Text>
      <TouchableOpacity style={styles.answerButton}>
        <Icon name="call" size={30} color="#fff" />
        <Text style={styles.answerText}>Slide to answer</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callStatus: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  callerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  callerName: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  callerNumber: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default IncomingCallScreen;
