import React from 'react';
import {
    NavigationActions,
    createAppContainer,
    createMaterialTopTabNavigator,
    createStackNavigator,
    StackActions,
} from 'react-navigation';
import Scan from './AppTree/Components/Scan';
import Balance from './AppTree/Components/Balance';
import Transaction from './AppTree/Components/Transaction';
import TransferSend from './AppTree/Components/TransferSend';
import TransferReceive from './AppTree/Components/TransferReceive';
import TrustedAddress from './AppTree/Components/TrustedAddress';
import Seed from './AppTree/Components/Seed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import 'node-libs-react-native/globals';


import './shim';



//import web3 from './AppTree/Components/web3Imp';



import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import BackgroundTask from 'react-native-background-task'

const Web3 = require('web3');


let SQLite = require('react-native-sqlite-storage');
//const testnet = 'https://rinkeby.infura.io/0x3194cd0787a2506B9c8fcF15c2F0Eff96DDd8252';
const walletAddress = '0x3194cd0787a2506B9c8fcF15c2F0Eff96DDd8252';

//const web3 = new Web3(new Web3.providers.HttpProvider(testnet));

//web3.eth.getBlockNumber(function(error, result){
  //  if (!error)
    //    console.log("block number => ",result);

//});

//const Balances =web3.eth.getBalance(walletAddress,function(error,result){
  //  if(!error){
    //    console.log("balance",web3.fromWei(result,'ether').toString(10));

    //}
    //;
//});


BackgroundTask.define(() => {
    console.log('Hello from a background task')
    BackgroundTask.finish()
})
class MyApp extends React.Component {
    componentDidMount() {
        BackgroundTask.schedule()
    }
}
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Balance'})]
    });


const Transfer = createMaterialTopTabNavigator({
    Send: TransferSend,
    Receive: TransferReceive
},{
    initialRoute: TransferSend,
    tabBarOptions:{
        upperCaseLabel: false,
        activeTintColor: 'black',
        inactiveTintColor: '#0e2163',
        style:{
            margin:5,
            backgroundColor: 'light-gray',
        }
    }
});

const TabNavigator = createMaterialBottomTabNavigator({
    TrustedAddress : TrustedAddress,
    Balance : Balance,
    Scan : Scan,
    Transfer : Transfer,
    Transaction : Transaction
}, {
        barStyle: { backgroundColor: '#0e2163'},
    }
    );

Transfer.navigationOptions = ()=>{
    return{
        title:'Transfer',
        tabBarIcon:()=>{
            return <Icon name={'transfer-right'} size={23} color={'white'}/>
        }
    }
};

TabNavigator.navigationOptions= ({navigation})=> {
    return {
        headerTitle: 'Mobile Wallet',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#0e2163',
        }
    }
};

const StackNavigator = createStackNavigator({
    Seed: Seed,
    TabNavigator: TabNavigator,
},
    {
        initialRoute: Seed,
    });



export default createAppContainer(StackNavigator);








