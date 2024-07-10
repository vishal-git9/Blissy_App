import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Pressable } from 'react-native';
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
import * as Animatable from 'react-native-animatable';
import StarRating from 'react-native-star-rating';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const ratingColors: {[key: number]: string} = {
    1: colors.red,
    1.5: colors.red,
    2: colors.red,
    2.5: colors.red,
    3: colors.lightGray,
    3.5: colors.lightGray,
    4: colors.gold,
    5: colors.yellow,
  };
interface UserreviewProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;

}

const UserreviewScreen: React.FC<UserreviewProps> = ({ navigation }) => {
    const [text, setText] = useState<string>('');
    const [rating, setRating] = useState(4);
    const ratingRef = useRef<Animatable.AnimatableComponent<any, any>>(null);  ;
    const color = ratingColors[rating] || colors.yellow;
  
    React.useLayoutEffect(()=>{
      navigation.setOptions(({
          headerShown: true,
          headerTitle: '',
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
          headerTransparent: true,
          headerLeft: ({ }) => (
              <Pressable onPress={navigation.goBack} style={{marginRight:10}}>
                  {/* <Ionicons name="arrow-back" size={24} color={colors.white} /> */}
                  <MaterialIcons name="segment" size={actuatedNormalize(30)} color={colors.white} />
              </Pressable >
            ),
          headerStyle: {
            backgroundColor: colors.transparent,
          },
              }))
  },[navigation])

    const handlePress = () => {
        console.log('Button Pressed with Text:', text);
        // Add your desired action here
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            {/* <RouteBackButton onPress={() => navigation.goBack()} /> */}
            <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(5) }}>App Review</Text>

            <TextInput
                style={styles.textarea}
                multiline={true}
                numberOfLines={6}
                onChangeText={setText}
                value={text}
                placeholder="Write your App review here..."
            />

<View style={styles.ratingContainer}>
          {/* <Animatable.Text
            animation={'fadeIn'}
            ref={ratingRef}
            style={{
              color: colors.white,
              fontSize: actuatedNormalize(20),
              fontFamily: fonts.NexaBold,
            }}>
            {rating >= 1 && rating <=2.5
              ? 'Bad'
              : rating >=3 && rating < 4
              ? 'Good'
              : rating === 4 || rating===4.5
              ? 'Great' : rating === 5 ? "Amazing"
              : null}
          </Animatable.Text> */}
          <StarRating
            disabled={false}
            rating={rating}
            halfStarEnabled={true}
            animation="rotate"
            emptyStarColor={colors.gray}
            starSize={20}
            fullStarColor={color}
            activeOpacity={1}
            selectedStar={rating => {
              if (ratingRef.current?.fadeIn) {
                ratingRef.current?.fadeIn(800);
              }

              setRating(rating)
            }}
            containerStyle={{width: '50%'}}
          />
        </View>
            <PrimaryButton styles={{width:"100%",marginTop:actuatedNormalize(40)}} label='Send' handleFunc={handlePress} />
            <LiveItUpComponent/>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: actuatedNormalize(20),
        
    },
    ratingContainer: {
        width: '100%',
        rowGap: actuatedNormalize(10),
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        // backgroundColor:colors.dark,
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
