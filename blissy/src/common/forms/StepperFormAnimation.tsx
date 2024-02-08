import React from 'react';
import { View, StyleSheet, Button, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface StepperFormAnimationProps {
  children: React.ReactNode[];
  currentStep: number;
  onNext: () => void;
}

const StepperFormAnimation: React.FC<StepperFormAnimationProps> = ({
  children,
  currentStep,
  onNext,
}) => {
  const translateY = useSharedValue(0);
  const {width: SCREEN_WIDTH} = useWindowDimensions();

//   React.useEffect(() => {
//     translateY.value = withTiming(-currentStep * 100);
//   }, [currentStep]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: translateY.value }],
//     };
//   });

const lottieAnimationStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      currentStep,
      [
        (currentStep - 1) * SCREEN_WIDTH,
        currentStep * SCREEN_WIDTH,
        (currentStep + 1) * SCREEN_WIDTH,
      ],
      [200, 0, -200],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{translateY: translateYAnimation}],
    };
  });

  return (
    <>
      <View style={styles.container}>
        <Animated.View style={[styles.formContainer, lottieAnimationStyle]}>
          {children.map((child, index) => (
            <View key={index}>
              {(index+1) === currentStep && child}
            </View>
          ))}
        </Animated.View>
      </View>
      {currentStep <= children.length - 1 && (
        <Button title="Next" onPress={onNext} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: 400, // height of the form container
      maxHeight: '100%',
    },
    form: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default StepperFormAnimation;