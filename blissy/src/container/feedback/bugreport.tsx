import React, { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { PrimaryButton } from '../../common/button/PrimaryButton';
import { RouteBackButton } from '../../common/button/BackButton';
import { Text } from 'react-native';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';
import ReportCard from '../../common/cards/reportcard';
import { ScrollView } from 'react-native';
import LiveItUpComponent from '../../common/drawer/liveitup';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../AppNavigation/navigatorType';

interface BugreportProps {
    navigation: DrawerNavigationProp<RootStackParamList>;

}

const BugReportScreen: React.FC<BugreportProps> = ( props ) => {
    const [text, setText] = useState<string>('');


    React.useLayoutEffect(()=>{
        props.navigation.setOptions(({
            headerShown: true,
            headerTitle: '',
            headerTintColor: colors.white,
            headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
            headerTransparent: true,
            headerLeft: ({ }) => (
                <Pressable onPress={props.navigation.goBack} style={{marginRight:10}}>
                    {/* <Ionicons name="arrow-back" size={24} color={colors.white} /> */}
                    <MaterialIcons name="segment" size={actuatedNormalize(30)} color={colors.white} />
                </Pressable >
              ),
            headerStyle: {
              backgroundColor: colors.transparent,
            },
                }))
    },[props.navigation])

    const handlePress = () => {
        console.log('Button Pressed with Text:', text);
        // Add your desired action here
    };
    const [view, setView] = useState<'create' | 'view'>('create');
    const [reportName, setReportName] = useState<string>('');
    const [reports, setReports] = useState<Array<{ name: string; status: 'pending' | 'resolved'; resolvedTime?: string }>>([
        { name: 'Notification are not working properly', status: 'pending' },
        { name: 'Chatwindow crash Report while typing big text', status: 'resolved', resolvedTime: '2024-06-15 14:30' },
    ]);

    const handleCreateReport = () => {
        if (reportName.trim()) {
            setReports([...reports, { name: reportName, status: 'pending' }]);
            setReportName('');
            setView('view');
        }
    };


    return (
        <View style={styles.container}>
            {/* <RouteBackButton onPress={() => navigation.goBack()} /> */}
            {/* <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(5) }}>Bug Report</Text> */}

            <View style={styles.buttonContainer}>
                <Button buttonColor={view === "create" ? colors.primary : "transparent"} labelStyle={{ fontFamily: fonts.NexaRegular }} mode={view === "create" ? "contained" : "outlined"} textColor={colors.white} onPress={() => setView('create')} style={styles.button}>
                    New Report
                </Button>
                <Button buttonColor={view === "view" ? colors.primary : "transparent"} labelStyle={{ fontFamily: fonts.NexaRegular }} mode={view === "view" ? "contained" : "outlined"} textColor={colors.white} onPress={() => setView('view')} style={styles.button}>
                    Previous Reports
                </Button>
            </View>

            {view === 'create' ? (
                <KeyboardAvoidingView style={{flex:1}}>
                    <TextInput
                        style={styles.textarea}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setReportName}
                        value={reportName}
                        placeholder="Write your report here..."
                    />
                    <PrimaryButton styles={{ width: "100%" }} label='Submit' handleFunc={handleCreateReport} />
                    <LiveItUpComponent/>
                </KeyboardAvoidingView>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {reports.length === 0 && <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(20) }}>You have not raised any reports</Text>
                    }
                    {reports.map((report, index) => (
                        <ReportCard
                            key={index}
                            reportName={report.name}
                            status={report.status}
                            resolvedTime={report.resolvedTime}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: actuatedNormalize(20),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: actuatedNormalize(20),
        marginTop: actuatedNormalize(50)
    },
    button: {
        flex: 1,
        marginHorizontal: actuatedNormalize(5),
        borderColor: colors.primary,
        color: colors.white,
        fontFamily: fonts.NexaRegular
    },
    card: {
        padding: actuatedNormalize(10),
    },
    textarea: {
        height: actuatedNormalize(150),
        padding: actuatedNormalize(10),
        marginBottom: actuatedNormalize(20),
        marginTop: actuatedNormalize(20),
        paddingHorizontal: actuatedNormalize(15),
        paddingVertical: actuatedNormalize(15),
        fontFamily: fonts.NexaRegular,
        color: colors.white,
        borderRadius: actuatedNormalize(20), // Updated for rounded corners
        backgroundColor: colors.dark, // Updated for the input background color
        textAlignVertical: 'top', // Ensures the text starts at the top
    },
    createButton: {
        paddingVertical: actuatedNormalize(10),
    },
    scrollView: {
        paddingBottom: actuatedNormalize(20),
    },
});


export default BugReportScreen;
