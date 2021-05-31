import React,  { Component } from 'react';
import { Text, Dimensions, StyleSheet, View,Button, Alert, TextInput } from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import SplashScreen from 'react-native-splash-screen';
import {
    NavigationActions,
    StackActions,
} from 'react-navigation';

let length = '';
let flag = 0;

export default class Seed extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            dialogVisible: true,
            text: null
        }

    };

    inspectLength = ()=>{
      if (length !== '32' && flag ===1 && length!== '0'){
          return(
              <Text style={{color: 'red',fontStyle: 'italic'}}>seed length is too short!</Text>
          );
      }else if (length === '32' && flag ===1 && length!=='0'){
          return(
              <Text style={{color: 'green',fontStyle: 'italic'}}>Correct seed length!</Text>
          );
      }
    };

    onClicking = ()=>{
        if(length ==='32') {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'TabNavigator', params: {foo: this.state.text}})],
            });

            this.setState({dialogVisible: false}, () => {
                this.props.navigation.dispatch(resetAction);
            });
        } else if (length !=='32'){
            Alert.alert(
                "Warning",
                "Seed length is too short"
            );
        }
    };

    componentWillUnmount(): void {
        this.setState({dialogVisible: false});
    }

    componentDidMount(): void {
        SplashScreen.hide();
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor: '#000'}}>
            <Dialog
                visible={this.state.dialogVisible}
                title={"Getting Started"}>
                <View>
                    <Text> Enter your seed here</Text>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) =>{
                            flag =1;
                            length = text.length.toString();
                            this.setState({text})}}
                        value={this.state.text}
                        maxLength={32}
                    />
                    {this.inspectLength()}
                    <View style={{marginTop:25,justifyContent:'center'}}>
                    <Button
                        onPress={this.onClicking}
                        title={"Confirm Seed"}
                        color={"#01e963"}/>
                    </View>
                </View>
            </Dialog>
            </View>
        );
    }
}