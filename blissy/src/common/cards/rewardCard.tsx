import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card, Title, Paragraph} from 'react-native-paper';
import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import * as Animatable from 'react-native-animatable';
import {fonts} from '../../constants/fonts';
interface Props {
  shouldAnimate?: boolean;
  coins: String;
}

const RewardCard: React.FC<Props> = ({shouldAnimate, coins}) => {
  return (
    <Animatable.View
      style={{}}
      animation={shouldAnimate ? 'bounceInLeft' : undefined}
      useNativeDriver={true}
      iterationCount={1}
      delay={500 * 500}>
      <Card style={styles.card} elevation={5}>
        {/* <Card.Cover source={{ uri: imageUrl }} /> */}
        <Card.Content>
          <View style={styles.header}>
            <View style={{width:'30%', alignItems:'center'}}>
              <View style={[styles.iconContainer]}>
                <Ionicons
                  style={{marginBottom: actuatedNormalize(15)}}
                  name="gift"
                  size={35}
                  color={colors.white}
                />
              </View>
            </View>
            <View style={styles.details}>
              <Title
                style={{
                  color: colors.white,
                  fontFamily: fonts.NexaBold,
                  fontSize: 30,
                }}>
                {coins}
              </Title>
                <Text
                    style={{
                      color: colors.white,
                      fontFamily:fonts.NexaBold,
                      fontSize: actuatedNormalize(16),
                    }}>
                    Reward Points
                  </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  card: {
    // position: 'absolute',
    marginBottom: 20,
    backgroundColor: colors.green2,
    padding: actuatedNormalize(10),
    // width:'90%',
    borderRadius: actuatedNormalize(20), 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    marginLeft: 10,
  },
  iconContainer: {
    width: actuatedNormalize(60),
    height: actuatedNormalize(60),
    borderRadius: actuatedNormalize(50),
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RewardCard;
