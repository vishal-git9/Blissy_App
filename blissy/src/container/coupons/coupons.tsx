import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated as NativeAnimated, FlatList, UIManager, Platform, LayoutAnimation} from 'react-native';
import {NavigationStackProps} from '../Prelogin/onboarding';
import {RouteBackButton} from '../../common/button/BackButton';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {AuthSelector} from '../../redux/uiSlice';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';
import RewardCard from '../../common/cards/rewardCard';
import {Empty} from '../../common/Empty/Empty';
import CouponCard from './CouponCard';
import {AnimatedFlashList, FlashList} from '@shopify/flash-list';
import Swipable from './TestAnimation';
import Typewriter from '../../common/animation/Typewritter';

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
type animatedProps = {
  value: any;
  duration: any;
};

export const Coupons: React.FC<NavigationStackProps> = ({navigation}) => {
  const {user} = useSelector(AuthSelector);
  const [points, setPoints] = useState(0);
  const flashListRef = useRef<FlashList<any>>(null);
  const initialCoupons = [
    {id: 1, name: 'Summer Sale', rewardPoints: 5},
    {id: 2, name: 'Winter Sale', rewardPoints: 10},
    {id: 3, name: 'Spring Sale', rewardPoints: 7},
    {id: 4, name: 'Winter Sale', rewardPoints: 10},
    {id: 5, name: 'Spring Sale', rewardPoints: 7},
    // {id: 6, name: 'Winter Sale', rewardPoints: 10},
    // {id: 7, name: 'Spring Sale', rewardPoints: 7},
    // {id: 8, name: 'Winter Sale', rewardPoints: 10},
    // {id: 9, name: 'Spring Sale', rewardPoints: 7},
  ];

  const [coupons, setCoupons] = useState(initialCoupons);

  const addPoints = (rewardAmount: number) => {
    setPoints(points + rewardAmount); // Add 100 points for example
  };

  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut, 
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };
  const handleClaimCoupon = (id: number, rewardPoints: number) => {
    addPoints(rewardPoints);
    // setTimeout(() => {
      setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon.id !== id));
      flashListRef.current?.prepareForLayoutAnimationRender();
      LayoutAnimation.configureNext(layoutAnimConfig);
    // }, 500);
  };

  return (
    <View style={styles.container}>
      <RouteBackButton onPress={() => navigation.goBack()} />
      <View style={styles.header}>
        <View style={styles.titleBar}>
          <Text style={styles.username}>Hi , {user?.name?.split(' ')[0]}</Text>
        </View>
        <LottieView
          autoPlay
          loop
          source={require('../../../assets/animation/hey.json')}
          style={{
            width: actuatedNormalize(300),
            height: actuatedNormalize(300),
            alignSelf: 'center',
          }}
        />
      </View>
      <View style={styles.cardContainer}>
        <RewardCard coins={5} shouldAnimate={false} coinsAdded={points} />
      </View>
      <View style={styles.badge}>
      {/* <Text style={styles.text}>Healers will soon be available for you.</Text> */}
      <Typewriter loop={false} text='You can use POINTS once the Healers get Listed' speed={50} />
    </View>
      <View style={{flex:1}}>
        <AnimatedFlashList
        
          data={coupons}
          ref={flashListRef}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            return (
              // <Swipable>
                <CouponCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  rewardPoints={item.rewardPoints}
                  onPressClaim={() =>
                    handleClaimCoupon(item.id, item.rewardPoints)
                  }
                />
              // </Swipable>
            );
          }}
          estimatedItemSize={100}
          ListEmptyComponent={<Empty head="You Don't have enough Coupons" description="Get on calls to get more" />}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  username: {
    color: colors.white,
    fontFamily: fonts.NexaBold,
    fontSize: actuatedNormalize(30),
  },
  titleBar: {
    backgroundColor: 'transparent',
    marginTop: actuatedNormalize(40),
    height: actuatedNormalize(40),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  cardContainer: {
    // width:'90%',
    marginTop: actuatedNormalize(-45),
    alignItems: 'center',
  },
  header: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    height: actuatedNormalize(HEADER_MAX_HEIGHT),
    borderBottomRightRadius: actuatedNormalize(40),
    borderBottomLeftRadius: actuatedNormalize(40),
  },
  listContainer:{
    padding:actuatedNormalize(5)
  },
  badge:{
    backgroundColor: colors.primary,
    // padding:actuatedNormalize(5)
    // marginHorizontal:actuatedNormalize(8),
    // alignSelf:"center",
    borderRadius: actuatedNormalize(5), 
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(8),
  }
});
