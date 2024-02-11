import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import colors from '../../constants/colors'

export const HomeScreen:React.FC = () => {
  return (
    <View style={styles.container}>
        <Text style={{color:colors.white}}>Home Screen</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})