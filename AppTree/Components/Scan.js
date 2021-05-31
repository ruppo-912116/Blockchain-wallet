import React,  { Component } from 'react';
import { Text, Dimensions, StyleSheet, View,Button, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigationFocus } from "react-navigation";
import TransferSend from "./TransferSend";


const { width: WIDTH } = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

class Scan extends Component {

    constructor(){
        super();
        this.state = {
            Message: '',
        }
    }

    static navigationOptions ={
        tabBarIcon:()=>{
            return <Icon name={'qrcode'} size={23} color={'white'}/>
        }
    };

    HandlingCallback=(b) =>{
        this.setState({Message :b});
    }



    renderCamera() {
        const isFocused = this.props.navigation.isFocused();

        if (!isFocused) {
            return null;
        } else if (isFocused) {
            return (
                <QRCodeScanner
                    style={{flex: 0.8}}
                    onRead={this.onSuccess}
                    topContent={<Text> Scan your QR code below. </Text>}
                    fadeIn={false}
                    reactivate={true}
                    reactivateTimeout={5000}
                    captureAudio={false}
                    cameraStyle={styles.CameraStyle}/>
            )
        }
    }

    onSuccess = (e) =>{
        this.setState({Message: e.data});
        Alert.alert(
            'Address: '+e.data,
            'Confirm address?',
            [
                {text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: ()=> {
                        {
                            this.props.navigation.navigate('Send', {Address1: this.state.Message});
                        }}},
            ],
            {cancelable: false},
        );
    };
    render(){
        return(
            <View style={{flex:1}}>
                {this.renderCamera()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    CameraStyle: {
        width: WIDTH * 0.7,
        height: HEIGHT * 0.5,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});

export default withNavigationFocus(Scan);