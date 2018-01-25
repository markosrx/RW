import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';


class Languages extends Component {


    onclickLanguageText = (lang) => {
        let startPage;
        startPage = global.globalJson.startPages.find(l => {
            return l.languageId == lang.languageId
        })
        startPage = startPage ? startPage : lang;
        Actions.reset('home', {startPage: startPage.pageId});
    }

    openLanguage = () => {
        return global.projectJson.languages.map((object, index) =>
            <View key={index}>
                <TouchableOpacity style={{ margin: 10, height: 37, width:150, backgroundColor: '#dddddd', alignItems: 'center'}} onPress={() => this.onclickLanguageText(object)}>
                    <Text style={{ fontSize: 25, color: '#595959' }} >{object.language}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        return (
            <View style={styles.langCont} >
                {this.openLanguage()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    langCont: {
        position: 'absolute',
        backgroundColor: '#fff',
        top: '7%',
        height: 75,
        width: '100%',
        zIndex: 3,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderColor: '#dddddd',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default Languages;