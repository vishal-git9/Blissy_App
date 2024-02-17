import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, BackHandler} from 'react-native';
import colors from '../../constants/colors';
import {Loader} from '../../common/loader/loader';
import {Button} from 'react-native';
import {NavigationStackProps} from '../Prelogin/onboarding';
import TopBar from '../../common/tab/topbar';
import {ToggleButton} from '../../common/tab/switch';
import {FlatList} from 'react-native';
import ProfileCard from '../../common/cards/healercard';
import {HealerMockData} from '../../mockdata/healerData';
import {actuatedNormalize} from '../../constants/PixelScaling';

export const HomeScreen: React.FC<NavigationStackProps> = ({navigation}) => {
  const [data, setData] = useState(HealerMockData.slice(0, 10)); // Initial data for first 10 cards
  const [value, setValue] = useState<string>('healers');
  // Function to load more cards
  const loadMoreData = () => {
    setData(prevData => {
      const nextIndex = prevData.length;
      const newData = HealerMockData.slice(nextIndex, nextIndex + 10); // Load next 10 cards
      return [...prevData, ...newData];
    });
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp(); // Close the app when back button is pressed
        return true; // Return true to prevent default behavior (going back)
      },
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ToggleButton value={value} setValue={setValue} />
      {value === 'healers' ? (
        <View style={styles.healerContainer}>
          <FlatList
            data={data}
            renderItem={({item}) => <ProfileCard {...item} />}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreData} // Load more data when user reaches the end
            onEndReachedThreshold={0.1} // Load more when 90% of the list is scrolled
          />
        </View>
      ) : (
        <View style={styles.peopleContainer}>
          <Text style={{color:colors.white}}>This is People screen</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  healerContainer: {
    marginTop: actuatedNormalize(40),
    width: '90%',
    paddingBottom: actuatedNormalize(200),
  },
  peopleContainer:{
    marginTop: actuatedNormalize(40),
    width: '90%',
    justifyContent:"center",
    alignItems:"center"
  }
});
