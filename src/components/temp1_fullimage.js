import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import LightBox from 'react-native-lightbox';
import Modall from './Modall';

export default class FullImage extends Component {

  checkPic = () => {
    if (this.props.files[0] === 'file:///data/user/0/com.railways/files/1042.jpg') {
      return true
    } else {
      return false
    }
  }
  render() {
    return (
      <View style={styles.mainView}>

        <View style={styles.body}>

          <View style={styles.contentContainer}>
            <View style={styles.contentPic}>
              <Modall>
                <Image resizeMethod='scale' style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={{ uri: this.props.files[0] }} />
              </Modall>
            </View>

          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'white',
    position: 'relative',
    height: '100%'
  },
  body: {
    height: '100%',
  },
  contentContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    height: '100%',
    marginBottom: 5,
  },
  contentPic: {
    flex: 3,
    height: '100%',
    backgroundColor: 'white',
  },
});
