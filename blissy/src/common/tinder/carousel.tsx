import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Carousel from "react-native-snap-carousel";
import SwipeableCard from './swipeablecard';
import { HealerProfileData, ProfileData } from '../../mockdata/healerData';
import colors from '../../constants/colors';

const HealerCarousel = () => {
  const [profiles, setProfiles] = useState(HealerProfileData);
  const carouselRef = useRef(null);

  const handleSnapToItem = (index:number) => {
    console.log('Snapped to item:', index);
  };

  const renderItem = ({ item, index }:{item:ProfileData,index:number}) => (
    <SwipeableCard key={index} data={item}/>
  );

  const { width:screenWidth,height:screenHeight } = useWindowDimensions();

  return (
      <Carousel
        ref={carouselRef}
        layout="tinder"
        data={profiles}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        // slideStyle={{backgroundColor:"red"}}
        sliderHeight={screenHeight}
        itemWidth={screenWidth * 0.9}
        onSnapToItem={handleSnapToItem}
        inactiveSlideScale={0.8}
        inactiveSlideOpacity={0.6}
        enableMomentum={true}
        lockScrollWhileSnapping={true}
      />
  );
};

export default HealerCarousel;

