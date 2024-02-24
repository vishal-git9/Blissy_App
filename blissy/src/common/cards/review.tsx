// Import necessary components and hooks from React Native and React
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View, StyleSheet } from 'react-native';
import ReviewCard, { ReviewCardProps } from './reviewCard';
import colors from '../../constants/colors';

// Sample reviews array

export const reviewsArray: ReviewCardProps[] = [
  {
    id: 1,
    userName: 'John Doe',
    userDesc: 'This product is amazing! Highly recommend to everyone.',
    rating: 5,
  },
  {
    id: 2,
    userName: 'Jane Smith',
    userDesc: 'Good quality, but took longer to arrive than expected.',
    rating: 4,
  },
  {
    id: 3,
    userName: 'Jane clark',
    userDesc: 'Good quality, but took longer to arrive than expected.',
    rating: 4,
  },
  {
    id: 4,
    userName: 'Jannie',
    userDesc: 'Good quality, but took longer to arrive than expected.',
    rating: 4,
  },
  {
    id: 5,
    userName: 'kunal',
    userDesc: 'Good quality, but took longer to arrive than expected.',
    rating: 4,
  },
  {
    id: 6,
    userName: 'rakhi',
    userDesc: 'Good quality, but took longer to arrive than expected.',
    rating: 4,
  },
  // Add more reviews as needed
];

// Define the Carousel component with props for the reviews array
interface AutoLoopCarouselProps {
  reviews: ReviewCardProps[];
}
const windowWidth = Dimensions.get('window').width;

// Assuming the Review type and ReviewCard component exist
interface Review {
  id: number;
  userName: string;
  userDesc: string;
  rating: number;
}

const AutoLoopCarousel: React.FC<AutoLoopCarouselProps> = ({reviews}) => {
  const scrollX = useRef(new Animated.Value(0)).current; // Animated value to control scroll position

  useEffect(() => {
    // Function to start the animation
    const startAnimation = () => {
      // Reset animation to starting position
      scrollX.setValue(0);

      // Animate from 0 to -width * (reviews.length) to slide all items to the left
      Animated.timing(scrollX, {
        toValue: -windowWidth * reviews.length,
        duration: 3000 * reviews.length, // Duration based on number of items to ensure smooth flow
        useNativeDriver: true,
      }).start(() => startAnimation()); // Loop the animation by calling startAnimation again
    };

    startAnimation(); // Start the animation when the component mounts
  }, []);




  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.scrollView,
          {
            // Creating a seamless flow by translating X based on scrollX value
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        {reviews.map((review, index) => (
          <View key={review.id} style={styles.card}>
            {/* Replace with your ReviewCard or custom content */}
            <ReviewCard {...review}/>
          </View>
        ))}
        {/* Duplicate reviews for a seamless looping effect */}
        {reviews.map((review, index) => (
          <View key={`duplicate-${review.id}`} style={styles.card}>
            <ReviewCard {...review}/>
          </View>
        ))}
      </Animated.View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Hide the overflowing content
  },
  scrollView: {
    flexDirection: 'row', // Arrange cards in a row
  },
  card: {
    width: windowWidth, // Each card takes full width of the screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20, // Add some padding around the content
  },
});

export default AutoLoopCarousel;
