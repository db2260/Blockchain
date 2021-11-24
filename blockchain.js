var {createHash} = require('crypto');
var crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class Transaction {
  constructor(fromAddr, toAddr, amount) {
    this.fromAddr = fromAddr;
    this.toAddr = toAddr;
    this.amount = amount;
    
    var primeLength = 60;
    var diffHell = crypto.createDiffieHellman(primeLength);
    
    diffHell.generateKeys('base64');
  }
  
  calculateHash() {
    var string = (this.fromAddr + this.toAddr + this.amount).toString();
    return createHash('sha256').update(string).digest('hex');
  }
  
  signTransaction(signingKey) {
    if(signingKey.getPublicKey('hex') !== this.fromAddr) {
      throw new Error('You cannot sign transactions for other wallets.');
    }
    
    const hashTx = this.calculateHash();
     const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }
  
  isValid() {
    if(this.fromAddr === null) return true;
    
    if(!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction.');
    }
    
    const
    //const publicKey = ec.keyFromPublic(this.fromAddr, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}


class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  
  calculateHash() {
      var string = (this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
      return createHash('sha256').update(string).digest('hex');
    
  }
  
  mineBlock(difficulty) {
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    
    console.log('Block mined: ' + this.hash);
  
  }
  
  hasValidTransactions() {
    for(const tx of this.transactions) {
      if(!tx.isValid()) {
        return false;
      }
    }
    
    return true;
  }
}


class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
    
  }
   
  createGenesisBlock() {
    return new Block(0, "01/01/2021", "genesis block", "0");
  }
  
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  
  minePendingTransactions(minerAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    
    console.log('Block successfully mined!');
    
    this.chain.push(block);
    
    this.pendingTransactions = [new Transaction(null, minerAddress, this.miningReward)];
    
  }
  
  addTransaction(transaction) {
    if(!transaction.fromAddr || !transaction.toAddr) {
      throw new Error('Transaction must have from and/or to addresses');
    }
    
    if(!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }
    
    
    this.pendingTransactions.push(transaction);
     
  }
  
  getBalanceOfAddress(address) {
    let balance = 0;
    
    for(const block of this.chain) {
      for(const trans of block.transactions) {
        if(address == trans.fromAddr) {
          balance -= trans.amount;
        }
        
        if(address == trans.toAddr) {
          balance += trans.amount;
        }
      }
    }
    
    return balance;
    
  }
  
  isChainValid() {
    for(let i=1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      if(!currentBlock.hasValidTransactions()) {
        return false;
      }
      
      if(currentBlock.hash != currentBlock.calculateHash()) {
        return false;
      }
      
      if(currentBlock.previousHash != previousBlock.hash) {
        return false;
      }
    }
    
    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;