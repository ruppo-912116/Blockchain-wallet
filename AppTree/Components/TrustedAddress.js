import React,  { Component } from 'react';
import {StyleSheet, Text, View,Button, Alert, TouchableOpacity,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/FontAwesome';
import {web} from './web3Imp';
import {openDatabase} from 'react-native-sqlite-storage';

let db= openDatabase({name:"database.db"});



let address='';
let CounterTemp= 0;
let addressTemp= '';
let privateKeyTemp1 = '';
let i =0;
let flag =0;
let c = '';
let d;
let e ='';
let flag1=0;


export default class TrustedAddress extends Component {
    constructor(){
        super();
        this.state ={
            isDisplayed:null,
            addressarray: [],
            counter: -1,
            isActive: false,
            synced:false,
            isEnabled: false,
        };
    }

    static navigationOptions ={
        tabBarIcon:()=>{
            return <Icon name={'newsletter'} size={23} color={'white'}/>
        }
    };


    getActive =(isActive)=>{
        if(isActive){
            return 'green';
        }else{
            return 'red';
        }
    };

    getSynced =(isSynced)=>{
        if(isSynced){
            return 'Synced';
        }else{
            return 'Not Synced';
        }
    };

    getEnabled=(isEnabled)=>{
        if(isEnabled){
            return 'Disable';
        }else{
            return 'Enable';
        }
    };

    componentWillMount(){
        console.log("yo chaleko cha component did mount??");
        const self = this;
        db.transaction(function (tx) {
            tx.executeSql("SELECT address FROM Walletaddress",
                [],
                function (tx, res) {
                    let len= res.rows.length;
                    console.log(len);
                    console.log("row wala ho hai",res.rows.address);
                    for(i =0; i< len;i++) {
                        let row = res.rows.item(i);
                        let addr = row.address;
                        console.log("mount wala trusted",row)
                        if (addr !== null) {
                            self.state.addressarray.push({
                                id: addr,
                                count1: i,
                                Enable: false,
                                Active: false,
                                Sync: false
                            });
                        }
                        console.log("addressarray hai ta",self.state.addressarray);
                        self.setState({isEnabled : !self.state.isEnabled});
                        console.log("a an", addr);
                    }
                })});
    }

    componentWillUnmount(): void {
        console.log("component will unmount");
        //this.setState({addressarray:[]});
    }


    ongettingaddress = () => {
        console.log("getting address wala",flag1);
        flag1 = 2;
        return this.state.addressarray.map((a) => (
                <View style={styles.listItem}>
                    <Icons style={{flex: 0.1}} name={'check-circle'} size={30} color={this.getActive(a.Active)}/>
                    <View style={{flex: 0.7}}>
                        <Text style={{fontSize: 17}}>{a.id}</Text>
                        <Text style={{fontSize: 15,fontWeight: 'bold'}}>{this.getSynced(a.Sync)}</Text>
                    </View>
                    <View>
                        <Button style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}
                                title={this.getEnabled(a.Enable)}
                                color={this.getActive(!a.Active)}
                                onPress={() => {
                                    Alert.alert(this.getEnabled(a.Enable)+' address',
                                        'Do you want to '+this.getEnabled(a.Enable)+' this address?',
                                        [
                                            {text: 'Cancel',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            {text: 'OK', onPress: ()=> {
                                                    if (flag ===0) {
                                                        a.Enable = !a.Enable;
                                                        a.Active = !a.Active;
                                                        a.Sync = !a.Sync;
                                                        addressTemp = address;
                                                        flag = 1;
                                                        flag1 = 0;
                                                        c = a.id;
                                                        d = a.count1;
                                                        e = a.privateKey;
                                                        console.log("private key wala",e);
                                                        this.setState({isEnabled: !this.state.isEnabled});
                                                    } else if (flag ===1 && a.Enable === false){
                                                        alert('Disable the other address first!');
                                                    } else if (flag ===1 && a.Enable === true){
                                                        a.Enable = !a.Enable;
                                                        a.Active = !a.Active;
                                                        a.Sync = !a.Sync;
                                                        addressTemp = address;
                                                        flag = 0;
                                                        flag1 = 0;
                                                        c = '';
                                                        this.setState({isEnabled: !this.state.isEnabled});
                                                    }
                                                }},
                                        ],
                                        {cancelable: false},);
                                }}/>
                    </View>
                </View>
            )
        );
    }

    render(){
        console.log("twkjfkjfwwfkjbef trusted",flag1);
        address = this.props.navigation.getParam('AddressTemp','a');
        CounterTemp = this.props.navigation.getParam('counterTemp',-1);
        privateKeyTemp1 = this.props.navigation.getParam('privateKeyTemp','a');
        if (address !== 'a' && address!== addressTemp && flag1 === 2) {
            this.state.addressarray.push({id: address, count1: CounterTemp, Enable: false, Active: false, Sync: false, privateKey: privateKeyTemp1});
            console.log('addressarray po parecha', this.state.addressarray);
        }
        return(
            <ScrollView style={{flex:1}}>
                <View style={{flex:1}}>
                    {this.ongettingaddress()}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listItem:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    TextStyle: {
        fontSize: 30,
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export {c,d,e};
