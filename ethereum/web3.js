import Web3 from 'web3';

/*================================
    1.  USING MODULES 
================================*/
//const HDWalletProvider = require("@truffle/hdwallet-provider");

/*======================================================
    2.  CREATE PROVIDER AND WEB3 INSTANCE 
======================================================*/
/*
    1.  METAMASK MNEMONIC
*/
//const mnemonic = "impose toe above cause buddy yard dice pool earn tonight hurt enjoy";
/*
    2.  DEFINE PROVIDER
*/
//const ropsten_network = 'https://ropsten.infura.io/v3/98dc29f38ae14930ab1e726fbd992104';
//const provider = new HDWalletProvider( mnemonic, ropsten_network );
const web3 = new Web3('http://127.0.0.1:8545');

export default web3;