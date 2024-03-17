import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SCREEN_HEIGHT, actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const { width: windowWidth } = Dimensions.get('window');

// Define the CarouselItem type if not already defined
type CarouselItem = {
  id: string;
  imageUrl: string;
  content: string;
  subContent:string;
};

const AutoScrollCarousel: React.FC = () => {
  // Sample data for the carousel
  const data: CarouselItem[] = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1710563138874-4bac91c14e51?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D',
      content: 'Listen First',
      subContent:" to understand before being understood. Reflect before you reply"
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1682686580433-2af05ee670ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D',
      content: 'Stay Calm',
      subContent:" to understand before being understood. Reflect before you reply"
    },
    {
      id: '3',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1709310749200-128c0085b84d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D',
      content: 'Speak Clearly',
      subContent:'Use "I" statements to express your feelings without blaming'
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1707343848610-16f9afe1ae23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D',
      content: 'Stay Present',
      subContent:"Focus on the current issue, avoiding past conflicts"
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1710172510134-b77b8fb44ea2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D',
      content: 'Find Common Ground',
      subContent:"Look for areas of agreement as a basis for understanding"
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1682685797527-63b4e495938f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw0MXx8fGVufDB8fHx8fA%3D%3D',
      content: 'Validate Feelings',
      subContent:"Acknowledge both sides. Validation shows empathy"
    },
    {
      id: '7',
      imageUrl: 'https://images.unsplash.com/photo-1707343843344-011332037abb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D',
      content: 'Agree to Revisit',
      subContent:"It's okay to pause and plan to discuss later if emotions run high"
    },
    // Add more items as needed
  ];

  const scrollX = useRef(new Animated.Value(0)).current; // Current scroll position
  const [currentIndex, setCurrentIndex] = useState(0); // Current index of the carousel
  const flatListRef = useRef<Animated.FlatList<CarouselItem>>(null); // Ref to the FlatList

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the next index
      let nextIndex = currentIndex + 1;
      if (nextIndex >= data.length) {
        nextIndex = 0; // Loop back to the start
      }
      // Scroll to the next item
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // Change slides every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentIndex]);

  return (
    <View>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true } // Enable native driver for smooth animation
        )}
        renderItem={({ item, index }) => {
          // Calculate opacity for each item based on scroll position
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * windowWidth, // Previous item
              index * windowWidth, // Current item
              (index + 1) * windowWidth, // Next item
            ],
            outputRange: [0.3, 1, 0.3], // Fade out the previous and next item
            extrapolate: 'clamp', // Clamp so items don't fade beyond this range
          });

          return (
            <Animated.View style={[styles.itemContainer, { opacity }]}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.subContent}>{item.subContent}</Text>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: actuatedNormalize(450),
  },
  content: {
    marginTop: actuatedNormalize(30),
    fontSize:actuatedNormalize(22),
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  subContent:{
    color:colors.gray,
    textAlign:"center",
    fontFamily:fonts.NexaRegular,
    fontSize:actuatedNormalize(14),
    width:"80%"
  }
});

export default AutoScrollCarousel;
