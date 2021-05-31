import React, {Component} from 'react';
import {View, Share, Button, Text, StyleSheet, Dimensions, TouchableOpacity,ScrollView, RefreshControl} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/AntDesign';
import {c} from "./TrustedAddress";

const{width: WIDTH} = Dimensions.get('window');
const{height: HEIGHT} = Dimensions.get('window');

export default class TransferReceive extends Component {

    state ={
        isDisplayed:null,
        MESSAGE: c,
        refreshing: false
    };

    static navigationOptions ={
        tabBarIcon:()=>{
            return <Icon name={'barcode-scan'} size={23} color={'white'}/>
        }
    };


    async onShare(){
        try{
            const result = await Share.share({
                message: c,
            })

            if(result.action === Share.sharedAction){
                if(result.activityType) {
                    //shared with activity type of result.activityType
                } else{
                    //shared
                }
            } else if (result.action === Share.dismissedAction){
                //dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    onRefresh = () => {
        this.setState({refreshing: true});
    };

    onDisplay = () =>{
        if (c === '') {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                    <Text> Please enable an address to show QR code.</Text>
                    <Text> and pull to refresh</Text>
                </View>
            );
        } else if(c !== ''){
             return(
                 <View style={styles.CodeStyle}>
                     <View style={{flex: 0.3,flexDirection: 'row',paddingBottom: 20}}>
                     <Text style={{textDecorationLine: 'underline'}}>Address: {c}</Text>
                     </View>
                     <QRCode
                         value= {c}
                         size= {150}
                     />
                     <View style={{flex:0.3,paddingTop: "10%"}}>
                         <TouchableOpacity onPress={()=>this.onShare()}>
                             <View style={styles.IconStyle}>
                                 <Icon name={'sharealt'}
                                       size={50}
                                       color={'black'}/>
                             </View>
                         </TouchableOpacity>
                     </View>
                 </View>
             );
            }
        };

    render(){
        if(this.state.refreshing === true){
            this.setState({refreshing: false});
        }
        return(
            <View style={styles.Container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}/>
                    }>
                    <View style={{flex:0.3,flexDirection: 'row',justifyContent:"center",alignItems:'center'}}>
                    <Text style={styles.TxtStyle}>Request amount to receive</Text>
                    </View>
                    {this.onDisplay()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    TxtStyle:{
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 16,
    },
    CodeStyle:{
        flex: 0.8,
        paddingTop: 16,
        paddingLeft: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    IconStyle:{
        justifyContent:'center',
        alignItems: 'center',
        alignSelf:'center',
        width: 80,
        height: 80,
        borderRadius: 70,
        backgroundColor: '#DBE2DE'
    },
});
