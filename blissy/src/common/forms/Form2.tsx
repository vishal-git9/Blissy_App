// Form2.tsx
import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import InterestSelect from '../selectable/interestSelectable';
import Modal from 'react-native-modal';
const Form2: React.FC = () => {
  return (
    <View style={[styles.container]}>
      <InterestSelect
        selectedInterests={[]}
        interests={[
          {iconName: 'school', text: 'Education'},
          {iconName: 'music-note', text: 'Music'},
          {iconName: 'sports-soccer', text: 'Sports'},
          {iconName: 'game-controller', text: 'Gaming'},
          {iconName: 'local-cafe', text: 'Coffee'},
          {iconName: 'movie', text: 'Movies'},
          {iconName: 'fitness-center', text: 'Fitness'},
          {iconName: 'book', text: 'Reading'},
          {iconName: 'camera', text: 'Photography'},
          {iconName: 'art-track', text: 'Art'},
          // Add more interests as needed
        ]}
        onSelectInterest={interest => console.log(interest)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default Form2;
