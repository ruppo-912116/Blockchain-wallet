import React, { Component } from 'react';
import { StyleSheet, View,Text,ScrollView, RefreshControl, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
import bip39 from 'react-native-bip39';
import {web3,Address} from "./web3Imp";
import {c} from "./TrustedAddress";

//import BackgroundJob from "react-native-background-job";


import {Button} from "./TrustedAddress";

import {openDatabase} from 'react-native-sqlite-storage';
let db= openDatabase({name:"database.db"});
let seedReceived;

const testnet = 'https://rinkeby.infura.io/';
const walletAddress = Address;
let addr = '';

const{width: WIDTH} = Dimensions.get('window');
const{height: HEIGHT} = Dimensions.get('window');



export default class Balance extends Component {

    constructor(){
        super();

        this.state ={
            balChange : true,
            bali :"",
            isDisplayed: true,
            logo:"ethereum",
            name:"Ethereum",
            amt: 0,
            value: 0,
            counter: -1,
            seed : null
        }

    };


    static navigationOptions ={
        tabBarIcon:()=>{
            return <Icon name={'account-balance-wallet'} size={23} color={'white'}/>
        }
    };

    //fetching mnemonics from the database
    componentWillMount() {
       /* const self = this;
        db.transaction(function(tx){
            tx.executeSql('SELECT mnemonic FROM Wallet',[],function (err,res){
                console.log('hello')
                let row = res.rows.item(0);
                console.log(row)
                if(row){
                    let hash = row.mnemonic;
                    console.log(hash)
                    if (hash != null) {
                        console.log("nnnmmmm", hash);
                        self.setState({seed:hash});
                    }
                    if(!err){
                        console.log('rrrrrr',res)
                    }

                }})});*/
        seedReceived= this.props.navigation.getParam('foo','nodata');
        console.log("component will mount ko seed hai",seedReceived);
        this.setState({seed: seedReceived});
        db.transaction(function(tx){
            tx.executeSql('SELECT counter FROM Wallet',[],function (err,res){
                let row = res.rows.item(0);
                console.log(row)
                if(row){
                let hash = row.counter;
                console.log(hash)
                if (hash != null) {
                    console.log("a annn", hash);
                    this.setState({counter:hash})
                }


            }})})
    };

    //getting balance from the web3 while pulling
    _onRefresh = () => {
        this.setState({refreshing: true});
        if (c!== '') {
            const self = this;
            web3.eth.getBalance(c, function (error, result) {
                const bala = web3.fromWei(result, 'ether').toString(10);
                self.setState({
                    bali: bala,
                    refreshing: false
                })
            });
        }
        this.setState({refreshing: false});
    };


    //on clicking the floating button confirmation whether to add an address
    clickingButtonAction = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure to add an address?',
            [
                {text: 'cancel',
                    onPress: () => console.log('cancel pressed'),
                    style: 'cancel',
                },
                {text: 'Ok',
                    onPress: () =>{
                        {this.onAddingAddress()}
                    }},
            ],
            {cancelable: false},
        );
    };

    //adding address to the wallet
    onAddingAddress() {
        const hdkey = require("ethereumjs-wallet/hdkey");
        const seed = bip39.mnemonicToSeed(this.state.seed);
        console.log(seed)
        const rootKey = hdkey.fromMasterSeed(seed);
        const hardenedKey = rootKey.derivePath("m/44'/60'/0'/0");


        this.setState({counter: this.state.counter + 1}, () => {
            let count = this.state.counter;
            let childKey = hardenedKey.deriveChild(count);
            let wallet = childKey.getWallet();
            let addressvar = wallet.getAddress();
            addr = addressvar.toString('hex');
            addr = '0x'+ addr;
            console.log("Address variable wala",addr);
            let privateKey = wallet.getPrivateKey();
            console.log('private',privateKey);
            //navigatiing and passing parameters to trusted address component
            this.props.navigation.navigate('TrustedAddress',{AddressTemp: addr, counterTemp: this.state.counter});
            //this.state.addressarray.push({id: addr});
            db.transaction(function(txn) {
                txn.executeSql('INSERT INTO Walletaddress(address) VALUES (?)',[addr],function (err,res){
                    if(!error){
                        console.log(res)
                    }

                })
                txn.executeSql('UPDATE Wallet SET counter = (?)',[count],function (err,res){
                    if(!error){
                        console.log(res)
                    }

                })
            })


           })

    }



    //card view for displaying the current address and balance
    renderingCard = () => {
        if (c!== ''){
            return(
                <View style={styles.listItem}>
                    <Icons style={{flex: 0.1}} name={this.state.logo} size={30} color={'green'}/>
                    <Text style={{fontSize: 17, flex: 0.7}}> {c} </Text>
                    <View style={{flex: 0.3}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold', paddingLeft: 8}}>ETH {this.state.bali}</Text>
                    </View>
                </View>
            );
        }
    };


    render(){
        return(
            <View style={{flex:1}}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}/>
                    }>
                    <View style={{padding:30,justifyContent:'center',alignSelf: "center"}}>
                        <Text style={{fontWeight: 'bold',fontSize:25}}>Current Address</Text>
                    </View>
                    {this.renderingCard()}
                </ScrollView>

                <TouchableOpacity
                    style={styles.touchableopacitystyle}
                    onPress={this.clickingButtonAction}>
                    <Icon name={'add'} size={25} color={'white'}/>
                </TouchableOpacity>
            </View>

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
    },
    touchableopacitystyle:{
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: '#0E2163',
        borderRadius: 50
    }
});
