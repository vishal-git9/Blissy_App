import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type OutgoingCallScreenProps = {
  otherUserId:string;
  setType: (type: string) => void;
};

export const OutgoingCallScreen: React.FC<OutgoingCallScreenProps> = ({
  otherUserId,
  setType,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#050A0E',
      }}>
      <View
        style={{
          padding: 35,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 14,
        }}>
        <Text
          style={{
            fontSize: 16,
            color: '#D0D4DD',
          }}>
          Calling to...
        </Text>

        <Text
          style={{
            fontSize: 36,
            marginTop: 12,
            color: '#ffff',
            letterSpacing: 6,
          }}>
          {otherUserId}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setType('JOIN');
          }}
          style={{
            backgroundColor: '#FF5D5D',
            borderRadius: 30,
            height: 60,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcons name="call-end" color={'white'} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
