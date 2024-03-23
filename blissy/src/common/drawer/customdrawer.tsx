import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../constants/colors';
import {SCREEN_HEIGHT, actuatedNormalize} from '../../constants/PixelScaling';
import {fonts} from '../../constants/fonts';
import * as Animatable from 'react-native-animatable';
import Styles from '../../constants/styles';
import {ModalComponent} from '../modals/modalcomponent';
import {LabelWithIcon} from './iconlabel';
import { DrawerUserInterface, ProfileBox } from './profilebox';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/uiSlice';

const user: DrawerUserInterface = {
  mobileNumber: "1234567890",
  role: "user",
  name: "John Doe",
  username: "johndoe",
  age: 30,
  gender: "male",
  interest: ["Music", "Sports", "Cooking"],
  language: ["English", "Spanish"],
  profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  coins: "100",
};

const CustomDrawer: React.FC<any> = props => {
  const [ConfirmModal, setConfirmModal] = useState<boolean>(false);

  const dispatch = useDispatch()

  console.log(props,"props of drawer")

  const confirmModalBody = (
    <Animatable.View
      animation={'bounceIn'}
      duration={500}
      easing={'ease-in'}
      style={styles.modalCardCont}>
      <View style={styles.modalChildContainer}>
        <View style={[styles.cardStyle]}>
          <Animatable.Text
            animation="bounceIn"
            duration={500}
            delay={500}
            style={styles.textStyle}
            iterationCount={2}>
            Really want to Log Out ?
          </Animatable.Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setConfirmModal(false);
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Animatable.View
                  style={[
                    Styles.neuoMorphism,
                    {borderRadius: 50, backgroundColor: 'white', padding: 5},
                  ]}
                  animation="rotate"
                  delay={500}
                  iterationCount={1}>
                  <Entypo name={'emoji-happy'} color={colors.primary} size={35} />
                </Animatable.View>
                <Text style={[styles.textStyle,{marginTop:actuatedNormalize(5)}]}>No</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setConfirmModal(false);
                props.navigation.closeDrawer()
                dispatch(logoutUser());
                props.navigation.replace('Login');
                // console.log('Yes');
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Animatable.View
                  animation="rotate"
                  delay={600}
                  style={[
                    Styles.neuoMorphism,
                    {borderRadius: 50, backgroundColor: 'white', padding: 5},
                  ]}
                  iterationCount={1}>
                  <Entypo name={'emoji-sad'} color={colors.red} size={35} />
                </Animatable.View>
                <Text style={[styles.textStyle,{marginTop:actuatedNormalize(5)}]}>Yes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animatable.View>
  );

  return (
    <View style={{flex: 1, marginTop: actuatedNormalize(15)}}>
      <DrawerContentScrollView {...props}>
        <ProfileBox {...user}/>
        <View style={{flex: 1, marginTop: actuatedNormalize(15)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              columnGap: actuatedNormalize(10),
            }}>
            <Text
              style={{
                color: colors.gray,
                fontSize: actuatedNormalize(16),
                fontFamily: fonts.NexaRegular,
              }}>
              For You
            </Text>
            <View
              style={{
                flex: 1,
                borderTopWidth: 0.5,
                borderTopColor: colors.gray,
              }}
            />
          </View>

          {/* Drawer item list */}
          <View style={{marginTop: actuatedNormalize(10)}}>
            <DrawerItemList {...props} />
          </View>

          {/* communication */}
          <View style={{width: '90%', alignSelf: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: actuatedNormalize(10),
                marginTop: actuatedNormalize(10),
              }}>
              <Text
                style={{
                  color: colors.gray,
                  fontSize: actuatedNormalize(16),
                  fontFamily: fonts.NexaRegular,
                }}>
                Communication
              </Text>
              <View
                style={{
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderTopColor: colors.gray,
                }}
              />
            </View>
            <View
              style={{
                rowGap: actuatedNormalize(20),
                marginTop: actuatedNormalize(20),
              }}>
              <LabelWithIcon iconName="bug" label="Report a Problem" />
              <LabelWithIcon iconName="pencil" label="Write a Review" />
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: actuatedNormalize(20),
          borderTopWidth: 0.5,
          borderTopColor: colors.gray,
        }}>
          <View style={{rowGap:actuatedNormalize(20)}}>
          <LabelWithIcon iconName="share-social-outline" label="Tell a Friend" />
        <LabelWithIcon
          onPress={() => setConfirmModal(true)}
          iconName="exit-outline"
          label="Sign Out"
        />
          </View>
        
      </View>
      <ModalComponent
        children={confirmModalBody}
        modalVisible={ConfirmModal}
        setModalVisible={setConfirmModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    elevation: 5, // Add elevation for shadow
  },
  cardStyle: {
    backgroundColor: colors.black,
    padding: 22,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  textStyle: {
    color: colors.lightGray,
    fontSize: actuatedNormalize(18),
    marginBottom: actuatedNormalize(12),
    fontFamily: fonts.NexaBold,
  },
  iconStyle: {
    marginBottom: actuatedNormalize(12),
  },
  Modalview: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalCardCont: {
    flex: 1,
    width: '100%',
    bottom: actuatedNormalize(-20),
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  modalChildContainer: {
    height: SCREEN_HEIGHT / 4,
  },
});

export default CustomDrawer;
