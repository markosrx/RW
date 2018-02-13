import React, { Component } from 'react';
import { StyleSheet, View, Image, StatusBar, TouchableWithoutFeedback, Alert, Text, ActivityIndicator, Platform, NetInfo, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import HTML from 'react-native-render-html';
import RNRestart from 'react-native-restart';
import RNFB from 'react-native-fetch-blob';

export default class Header extends Component {

  state = {
    syncLoading: false
  };

  openLanguage = () => {
    this.props.onPressLang();
  };
  openHome = () => {
    Actions.reset('home', { lang: global.language })
  };
  openFavorites = () => {
    Actions.reset('login')
  };
  openMenu = () => {
    Actions.reset('login')
  };
  openSearch = () => {
    this.props.onPress();
  };
  openFolder = () => {

  };
  openSettings = () => {
    this.props.onPressSettings();
  };
  syncFiles = () => {
    //uradi sync fajlova
    this.syncApp();
  };
  componentDidMount() {
    StatusBar.setHidden(true);
  }

  isNetworkConnected = () => {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        const handleFirstConnectivityChangeIOS = isConnected => {
          NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS);
          resolve(isConnected);
        };
        NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS);
      });
    }
    return NetInfo.isConnected.fetch();
  }

  syncApp() {
    this.setState({ syncLoading: true });
    const projectJsonURL = 'http://www.cduppy.com/salescms/?a=ajax&do=getProject&projectId=3&token=1234567890';
    const pathToCheckedFiles = RNFB.fs.dirs.DocumentDir + '/checkedFiles.json';
    this.isNetworkConnected()
      .then(res => {
        if (res) {
          RNFB.fs.readFile(RNFB.fs.dirs.DocumentDir + '/checkedFiles.json', 'utf8')
            .then((res) => JSON.parse(res))
            .then(fajlic => {
              fetch(projectJsonURL)
                .then(res => res.json())
                .then(res => {
                  let neSkinutiFajlovi = fajlic.failedDownloads.length > 0 ? 'But there seems to be ' + fajlic.failedDownloads.length + ' missing files. If this problem persists, that means files are missing from the server. Contact your admin to fix it.' : 'Seems everything is OK. \nIf you want you can restart application anyway.';
                  if (res.lastChanges == global.projectJson.lastChanges) {
                    Alert.alert('App is already up to date!', neSkinutiFajlovi, [{ text: 'Sync', onPress: () => { RNRestart.Restart(); } }, { text: 'Cancel', onPress: () => { } }])
                  }
                  else {
                    Alert.alert('There seems to be update!', 'Do you wish to sync?', [{ text: 'Sync', onPress: () => { RNRestart.Restart(); } }, { text: 'Cancel', onPress: () => { } }]);
                  }
                })
            })
        } else {
          Alert.alert('Offline', 'You seem to be offline.', [{ text: 'OK', onPress: () => { } }]);
        }
      })
      .then(() => this.setState({ syncLoading: false }))
      .catch((err) => { console.log(err); this.setState({ syncLoading: false }); Alert.alert('Error', 'Something went wrong. Please check your internet connection, restart the app, or try again later.', [{ text: 'OK', onPress: () => { } }]); });

  }

  syncOrSpinner = () => {
    if (this.state.syncLoading) {
      return (
        <View style={styles.ico}>
          <ActivityIndicator size={'small'} />
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this.syncFiles}><Image style={styles.ico} source={require('./ico/32/sync.png')} /></TouchableWithoutFeedback>
    );
  }



  render() {

    return (

      <View style={styles.navbarH}>

        <StatusBar barStyle="dark-content" hidden={true} />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

            <View style={{ flex: 3.5, alignItems: 'center', alignSelf: 'center', width: '100%'}}><HTML html={this.props.title ? this.props.title : ''} baseFontStyle={{fontSize: Dimensions.get('window').height*0.03}}/></View>

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>

            <TouchableWithoutFeedback onPress={this.openLanguage}><Image style={styles.ico} source={require('./ico/32/earth.png')} /></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.openHome}><Image style={styles.ico} source={require('./ico/32/home.png')} /></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.openFavorites}><Image style={styles.ico} source={require('./ico/32/star.png')} /></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.openMenu}><Image style={styles.ico} source={require('./ico/32/menu.png')} /></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.openSearch}><Image style={styles.ico} source={require('./ico/32/search.png')} /></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.openFolder}><Image style={styles.ico} source={require('./ico/32/folder.png')} /></TouchableWithoutFeedback>
            {this.syncOrSpinner()}
            <TouchableWithoutFeedback onPress={this.openSettings}><Image style={styles.ico} source={require('./ico/32/settings.png')} /></TouchableWithoutFeedback>

          </View>
        </View>
      </View>


    )
  }
}

const styles = StyleSheet.create({

  navbarH: {
    height: '7%',
    width: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: "center",
    flexDirection: 'row',
    paddingRight: 10,
    borderBottomWidth: 3,
    borderColor: '#dddddd'
  },
  ico: {
    height: 24,
    width: 24,
    marginLeft: 15,
  },
});
