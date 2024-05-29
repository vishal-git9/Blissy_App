// src/components/SlidingIcon.tsx
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SlidingIconProps {
  onSlideComplete: () => void;
  iconName: string;
  iconColor: string;
  direction: 'left' | 'right';
}

const SlidingIcon: React.FC<SlidingIconProps> = ({ onSlideComplete, iconName, iconColor, direction }) => {
  const translateX = useSharedValue(0);
  const iconWidth = useRef(0);
  const containerWidth = useRef(0);

  const gestureHandler = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (direction === 'right' && translateX.value > containerWidth.current / 2) {
        translateX.value = withTiming(containerWidth.current - iconWidth.current, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }, () => runOnJS(onSlideComplete)());
      } else if (direction === 'left' && translateX.value < -containerWidth.current / 2) {
        translateX.value = withTiming(-(containerWidth.current - iconWidth.current), {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }, () => runOnJS(onSlideComplete)());
      } else {
        translateX.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
      }
    } else {
      translateX.value = Math.min(Math.max(direction === 'left' ? -containerWidth.current + iconWidth.current : 0, event.nativeEvent.translationX), direction === 'right' ? containerWidth.current - iconWidth.current : 0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        containerWidth.current = event.nativeEvent.layout.width;
      }}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[styles.icon, animatedStyle]}
          onLayout={(event) => {
            iconWidth.current = event.nativeEvent.layout.width;
          }}
        >
          <Icon name={iconName} size={50} color={iconColor} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SlidingIcon;
