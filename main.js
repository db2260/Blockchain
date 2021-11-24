const {Blockchain, Transaction} = require(./blockchain);
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('private key goes here');
const myWalletAddr = myKey.getPublic('hex');

let bitcoin = new Blockchain();

const tx1 = new Transaction(myWalletAddr, 'public key goes here', 10);
tx1.signTransaction(myKey);
bitcoin.addTransaction(tx1);

//bitcoin.addBlock(new Block("05/31/2017", {amount : 10}));
//bitcoin.addBlock(new Block("06/25/2018", {amount : 25}));

//bitcoin.createTransaction(new Transaction('address1', 'address2', 100));
//bitcoin.createTransaction(new Transaction('address2', 'address1', 50));

//bitcoin.minePendingTransactions('address1');
//bitcoin.minePendingTransactions('address2');

//console.log('Balance of Address 1: ' + bitcoin.getBalanceOfAddress('address1'));
//console.log('Balance of Address 2: ' + bitcoin.getBalanceOfAddress('address2'));

bitcoin.chain[1].transactions[0].amount = 15;

console.log('Is chain valid?', isChainValid());

bitcoin.minePendingTransactions(myWalletAddr);
console.log('\nWallet Balance is ', bitcoin.getBalanceOfAddress(myWalletAddress));