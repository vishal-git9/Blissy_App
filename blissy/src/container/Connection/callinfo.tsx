import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import SwipeableRow from '../../common/animation/swipetodelete';
import { SegmentedControl } from '../../common/tab/segmented';
import { defaultStyles } from '../../common/styles/defaultstyles';
import { formatDateTime, getFormattedDate } from '../../utils/formatedateTime';
import colors from '../../constants/colors';
import { CallInfoData as calls } from '../../mockdata/call';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import { HeaderComponent } from '../../common/header/screenheader';
import { useGetmyCallInfoQuery } from '../../api/callService';
import PullToRefresh from '../../common/refresh/pull';
import { NavigationStackProps } from '../Prelogin/onboarding';
import SearchBar from '../../common/header/searchbar';

const transition = CurvedTransition.delay(100);

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CalllistData: React.FC<NavigationStackProps> = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState('All');
  const [items, setItems] = useState(calls);
  const [searchQuerytext, SetsearchQuerytext] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false);
  const editing = useSharedValue(-30);
  const [searchQueryData, setsearchQueryData] = useState(items)
  const { refetch, isLoading, isError, isSuccess } = useGetmyCallInfoQuery({})
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [heightIncreased,setHeightIncreased] = useState<boolean>(false)
  const height = useSharedValue(100);




  React.useEffect(() => {
    console.log("hi-->", isSearchActive)
    if (isSearchActive) {
      navigation.setOptions({
        headerShown: false,
        // headerRight:()=><Searchbar value='bar'/>
      });
    } else {
      navigation.setOptions({
        headerShown: true,

        // headerRight:()=><Searchbar value='bar'/>
      });
    }
  }, [navigation, isSearchActive]);

  const onSegmentChange = (option: string) => {
    setSelectedOption(option);
    if (option === 'All') {
      setItems(calls);
    } else {
      setItems(calls.filter((call) => call.missed));
    }
  };

  const handleSearchFriendsQuery = useCallback((text: string) => {
    console.log(text, 'text---->')
    SetsearchQuerytext(text)
    const Searchfiltered = items.filter(user =>
      user.name.toLowerCase().startsWith(text.toLowerCase())
    );
    setsearchQueryData(Searchfiltered)
  }, [selectedOption, searchQuerytext])

  const removeCall = (toDelete: any) => {
    Vibration.vibrate(500);
    setItems(items.filter((item) => item.id !== toDelete.id));
  };

  const onEdit = () => {
    let editingNew = !isEditing;
    editing.value = editingNew ? 0 : -30;
    setIsEditing(editingNew);
  };

  const animatedRowStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  const animatedPosition = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  useEffect(() => {
    height.value = withTiming(isSearchActive ? 10 : 100, { duration: 500 }, (finished) => {
      if (finished) {
        runOnJS(setHeightIncreased)(true);
      }
    });  
  },[isSearchActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });


  return (
      <View style={{ flex: 1 }}>
        {/* <HeaderComponent title='Calls' onPress={()=>console.log("back")}/> */}
        <Animated.View style={[animatedStyle, { marginTop: actuatedNormalize(40),marginHorizontal:16 }]}>
          <SearchBar height={height.value} querytext={searchQuerytext} isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} onSearch={handleSearchFriendsQuery} />
        </Animated.View>
        {!isSearchActive && <View style={styles.header}>

          <SegmentedControl
            options={['All', 'Missed']}
            selectedOption={selectedOption}
            onOptionPress={onSegmentChange}
          />
          <TouchableOpacity onPress={onEdit}>
            <Text style={{ color: colors.white, fontSize: actuatedNormalize(18), fontFamily: fonts.NexaRegular }}>
              {isEditing ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>}
        <PullToRefresh onRefresh={() => console.log("refreshed")} refreshing>

        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40, marginTop: actuatedNormalize(10) }}>
          <Animated.View style={[defaultStyles.block, { borderTopColor: colors.lightGray, borderWidth: 2 }]} layout={transition}>
            <Animated.FlatList
              skipEnteringExitingAnimations
              data={isSearchActive ? searchQueryData : items}
              scrollEnabled={false}
              //             showsVerticalScrollIndicator={false}
              // showsHorizontalScrollIndicator={false}
              itemLayoutAnimation={transition}
              keyExtractor={(item) => item.id.toString()}
              // ItemSeparatorComponent={() => <View style={defaultStyles.separator} />}
              renderItem={({ item, index }) => (
                <SwipeableRow onDelete={() => removeCall(item)}>
                  <Animated.View
                    entering={FadeInUp.delay(index * 20)}
                    exiting={FadeOutUp}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <AnimatedTouchableOpacity
                      style={[animatedPosition, { paddingLeft: 8 }]}
                      onPress={() => removeCall(item)}
                    >
                      <Ionicons name="remove-circle" size={24} color={colors.red} />
                    </AnimatedTouchableOpacity>
                    <Animated.View
                      style={[defaultStyles.item, { paddingLeft: 10 }, animatedRowStyles]}
                    >
                      <Image source={{ uri: item.img }} style={styles.avatar} />
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={{ fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(18), color: item.missed ? colors.lightRed2 : colors.white }}>
                          {item.name}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: actuatedNormalize(6), alignItems: "center" }}>
                          <Ionicons name={item.video ? 'videocam' : 'call'} size={16} color={colors.gray} />
                          <Text style={{ fontSize: actuatedNormalize(14), color: colors.gray, flex: 1, fontFamily: fonts.NexaItalic }}>
                            {item.incoming ? 'Incoming' : 'Outgoing'}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: actuatedNormalize(12), color: colors.gray, fontFamily: fonts.NexaRegular }}>{getFormattedDate(item.date)}</Text>
                        {/* <Ionicons name="information-circle-outline" size={24} color={colors.primary} /> */}
                      </View>
                    </Animated.View>
                  </Animated.View>
                </SwipeableRow>
              )}
            />
          </Animated.View>
        </ScrollView>
        </PullToRefresh>

      </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: actuatedNormalize(16),
    alignItems: "center",
    marginTop: actuatedNormalize(5)
    // backgroundColor: colors.dark,
  },
  avatar: {
    width: actuatedNormalize(50),
    height: actuatedNormalize(50),
    borderRadius: actuatedNormalize(30),
  },
});
export default CalllistData;