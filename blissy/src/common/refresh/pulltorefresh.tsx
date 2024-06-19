import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PullToRefreshProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ refreshing, onRefresh, children }) => {
  const translateY = useSharedValue(0);
  const [isRefreshing, setIsRefreshing] = useState(refreshing);
  const [refreshText, setRefreshText] = useState('');

  const maxPullDistance = 150;

  useEffect(() => {
    if (!refreshing) {
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [refreshing, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const textOpacity = useSharedValue(0);
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const resetTextAndRefreshState = useCallback(() => {
    setRefreshText('');
    setIsRefreshing(false);
    translateY.value = withTiming(0, { duration: 300 }); // Reset translateY here
  }, [translateY]);

  const finishRefresh = useCallback(() => {
    setRefreshText('Data Refreshed');
    textOpacity.value = withTiming(1, { duration: 300 });

    // Use a delayed animation to reset the text and refresh state
    textOpacity.value = withDelay(1000, withTiming(0, { duration: 300 }, () => {
      runOnJS(resetTextAndRefreshState)();
    }));
  }, [textOpacity, resetTextAndRefreshState]);

  const handleRefresh = useCallback(() => {
    setRefreshText('Hang on...');
    textOpacity.value = withTiming(1, { duration: 300 });

    setIsRefreshing(true);
    onRefresh();

    runOnJS(setTimeout)(() => {
      runOnJS(finishRefresh)();
    }, 2000);
  }, [onRefresh, finishRefresh]);

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { y: number }>({
    onStart: (_, ctx) => {
      ctx.y = translateY.value;
    },
    onActive: (event, ctx) => {
      const pullDistance = ctx.y + event.translationY;
      translateY.value = pullDistance < maxPullDistance ? pullDistance : maxPullDistance;
      if (translateY.value > 10 && !isRefreshing) {
        runOnJS(setRefreshText)('Pull down to refresh...');
        textOpacity.value = withTiming(1, { duration: 300 });
      }
    },
    onEnd: () => {
      if (translateY.value >= maxPullDistance) {
        translateY.value = withTiming(maxPullDistance);
        textOpacity.value = withTiming(0, { duration: 300 });
        runOnJS(handleRefresh)();
      } else {
        translateY.value = withTiming(0, { duration: 300 });
        textOpacity.value = withTiming(0, { duration: 300 });
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Animated.Text style={[styles.pullDownText, textAnimatedStyle]}>{refreshText}</Animated.Text>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pullDownText: {
    textAlign: 'center',
    // marginVertical: 10,
    fontFamily:fonts.NexaRegular,
    fontSize: actuatedNormalize(16),
  },
});

export default PullToRefresh;
