import web3 from './web3';
import pds from '../build/contracts/pds.json';

const pdsContractAccountAddress = '0x19CEA5f0677F5a0D96E74eE6d7c0b7430FD08733'; // get from deploy.js
const pdsinstance  =  new web3.eth.Contract( pds.abi,pdsContractAccountAddress);

// console.log( supplyChainFactoryInstance );
export default pdsinstance;