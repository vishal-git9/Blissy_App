import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';

export type ProfileData = {
  data : {
    age: number;
    name: string;
    bio: string;
    imageUrl: string;
    gender: string;
    calls: string;
    rating?: number;
  }
  callAction?: () => void; // Function type for call action
  chatAction?: () => void; // Function type for chat action
};

const SwipeableCard:React.FC<ProfileData> = ({ data,callAction,chatAction }) => {
  const { age, name, bio, imageUrl, gender, calls, rating } = data;
console.log(imageUrl,"imageurl")

  const handleCallPress = () => {
    callAction && callAction(); // Execute call action if provided
  };

  const handleChatPress = () => {
    chatAction && chatAction(); // Execute chat action if provided
  };

  return (
    <View style={styles.parent}>
      {/* Image with age overlay */}
      <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.age}>{age}</Text>
        <AntDesign
          name={gender === 'male' ? 'man' : 'woman'}
          size={20}
          style={styles.genderIcon}
        />
      </View>

      {/* Profile info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bio}>{bio}</Text>

        <View style={styles.statsRow}>
          <MaterialIcons color={colors.skyBlue} name="supervised-user-circle" size={actuatedNormalize(22)} style={styles.statIcon} />
          <Text style={styles.statText}>{calls}</Text>
          {rating && (
            <>
              <View style={styles.statDivider} />
              <MaterialIcons color = {colors.yellow} name="star" size={actuatedNormalize(22)} style={styles.statIcon} />
              <Text style={styles.statText}>{rating}</Text>
            </>
          )}
        </View>

        {/* Option buttons */}
        <View style={styles.optionsContainer}>
            <View style={styles.optionsMenu}>
              <TouchableOpacity onPress={handleCallPress}>
                <AntDesign name="phone" size={24} style={styles.optionsMenuItem} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChatPress}>
                <MaterialIcons name="chat" size={24} style={styles.optionsMenuItem} />
              </TouchableOpacity>
            </View>
          
        </View>
      </View>
      </View>
    </View>
  );
};

export default SwipeableCard;

const styles = StyleSheet.create({
    parent:{
        justifyContent:"center",
        alignItems:"center",
        height:"100%"
    },
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
    margin: 10,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    height: '50%',
    objectFit:'cover'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  age: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
    fontFamily:fonts.NexaBold
  },
  genderIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: actuatedNormalize(20),
    fontFamily:fonts.NexaXBold
  },
  bio: {
    fontSize: actuatedNormalize(16),
    marginTop: 5,
    fontFamily:fonts.NexaRegular
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 5,
  },
  statText: {
    fontSize: actuatedNormalize(16),
    fontFamily:fonts.NexaRegular,
  },
  statDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  optionsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsIcon: {
    marginRight: 10,
  },
  optionsMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: 'column',
  },
  optionsMenuItem: {
    padding: 10,
  },
});
