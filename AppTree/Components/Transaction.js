import React,  { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity,Image,FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, { MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";
import {openDatabase} from "react-native-sqlite-storage";
import {c} from "./TrustedAddress";

let db= openDatabase({name:"database.db"});

let textRef = React.createRef();
let menuRef = null;

const setMenuRef=(ref)=>{
    menuRef=ref;
};
const hideMenu = () => menuRef.hide();
const showMenu = () => menuRef.show(textRef.current, Position.BOTTOM_CENTER);



class ListItem extends React.Component{


    render(){
        let toOrFrom;
        let url ;
        console.log("item found");
        const sentOrReceived = this.props.trans.sentOrReceived;
        if(sentOrReceived === "sent"){
            toOrFrom = "to: :";
            url =require('./assets/sent.png');
        }else{
            toOrFrom ="from: ";
            url = require('./assets/received.png');
        }

        return(
            <View style={{flexDirection:'row',borderBottomColor:'gray',borderBottomWidth:0.5, padding: 10}}>
                <View style={{width:"13%",paddingStart:5}}>
                    <Image
                        style={{width:30,height:30,justifyContent:'center',alignItems:'center'}}
                        source={url}/>
                </View>

                <View style={{
                    width:"87%",
                    flexDirection:'column',
                    justifyContent:'center',
                }} >
                    <View style={{flexDirection:"row",flex:1,paddingEnd:20}}>
                        <Text style={{color: 'black',fontSize:14}}>{toOrFrom}</Text>
                        <Text style={{color: 'black',fontSize:14}}>
                            {this.props.trans.otherAddress}
                        </Text>
                    </View>
                    <View style={{flexDirection:"row",flex:1}}>
                        <Text style={{color: 'black',fontSize:14}}>Balance: </Text>
                        <Text style={{color: 'black',fontSize:14}}>
                            {this.props.trans.balance} wei
                        </Text>
                    </View>

                </View>

            </View>
        )
    }
}
export default class Transaction extends Component {


    //global array to store hash available
    //and hence to use it to show in card view
    state ={
        isDisplayed:null,
        sentTransactions:[],
        history:[],
        historyData: [],
        from :[],
        to :[]

    };
   /* async componentWillMount(){
        const self = this;
        let hashes = [];
        //for data persistence
        console.log("getData",c);
         db.transaction(function(tx){
            tx.executeSql("SELECT * FROM Wallet WHERE myaddress = (?) ",
                [c],
                function (tx,res) {

                    let len= res.rows.length;
                    console.log("length11",len,c);
                    //console.log()
                    let transactions=[];
                    for(let i =0; i<= len;i++){
                        let row = res.rows.item(i);
                        let address = row.addr1;
                        let balance = row.balance;
                        let sr= row.sent_received;
                        let myAddress = row.myaddress;
                        let sentOrReceived ;
                        console.log("hawa",row)
                        console.log(myAddress)
                        if(sr == "0"){
                            //this is received
                            sentOrReceived = "received"
                        }else if (sr=="1"){
                            sentOrReceived="sent"
                        }
                        let jsonObject = {
                            myAddress :myAddress,
                            otherAddress:address,
                            balance:balance,
                            sentOrReceived:sentOrReceived
                        };
                        transactions.push(jsonObject);
                        console.log("whole database",transactions);

                    }
                    console.log("before update")
                    self.setState({
                        history:transactions
                    });

                }

            )
        });
    }*/

    dataFromDatabase =()=>{
        this.setState({
            refreshing:true
        });
        const self = this;
        let hashes = [];
        //for data persistence
        console.log("getData",c);
        db.transaction(function(tx){
            tx.executeSql("SELECT * FROM Wallet ",
                [],
                function (tx,res) {

                    let len= res.rows.length;
                    console.log("length",len,c);
                    //console.log()
                    let transactions=[];
                    for(let i =0; i<= len;i++){
                        let row = res.rows.item(i);
                        if(row){
                            let address = row.addr1;
                            let balance = row.balance;
                            let sr= row.sent_received;
                            let myAddress = row.myaddress;
                            let id = row.user_id;
                            let sentOrReceived ;
                            console.log("hawa",row)
                            console.log(myAddress)
                            if(sr == "0"){
                                //this is received
                                sentOrReceived = "received"
                            }else if (sr=="1"){
                                sentOrReceived="sent"
                            }
                            let jsonObject = {
                                id:id,
                                myAddress :myAddress,
                                otherAddress:address,
                                balance:balance,
                                sentOrReceived:sentOrReceived
                            };
                            console.log('jsonObject.myAddress',jsonObject.myAddress)
                            if(jsonObject.myAddress === c) {
                                transactions.push(jsonObject);


                            }
                            console.log("whole database", transactions);

                        }
                    }
                    console.log("before update");
                    if(transactions!==null){
                        self.setState({
                            history:transactions
                        })};
                    console.log("yoyo",self.state.history);

                }

            )
        });
        this.setState({
            refreshing:false
        });
    };
    componentWillMount(): void {
        this.dataFromDatabase();
    }

    async componentDidMount() {
        const { addListener } = this.props.navigation;
        const { isDisplayed } = this.state;
        const self = this;
        this.listeners = [
            addListener('didFocus', () => {
                if (self.state.isDisplayed !== true) {
                    self.setState({ isDisplayed: true });
                    console.log("Transactions")

                }
            }),
            addListener('willBlur', () => {
                if (self.state.isDisplayed !== false) {
                    self.setState({ isDisplayed: false })
                }
            }),
        ];

    };

    static navigationOptions ={
        tabBarIcon:()=>{
            return <Icon name={'ios-paper'} size={23} color={'white'}/>
        }
    };
    componentWillUnmount() {
        this.listeners.forEach(
            sub => { sub.remove() },
        );
        console.log("will mount");

    }

    // shouldComponentUpdate(
    //     nextProps,
    //     nextState,
    // ) {
    //     const { isDisplayed } = this.state;
    //     const { dataForRender } = this.props;
    //     return (
    //         (!isDisplayed && nextState.isDisplayed) ||
    //         (isDisplayed && dataForRender !== nextProps.dataForRender)
    //     )
    // }

    render(){
        const self = this;

        console.log("ccc",this.state.history);

        /*let transaction = web3.eth.getTransaction('0x3d8a7a3fc1766d52f10c2d9151a4ccc8a0c16762bf5e6d3941269f1dcc774d9c',function(error,result){
            if(!error){
                console.log("result",result)
                self.setState({history : {myAddress : result.from}})
                self.setState({history : {othersAddress : result.to}})
            }
        });*/
        //web3.eth.blockNumber(function (err,result) {
        //  console.log(result)

        // })
        /* web3.eth.getBlockNumber(function(err,res){
             console.log(res)
             let block = web3.eth.getBlock(4748889, true,function(error,result){
                 console.log('blk',result.transactions)
                 result.transactions.forEach(function(e){
                     if (Address == e.from) {
                         if (e.from != e.to){
                             console.log('sent',e.from, e.to, e.value.toString(10))
                         }


                     }
                     if (Address == e.to) {
                         if (e.from != e.to)
                         console.log('receved',e.from, e.to, e.value.toString(10));
                     }
                 });
             })
             console.log('bblk',block)
                 })

 */

        return(
                <View style={{flex:1}}>

                    <FlatList
                        onRefresh={()=>{
                            this.dataFromDatabase();
                        }
                        }
                        refreshing = { this.state.refreshing}
                        data={this.state.history}

                        showsVerticalScrollIndicator={true}
                        renderItem={({item})=>
                            <ListItem
                                trans = {item}
                            />
                        }
                        keyExtractor ={item => item.user_id}
                    />

                </View>
        );
}


    // fetchFromHash=async()=>{
    //     let transFromHashes=[];
    //     console.log("haha");
    //     let hwa  = this.state.history;
    //     console.log(hwa);
    //     hwa.push("yoyo");
    //     //getting length
    //     let count =0;
    //     // while(hwa[count] !== "0" ){
    //     //     count ++;
    //     //     console.log(count);
    //     // }
    //
    //     console.log(count);
    //     // for(let i =0;i<len;i++ ){
    //     //     let transaction;
    //     //     transaction=web3.eth.getTransaction(hashes[i]);
    //     //     console.log(transaction);
    //     //     // transFromHashes.push(transaction);
    //     // }
    //     this.setState({
    //         historyData: transFromHashes
    //     });
    //     console.log("kam done");
    //
    // };

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
        fontSize: 18,
    }
});
