# Ethereum Blockchain Powered Supply Chain Management for India's Public Distribution System
## The project aims to revolutionize the Indian Public Distribution System (PDS) by creating a supply chain management system to tackle prevalent issues like leakages, inefficiencies, and corruption.

Download the versions of dependencies/libraries available in package.json
    Node version 14.21.3 & Truffle version 5.1.66
Make sure your npm version is compatible with this mentioned node version. 
Install node using: nvm install 14.21.3

If you haven't already, you need to install Truffle globally. You can do this using npm (Node Package Manager) by running:
npm install -g truffle@5.1.66

Initialize a Truffle project: Navigate to your project directory in the terminal and run:
truffle init

Update truffle-config.js: Modify the truffle-config.js file in your project directory to specify your network configurations (e.g., development, testnet, mainnet).

Create a Ganache workspace using the truffle-config.js file.

Compile your contracts: Run the following command to compile your Solidity contracts:
truffle compile

Migrate your contracts: Run the migration script to deploy your contracts to the specified network:
truffle migrate

From the 2_pds migration, you can see the contract address in the terminal. Copy this contract address and paste it in ethereum/pdsinstance.js to pdsContractAccountAddress

In your cmd, type: npm run dev. This will start your dApp and you will be able interact with on your local server.

Connect your Metamask wallet to your Smart Contract: Consider any 3 accounts from Ganache & import those accounts into Metamask by copying their private key.


