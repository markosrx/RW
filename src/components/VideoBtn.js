import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class VB extends Component {

    render() {

        return (
            
            <View style={{ marginRight: 15 }}>

                <TouchableOpacity style={styles.ButtonContent} onPress={() => Actions.VideoView({ videouri: this.props.videouri })}>
                    <Image
                        style={styles.ButtonIconStyle2}
                        source={require('./ico/play-button.png')}
                    />
                    <Text style={styles.ButtonTextStyle}>VIDEO</Text>
                </TouchableOpacity >

            </View>
        );
    }
}

const styles = StyleSheet.create({

    ButtonTextStyle: {
        fontSize: Dimensions.get('window').height*0.03,
        color: '#fff'
    },
    ButtonIconStyle2: {
        marginRight: 10,
        width: Dimensions.get('window').width*0.02,
        height: Dimensions.get('window').height*0.03
    },
    ButtonContent: {
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: 4,
        paddingHorizontal: 25,
        margin: 2,
        backgroundColor: '#0082B3',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
                                 height:Dimensions.get('window').height*0.1
    },
});
