import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import Entypo from 'react-native-vector-icons/Entypo';
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
      animationInTiming={1000}
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
            <Entypo
              name={"circle-with-cross"}
              color={colors.white}
              size={actuatedNormalize(30)}
            />
            <Text style={styles.modalText}>
              Access Denied!!
            </Text>
          </View>
          <Text style={styles.description}>
              You can not use voice call service until you allow access to {permissionType}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonDeny]}
              onPress={close}>
              <Text style={styles.textStyle}>Don't allow</Text>
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
    borderRadius: actuatedNormalize(8),
    padding: actuatedNormalize(35),
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontFamily: fonts.NexaBold,
    color: colors.white,
    fontSize:actuatedNormalize(16)
  },
  description: {
    textAlign: 'center',
    fontFamily: fonts.NexaBold,
    color: colors.gray,
    fontSize:actuatedNormalize(12)
  },
  button: {
    borderRadius: actuatedNormalize(8),
    paddingVertical: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(20),
    width: actuatedNormalize(250),
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
