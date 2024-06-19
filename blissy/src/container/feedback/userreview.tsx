import React, { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import { PrimaryButton } from '../../common/button/PrimaryButton';
import { RouteBackButton } from '../../common/button/BackButton';
import { Text } from 'react-native';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { actuatedNormalize } from '../../constants/PixelScaling';
import LiveItUpComponent from '../../common/drawer/liveitup';

interface UserreviewProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;

}

const UserreviewScreen: React.FC<UserreviewProps> = ({ navigation }) => {
    const [text, setText] = useState<string>('');

    const handlePress = () => {
        console.log('Button Pressed with Text:', text);
        // Add your desired action here
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <RouteBackButton onPress={() => navigation.goBack()} />
            <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(5) }}>App Review</Text>

            <TextInput
                style={styles.textarea}
                multiline={true}
                numberOfLines={6}
                onChangeText={setText}
                value={text}
                placeholder="Write your App review here..."
            />
            <PrimaryButton label='Send' handleFunc={handlePress} />
            <LiveItUpComponent/>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: actuatedNormalize(20),
        
    },
    textarea: {
        height: actuatedNormalize(200),
        padding: actuatedNormalize(10),
        marginBottom: actuatedNormalize(20),
        marginTop:actuatedNormalize(50),
        paddingHorizontal: actuatedNormalize(15),
        paddingVertical: actuatedNormalize(15),
        fontFamily:fonts.NexaRegular,
        color: colors.white,
        borderRadius: actuatedNormalize(20), // Updated for rounded corners
        backgroundColor: colors.dark, // Updated for the input background color
        textAlignVertical: 'top', // Ensures the text starts at the top
    },
    button: {
        paddingVertical: actuatedNormalize(10),
    },
});

export default UserreviewScreen;
