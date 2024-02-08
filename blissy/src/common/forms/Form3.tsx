// Form3.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const Form3: React.FC = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Form 1 Input" />
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

export default Form3;
