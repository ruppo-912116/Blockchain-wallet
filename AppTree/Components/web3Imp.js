import React, { Component } from 'react';
import {View, Text} from 'react-native';
import bip39 from 'react-native-bip39';
//import {Transaction} from "ethereumjs-tx";
import {openDatabase} from 'react-native-sqlite-storage'
let db= openDatabase({name:"database.db"})
import {c,d} from "./TrustedAddress";
import BackgroundJob from "react-native-background-job";
db.transaction(function(txn) {
    txn.executeSql('CREATE TABLE IF NOT EXISTS Wallet(user_id INTEGER PRIMARY KEY AUTOINCREMENT,mnemonic VARCHAR(60),myaddress VARCHAR(512),  addr1 VARCHAR(512),balance VARCHAR(60), sent_received VARCHAR(16),counter INTEGER)', []);
    txn.executeSql('CREATE TABLE IF NOT EXISTS Walletaddress(user_id INTEGER PRIMARY KEY AUTOINCREMENT,address VARCHAR(60))', []);

})
const regularJobKey = "regularJobKey";


//console.log('kkkk',mnemonic)
let mnemonicToused = ''
db.transaction(function(txn) {
    txn.executeSql(
        "SELECT mnemonic FROM Wallet",
        [],
        function (tx, res) {
            let row = res.rows.item(0);
            console.log(row)
            if(row) {
                let hash = row.mnemonic;
                console.log(hash)
                if (!hash) {
                    console.log("a annn", hash);

                }
                console.log('res', hash)
                if (!error) {
                    console.log('res', hash)
                }
            }
            else{
                bip39.generateMnemonic(256).then(value => {
                    console.log('vvv', value)
                    db.transaction(function(txn) {
                        txn.executeSql('INSERT INTO Wallet(mnemonic) VALUES (?)', [value], function (err, res) {
                            console.log(res)

                        })})
                })
            }
        }
    )});
//const bip39 = require("bip39");

//console.log('mm',mnemonic)
/*db.transaction(function (tx) {
    tx.executeSql(
        'INSERT INTO memonic(hash) VALUES(?) ',
        [mnemonic],
        (tx,results) =>{
            console.log('Results', results);

        })})*/


//console.log('mnemonic',mnemonic);

let pu = '';

function counterState (p){
    pu = p;
    console.log(pu);
}

//console.log('web3 po ho ta yar chalcha ki k',pu);


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


            }
            if(!err){
                console.log('rrrrrr',res)
            }

        }})})



const hdkey = require("ethereumjs-wallet/hdkey");
let memonic = "type your mnemonic here"
const seed = bip39.mnemonicToSeed(memonic);
const rootKey = hdkey.fromMasterSeed(seed);
const hardenedKey = rootKey.derivePath("m/44'/60'/0'/0");
const Web3 = require('web3');
//let testnet = '';
let testnet = 'testnet url'

const childKey = hardenedKey.deriveChild(pu);
const wallet = childKey.getWallet();
const address = wallet.getAddress();
const privateKey = wallet.getPrivateKey();
console.log(`address is ${address.toString("hex")}`);
console.log(`privateKey is ${privateKey.toString("hex")}`);
let privatekey =  privateKey.toString('hex');
console.log(privateKey)
let addr = address.toString('hex');

const Address = '0x'+ addr;
const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
//web3.setProvider(new web3.providers.HttpProvider(testnet));





let bk = 0;

BackgroundJob.register({
    jobKey: regularJobKey,
    job: () => {
        web3.eth.getBlockNumber( function (err, res) {
            if ((bk+1)<res) {
                if(bk!=0){
                    for(let i=bk; i<res;i++){
                        console.log('res',res)
                        web3.eth.getBlock(i, true, function (error, result) {

                            if(result!=null && bk>10){
                                console.log(i)
                                console.log('blk', result)
                                result.transactions.forEach(function (e) {
                                    if (c === e.from) {
                                        if (e.from != e.to) {
                                            console.log('sent', e.from, e.to, e.value.toString(10))
                                            const addressfrom = e.from;
                                            const addressto = e.to;
                                            const  balance = e.value.toString();
                                            const  sent_received = "1";
                                            console.log(balance)
                                            db.transaction(function (tx) {
                                                tx.executeSql(
                                                    'INSERT INTO Wallet(myaddress,addr1,balance,sent_received) VALUES(?,?,?,?) ',
                                                    [addressfrom,addressto,balance,sent_received],
                                                    (tx, results) => {
                                                        console.log('Results', results);

                                                    }
                                                )


                                            })
                                        }


                                    }
                                    if (c == e.to) {
                                        if (e.from != e.to) {
                                            console.log('receved', e.from, e.to, e.value.toString(10));
                                            const addressfrom = e.from;
                                            const addressto = e.to;
                                            let balance = e.value.toString();
                                            let sent_received = "0";
                                            console.log(balance)
                                            db.transaction(function (tx) {
                                                tx.executeSql(
                                                    'INSERT INTO Wallet(myaddress,addr1,balance,sent_received) VALUES(?,?,?,?) ',
                                                    [addressto, addressfrom, balance, sent_received],
                                                    (tx, results) => {
                                                        console.log('Results', results);

                                                    }
                                                )


                                            });
                                        }

                                        console.log('receved', e.from, e.to, e.value.toString(10));

                                    }

                                })
                            };
                        })
                    }
                    bk = res;
                    // console.log('bblk', block)


                }

                if(bk ===0){
                    bk = res;
                }
            }

        });
        console.log('Background Service Call!');

    }
});

BackgroundJob.schedule({
    jobKey: regularJobKey,
    period: 2000,
    allowExecutionInForeground: true
}).then(console.log('success'));





export {web3,Address};
