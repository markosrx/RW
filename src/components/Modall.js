import React, { Component } from 'react';
import { Modal, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
//import Modal from 'react-native-modal';

class Modall extends Component {

    // this.props.source

    state = { modalVisible: false, dark: false }

    closeModal() {
        this.setState({ modalVisible: false, dark: false });
    }

    openModal() {
        this.setState({ dark: true, modalVisible: true })
        //.then(() => this.setState({}));
    }

    temp3()  {
        if(this.props.modalPress) {
            this.props.modalPress();
        }
    }


    modalOrNative = () => {
        if (!this.state.modalVisible) {
            return (
                <View style={styles.aa}>
                    <TouchableWithoutFeedback onPress={() => this.openModal()}>
                        {this.props.children}
                    </TouchableWithoutFeedback>
                </View>
            );
        } 
        else if (this.props.pic && this.state.modalVisible) {
            return (
                <Modal
                    onRequestClose={() => this.closeModal()}
                    visible={this.state.modalVisible}
                    animationType={'fade'}

                >
                    <View style={styles.aa}>
                        <TouchableWithoutFeedback onPress={() => this.closeModal()}  >
                            <Image resizeMethod='resize' style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={{ uri: this.props.pic }} />
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>

            );
        } else {
            return (
                <Modal
                    onRequestClose={() => this.closeModal()}
                    visible={this.state.modalVisible}
                    animationType={'fade'}
                >
                    <View style={styles.aa}>
                        <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            {this.props.children}
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            );
        }
    }

    render() {
        return (
            <View style={styles.ss}>
                {this.modalOrNative()}
            </View>
        );
    }

}

const styles = {
    ss: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    aa: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'grey',

    },
    dark: {
        backgroundColor: 'black',
        width: '100%',
        height: '100%',

    }
}

// <Image resizeMethod='resize' source={{ uri: this.props.source }} />

export default Modall;