import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import Feather from 'react-native-vector-icons/Feather';
interface PermissionModalProps {
  visible: boolean;
  permissionType: string;
  close:()=>void;
}

const PermissionDenied: React.FC<PermissionModalProps> = ({
  visible,
  permissionType,
  close
}) => {
  return (
    <Modal
      isVisible={visible}
      hasBackdrop={false}
      backdropColor="transparent"
      animationInTiming={500}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: actuatedNormalize(15),
            }}>
            
            <Text style={styles.modalText}>
              Hey, wait up!
            </Text>
          </View>
          <Text style={styles.description}>
              You can not use voice call service until you allow access to {permissionType}
            </Text>
            <Text style={styles.description}>
              You can Allow it manually
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonDeny]}
              onPress={close}>
              <Text style={styles.textStyle}>Go to Settings</Text>
              <Feather
              name={"settings"}
              color={colors.white}
              size={actuatedNormalize(20)}
            />
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOverlayColor,
  },
  modalView: {
    margin: actuatedNormalize(20),
    backgroundColor: colors.dark,
    borderRadius: actuatedNormalize(10),
    padding: actuatedNormalize(30),
    alignItems: 'center',
    gap:actuatedNormalize(20)
  },
  modalText: {
    textAlign: 'center',
    fontFamily: fonts.NexaBold,
    color: colors.white,
    fontSize:actuatedNormalize(18)
  },
  description: {
    textAlign: 'center',
    fontFamily: fonts.NexaBold,
    color: colors.gray,
    fontSize:actuatedNormalize(13)
  },
  button: {
    flexDirection:'row',
    borderRadius: actuatedNormalize(8),
    paddingVertical: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(20),
    width: actuatedNormalize(250),
    borderWidth: actuatedNormalize(1.3),
    borderColor: colors.lightGray,
    gap:actuatedNormalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAllow: {
    backgroundColor: colors.primary, // This is a green color similar to the one in the image
  },
  buttonDeny: {
    backgroundColor: colors.transparent, // This is a red color for the denial button
  },
  textStyle: {
    color: colors.white,
    fontSize: actuatedNormalize(16),
    fontFamily: fonts.NexaBold,
    textAlign: 'center',
  },
});

export default PermissionDenied;
