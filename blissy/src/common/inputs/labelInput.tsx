import React, { Dispatch, useState } from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import { KeyboardTypeOptions, View, ViewStyle } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { fonts } from '../../constants/fonts';
import Styles from '../../constants/styles';
import colors from '../../constants/colors';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-vector-icons/Icon';
import { Action } from '../../container/Registration/Registration';

interface LabelInputProps {
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  onChangeText: Dispatch<Action>;
  type: string;
  name: string;
  value: string;
  id?: string;
  hasErrors?: boolean;
  errorText?: string;
  IconProvider?: typeof Icon;
  IconName?: string;
  editable?: boolean;
  hasEye?: boolean;
  secure?: boolean;
  labelStyle?:ViewStyle;
}

const LabelInputComponent: React.FC<LabelInputProps> = ({
  maxLength,
  keyboardType,
  placeholder,
  onChangeText,
  type,
  name,
  value,
  id,
  hasErrors,
  errorText,
  IconProvider,
  IconName,
  editable,
  hasEye,
  secure,
  labelStyle
}) => {
  const [eye, setEye] = useState(false);
console.log(name,"name")
  return (
    <View style={[labelStyle]}>
      <TextInput
        style={[styles.input, Styles.neuoMorphism]}
        placeholder={placeholder || name}
        underlineColor={colors.transparent}
        cursorColor={colors.primary}
        activeUnderlineColor={colors.transparent}
        contentStyle={{ fontFamily: fonts.NexaBold,color:colors.white }}
        value={value}
        editable={editable}
        left={
          IconProvider && (
            <TextInput.Icon
              style={[
                Styles.neuoMorphism,
                { backgroundColor: colors.primary, elevation: 15 },
              ]}
              color={colors.green2}
              icon={() => (
                <IconProvider name={IconName || ''} size={20} color={colors.white} />
              )}
            />
          )
        }
        id={id}
        theme={{
          colors: { primary: colors.primary },
        }}
        mode="flat"
        right={
          hasEye && (
            <TextInput.Icon
              forceTextInputFocus={false}
              onPress={() => setEye(!eye)}
              icon={() => (
                <Entypo
                  name={eye ? 'eye' : 'eye-with-line'}
                  size={20}
                  color={colors.primary}
                />
              )}
            />
          )
        }
        placeholderTextColor={'grey'}
        onChangeText={text => onChangeText({type:type,payload:text})}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secure && !eye}
      />
      {errorText && (
        <HelperText
          style={{ fontFamily: fonts.NexaRegular, fontSize: 10 }}
          type="error"
          visible={true}>
          {errorText}
        </HelperText>
      )}
    </View>
  );
};

export default LabelInputComponent;


const styles = StyleSheet.create({
    input: {
        backgroundColor: 'transparent',
        width: '100%',
        fontFamily:fonts.NexaXBold,
        borderWidth:0.5,
        borderRadius:20,
        borderTopRightRadius:20,
        borderTopLeftRadius:20
      },
})