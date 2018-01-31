import React, { Component } from 'react';
import { Modal, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

class Modall extends Component {

    // this.props.source

    state = { modalVisible: false }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    openModal() {
        this.setState({ modalVisible: true });
    }


    modalOrNative = () => {
        if (!this.state.modalVisible) {
            return (
                <View style={{backgroundColor: 'white'}}>
                    <TouchableWithoutFeedback onPress={() => this.openModal()}>
                        {this.props.children}
                    </TouchableWithoutFeedback>
                </View>
            );
        } else {
            return (
                <Modal
                    
                    onRequestClose={() => this.closeModal()}
                    animationType={'fade'}
                    visible={this.state.modalVisible}
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

    }
}

// <Image resizeMethod='resize' source={{ uri: this.props.source }} />

export default Modall;