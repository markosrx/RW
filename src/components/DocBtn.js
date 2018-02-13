import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class DB extends Component {
    render() {

        return (

            <View>

                <TouchableOpacity style={styles.ButtonContent} onPress={() => Actions.DocumentView({ docuri: this.props.documenturi })}>
                    <Image
                        style={styles.ButtonIconStyle}
                        source={require('./ico/file.png')}
                    />
                    <Text style={styles.ButtonTextStyle}>DOCUMENT</Text>
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
    ButtonIconStyle: {
        marginRight: 10,
        width: Dimensions.get('window').width*0.02,
        height: Dimensions.get('window').height*0.03
    },
    ButtonContent: {
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: 4,
                                 paddingHorizontal: 25,
        backgroundColor: '#0082B3',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
                                 height:Dimensions.get('window').height*0.1
    },
});
