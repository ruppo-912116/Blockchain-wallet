import React,  { Component } from 'react';
import { StyleSheet,AsyncStorage, Text, View, TextInput, Dimensions, TouchableOpacity, Picker, Alert,ScrollView,Button, NetInfo } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {web3} from "./web3Imp";
import {openDatabase} from 'react-native-sqlite-storage';
import {c,d} from "./TrustedAddress";
import bip39 from 'react-native-bip39';
import {ProgressDialog} from 'react-native-simple-dialogs';


const hdkey = require("ethereumjs-wallet/hdkey");

let providedAddress ='';
let addressTemp = '';

//let SQLite = require('react-native-sqlite-storage');
//let bds = SQLite.openDatabase({name: 'testdB.db',createFromLocation:'~testDB.db'});
let connecting = false;

let TX = require('ethereumjs-tx');

let db= openDatabase({name:"database.db"});


const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

export default class TransferSend extends Component {
    constructor(){
        super();
        NetInfo.isConnected.addEventListener('connectionChange',(isConnected)=>{
            connecting = isConnected;
        });
        this.state ={
            address : null,
            amount : null,
            isDisplayed:null,
            addressTo : '',
            eth : '',
            seed : '',
            progressVisible: false
        };

        // dbs.transaction(tx) => {
        //     tx.executeSql("INSERT INTO ")
        //   }

        /*      db.transaction(function(txn) {
                  txn.executeSql(
                      "SELECT name FROM sqlite_master WHERE type='table' AND name='hashs'",
                      [],
                      function (tx, res) {
                          console.log('item:', res.rows.length);
                          if (res.rows.length == 0) {
                              txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                              txn.executeSql(
                                  'CREATE TABLE IF NOT EXISTS hashs(user_id INTEGER PRIMARY KEY AUTOINCREMENT, hash VARCHAR(60))',
                                  []
                              ).then(console.log("data saved"));
                          }
                      }
                  );
              }
              );
          */}


    static navigationOptions ={
        tabBarIcon:()=>{
            return <Icon name={'barcode-scan'} size={23} color={'white'}/>
        }
    };

    componentWillMount(){
       let seedReceived= this.props.navigation.getParam('foo','nodata');
        console.log("component will mount ko seed hai transfer send ko:",seedReceived);
        this.setState({seed: seedReceived});
       /* const self = this;
        db.transaction(function(tx){
            tx.executeSql('SELECT mnemonic FROM Wallet',[],function (err,res){
                console.log('hello component will mount');
                let row = res.rows.item(0);
                console.log(row)
                if(row){
                    let hash = row.mnemonic;
                    console.log(hash);
                    if (hash != null) {
                        console.log("nnnmmmm", hash);
                        self.setState({seed:hash},()=>{
                            console.log("callback wala seed",self.state.seed);
                        });
                    }
                    if(!err){
                        console.log('rrrrrr',res)
                    }

                }})}); */

        NetInfo.isConnected.fetch().then(isConnected => {
            connecting = isConnected;
            console.log("connection type",isConnected);
        });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange');
    }


    Transfer =()=>{

        Alert.alert(
            'Transfer Ether',
            'Are you sure to transfer?',
            [
                {text:'Cancel',
                    onPress: () => console.log("cancel"),
                    style: 'cancel'},

                {text: 'OK', onPress :this.onclick.bind(this)}


            ]
        )
    }
    onclick=()=> {
        const self = this;
        console.log("connecting:",connecting);
        if (connecting === true) {
            console.log("Transfer send c", c);
            console.log("Transfer send d", d);
            console.log(this.state.address);
            console.log('gggg', this.state.amount);
            if (c && this.state.amount && this.state.address) {
                this.setState({progressVisible: true});
                console.log("Transfer send c", c);
                console.log("Transfer send d", d);
                console.log(this.state.address);
                console.log('gggg', self.state.amount);
                console.log('seed',self.state.seed);
                const hdkey = require("ethereumjs-wallet/hdkey");
                //let memonic = "benefit essay bundle reason vanish amused always asset knee layer holiday elder inhale fall flat flame orient kick gun lumber quantum inform simple divert"
                const seed = bip39.mnemonicToSeed(this.state.seed);
                const rootKey = hdkey.fromMasterSeed(seed);
                const hardenedKey = rootKey.derivePath("m/44'/60'/0'/0");

                let childKey = hardenedKey.deriveChild(d);
                let wallet = childKey.getWallet();
                let addressvar = wallet.getAddress();
                let addr = addressvar.toString('hex');
                addr = '0x' + addr;
                let privateKey = wallet.getPrivateKey();
                //const privateKey = Buffer.from('11524427A4392555C26C79AAE337DAD5B798533514DB59D4A7FE207F57705EE7','hex');

                console.log("aayo ta yaha samma!!!!!!!",seed);
                web3.eth.getTransactionCount(c, function (error, txAccount) {
                    if (!error) {
                        console.log('a ma ');
                        console.log('a ma ',self.state.amount);
                        let val = web3.toHex(web3.toWei(self.state.amount, 'ether'));
                        const txObject = {
                            nonce: web3.toHex(txAccount),
                            from: txAccount,
                            to: self.state.address,
                            value: val,
                            gasLimit: web3.toHex(21000),
                            gasPrice: web3.toHex(web3.toWei('10', 'gwei'))

                        };
                        console.log('a ma ', self.state.amount);
                        const tx = new TX(txObject);
                        tx.sign(privateKey);

                        let raw = '0x' + tx.serialize().toString('hex');
                        console.log("helllll", raw);
                        web3.eth.sendRawTransaction(raw, function (error, result) {
                            if (!error) {
                                console.log(",,,,", result);
                                self.setState({progressVisible: false});
                                Alert.alert(
                                    "Successful",
                                    'Successfully transferred'
                                )
                            } else if(error) {
                                self.setState({progressVisible: false});
                                Alert.alert(
                                    "Warning",
                                    error.toString()
                                )
                            }


                            self.storeData(result);

                        });


                    }
                })

            }else{
                Alert.alert(
                    "Warning",
                    "Invalid input"
                )
            }
        }else if(connecting === false){
            Alert.alert(
                "Error",
                "Please connect to a network"
            )
        }
    };



    storeData=async(result)=>{
        //for data persistence
        //storing hash returned by raw transaction into mobile device
        ////key ko lagi discuss garnu parxa

        console.log("indicator"+result);
        try{

            if(result !=null) {
                db.transaction(function (tx) {
                    tx.executeSql(
                        'INSERT INTO hashs(hash) VALUES(?) ',
                        [result],
                        (tx,results) =>{
                            console.log('Results', results);

                        }
                    )



                })
            }



        }catch (e) {
            console.log(e);
        }
        console.log("banzai");
    };

    Onrendering =() =>{
        addressTemp = this.props.navigation.getParam('Address1','');
        if (addressTemp !== providedAddress){
            console.log("chaliracha ta condition");
            providedAddress = addressTemp;
            this.setState({address:addressTemp});
        }
    };

    render(){
        console.log("seed ko hai ta!!", this.state.seed);
        {this.Onrendering()}
        return(
            <ScrollView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{flex: 0.6, flexDirection: 'column'}}>
                        <Text style={styles.textStyle}> Address </Text>
                        <View style={styles.addressStyle1}>
                            <View style={{flex: 0.9,borderWidth: 1, borderRightWidth: 0}}>
                                <TextInput
                                    style={[styles.boxStyle,{width:"96%",justifyContent:"center",alignItems:"center"}]}
                                    placeholder={"Enter address here"}
                                    placeholderTextColor={'rgba(0,0,0,0.35)'}
                                    value= {this.state.address}
                                    underlineColorAndroid={'transparent'}
                                    editable={false}
                                />
                            </View>


                            <View style={{flex: 0.14, borderWidth: 1 ,borderColor: '#000',justifyContent:'center', alignItems: 'center'}}>
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Scan')}}>
                                    <Icon name={"qrcode"} size={45} color={'black'}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.textStyle}> Amount </Text>

                        <View style={{borderWidth: 1}}>
                            <TextInput
                                style={{width: "96%"}}
                                value = {this.state.amount}
                                onChangeText={(b) =>{
                                    this.setState({amount: b});
                                }}
                                placeholder={'Enter amount here'}
                                placeholderTextColor={'rgba(0,0,0,0.35)'}
                                keyboardType={"numeric"}
                                underlineColorAndroid={ 'transparent'}/>

                        </View>

                    </View>


                    <View style={{flex:0.2, justifyContent: 'center', marginTop:25}}>
                        <Button
                            onPress={this.Transfer.bind(this)}
                            title= "Send"
                            color= "#0e2163" />
                    </View>
                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="Sending ether"
                        message="Please wait..."
                    />

                </View>
            </ScrollView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 8,

    },

    addressStyle:{
        flex: 0.8,
        flexDirection: 'row',
    },

    addressStyle1:{
        flexDirection: 'row',
    },

    boxStyle:{
        width: WIDTH - (WIDTH * 0.2),
        fontSize: 16,
    },

    textStyle:{
        flex:0.15,
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 12
    },

    boxStyle2:{
        fontSize: 16,
    },

    cardStyle:{
        flex:0.2
    },

    itemStyle1:{
        borderWidth: 1,
        height: 60,
        width: WIDTH - (WIDTH * 0.08),
        flexDirection: "row",
    },

    itemStyle2:{
        flexDirection: "column"
    },

    itemStyle3:{
        flexDirection: "row",
    },

});
