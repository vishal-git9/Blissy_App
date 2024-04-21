import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar, Card, Title, Paragraph} from 'react-native-paper';
import colors from '../../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {actuatedNormalize} from '../../constants/PixelScaling';
import * as Animatable from 'react-native-animatable';
import {fonts} from '../../constants/fonts';
import TalkNowButton from '../button/Talknow';
interface Props {
  name: string;
  age: number;
  id: number;
  gender: string;
  rating: number;
  hours: string;
  bio: string;
  calls: string;
  ratingCount: number;
  imageUrl: string;
  shouldAnimate?:boolean
}

const ProfileCard: React.FC<Props> = ({
  name,
  age,
  gender,
  rating,
  hours,
  bio,
  calls,
  ratingCount,
  imageUrl,
  id,
  shouldAnimate
}) => {
  return (
    <Animatable.View style={{}} animation={shouldAnimate ? 'bounceInLeft' : undefined} useNativeDriver={true}  iterationCount={1} delay={id * 500}>
      <Card style={styles.card} elevation={5}>
        {/* <Card.Cover source={{ uri: imageUrl }} /> */}
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Image size={48} source={{uri: imageUrl}}/>
            <View style={styles.details}>
              <Title style={{color: colors.white, fontFamily: fonts.NexaBold}}>
                {name}
              </Title>
              <View style={styles.genderContainer}>
                <Icon
                  name={gender === 'male' ? 'gender-male' : 'gender-female'}
                  size={24}
                  color={gender === 'male' ? 'blue' : 'pink'}
                />
                <Text style={styles.age}>{age}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: actuatedNormalize(5),
            }}>
            <AntDesign
              style={{marginBottom: actuatedNormalize(15)}}
              name="user"
              size={16}
              color={colors.white}
            />
            <Paragraph numberOfLines={2} style={styles.bio}>
              {bio}
            </Paragraph>
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            <View style={{rowGap:actuatedNormalize(5)}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: actuatedNormalize(5),
                }}>
                <Ionicons name="call" size={14} color={colors.white} />
                <Paragraph style={styles.hours}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily:fonts.NexaBold,
                      fontSize: actuatedNormalize(16),
                    }}>
                    {calls}{' '}
                  </Text>
                  Calls completed
                </Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: actuatedNormalize(5),
                }}>
                <AntDesign name="star" size={14} color={colors.yellow} />
                <Text style={styles.rating}>
                  {rating} ({ratingCount})
                </Text>
              </View>
            </View>
            <TalkNowButton label='Coming Soon..' onPress={()=>console.log("first")}/>
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    paddingHorizontal:actuatedNormalize(5),
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: actuatedNormalize(5),
  },
  age: {
    fontSize: actuatedNormalize(16),
    color: colors.gray,
  },
  bio: {
    fontSize: actuatedNormalize(14),
    fontFamily: fonts.NexaRegular,
    color: colors.gray,
  },
  hours: {
    fontSize: actuatedNormalize(14),
    color: colors.gray,
  },
  rating: {
    fontSize: actuatedNormalize(14),
    fontFamily: fonts.NexaRegular,
    color: colors.gray,
  },
});

export default ProfileCard;
