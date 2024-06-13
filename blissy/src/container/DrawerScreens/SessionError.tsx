import React, { useState } from "react";
import { ModalComponent } from "../../common/modals/modalcomponent";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import { actuatedNormalize } from "../../constants/PixelScaling";
import LottieView from "lottie-react-native";
import { Text } from "react-native";
import { PrimaryButton } from "../../common/button/PrimaryButton";
import { fonts } from "../../constants/fonts";

interface SessionError {
    title: string;
    description: string;
    onPressPrimaryButton: () => void
}

export const SessionError: React.FC<SessionError> = ({ title, description, onPressPrimaryButton }) => {
    const [modalVisible, setModalVisible] = useState(false)

    const renderItem = (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <LottieView style={{ width: actuatedNormalize(150), height: actuatedNormalize(150) }} source={require("../../../assets/animation/SessionError.json")} autoPlay loop />
                <View>
                    <Text style={[styles.modalTitle]}>{title}</Text>
                    <Text style={styles.modalDescription}>{description}</Text>
                </View>
                <PrimaryButton textStyles={{ fontSize: actuatedNormalize(20) }} handleFunc={onPressPrimaryButton} label="Let's go" />
            </View>
        </View>
    )

    return (
        <ModalComponent modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            children={renderItem} />
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: colors.white,
        borderRadius: actuatedNormalize(10),
        padding: actuatedNormalize(20),
        width: "100%",
        rowGap: actuatedNormalize(10),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: actuatedNormalize(25),
        marginTop: actuatedNormalize(10),
        fontFamily: fonts.NexaXBold,
        textAlign: 'center',
        color: colors.dark
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.NexaRegular,
        color: colors.gray
    },
});
