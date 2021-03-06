import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Modall from './Modall';

export default class FullImage extends Component {

  render() {
    return (
      <View style={styles.mainView}>

        <View style={styles.body}>

          <View style={styles.contentContainer}>
            <View style={styles.contentPic}>
              <Modall>
                <Image resizeMethod='scale' style={{ width: '100%', height: '100%', resizeMode: 'stretch' }} source={{ uri: this.props.files[0] }} />
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
