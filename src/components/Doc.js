import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, WebView, Dimensions, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PDF from 'react-native-pdf';

export default class DocumentView extends Component {


    render() {
        if (Platform.OS === 'ios') {
            return (
                <View style={styles.mainView}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                            <Image style={styles.ico} source={require('./ico/32/back.png')} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ flex: 12 }}>
                        <PDF
                            source={{ uri: this.props.docuri }}
                            fitPolicy={0}>
                        </PDF>
                    </View>
                </View>);

        }
        return (
            <View style={styles.mainView}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                        <Image style={styles.ico} source={require('./ico/32/back.png')} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 12, alignItems: 'center' }}>
                    <PDF
                        source={{ uri: this.props.docuri }}
                        fitPolicy={0}
                        style={styles.pdf} />
                </View>
            </View>);
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    ico: {
        height: 35,
        width: 35,
        margin: 10,
    },
    pdf: {
        flex: 1,
        width: '80%',
        height: '100%'
    }
});
