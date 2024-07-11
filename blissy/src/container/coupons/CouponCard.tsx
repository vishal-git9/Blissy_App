import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent, Animated } from 'react-native';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import TalkNowButton from '../../common/button/Talknow';

interface CouponCardProps {
  name: string;
  rewardPoints: number;
  id:number;
  onPressClaim: (id:number,rewardAmount:number) => void;
}

const CouponCard: React.FC<CouponCardProps> = ({ name, rewardPoints, onPressClaim , id}) => {
    const [swipeAnimation] = useState(new Animated.Value(0));
    const [opacityAnimation] = useState(new Animated.Value(1));

    const handlePressClaim = () => {
      // Trigger swipe animation to the left
      Animated.parallel([
      Animated.timing(swipeAnimation, {
        toValue: -500, // Slide off screen
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 0, // Fade out
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
        // Callback function after animation completes (optional)
        onPressClaim(id, rewardPoints); // Execute the claim logic
      });
    };

  return (
    <Animated.View style={[styles.card,{
        transform: [
          {
            translateX: swipeAnimation,
          },
        ],
      }]}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Coupon</Text>
      </View> */}
      <View style={styles.content}>
        <View style={styles.nameContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rewardPoints}>Reward Points: {rewardPoints}</Text>
        </View>
        <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.claimButton} onPress={handlePressClaim}>
          <Text style={styles.buttonText}>Claim Now</Text>
        </TouchableOpacity> */}
        <TalkNowButton label='Claim Now' onPress={handlePressClaim} />

        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark,
    margin: actuatedNormalize(10),
    borderRadius: actuatedNormalize(10),
    overflow: 'hidden', // Ensures rounded corners are respected

  },
  header: {
    backgroundColor: '#007bff',
    paddingVertical: actuatedNormalize(10),
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: actuatedNormalize(20),
    flexDirection:'row',
    // justifyContent:'space-around'
  },
  name: {
    fontSize: actuatedNormalize(18),
    marginBottom: actuatedNormalize(10),
    textAlign: 'center',
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  rewardPoints: {
    fontSize: actuatedNormalize(16),
    marginBottom: actuatedNormalize(15),
    textAlign: 'center',
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  claimButton: {
    backgroundColor: colors.darkRed,
    paddingVertical: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(15),
    borderRadius: actuatedNormalize(5),
    alignSelf: 'center',
  },
  buttonContainer:{
    padding:actuatedNormalize(10),
    alignItems:'center',
    justifyContent:'center'
  },
  buttonText: {
    fontSize: actuatedNormalize(16),
    textAlign: 'center',
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  nameContainer:{
    borderRightWidth:actuatedNormalize(2),
    borderRightColor:colors.white,
    width:'65%',
    borderStyle:'dashed',
  }
});

export default CouponCard;
