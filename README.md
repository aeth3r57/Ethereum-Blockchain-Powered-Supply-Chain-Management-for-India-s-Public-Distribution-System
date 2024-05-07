## Ethereum Blockchain Powered Supply Chain Management for India's Public Distribution System
# The project aims to revolutionize the Indian Public Distribution System (PDS) by creating a supply chain management system to tackle prevalent issues like leakages, inefficiencies, and corruption.

Download the versions of dependencies/libraries available in package.json
Node version 14.21.3
Truffle version 5.1.66

If you haven't already, you need to install Truffle globally. You can do this using npm (Node Package Manager) by running:
npm install -g truffle

Initialize a Truffle project: Navigate to your project directory in the terminal and run:
truffle init

Update truffle-config.js: Modify the truffle-config.js file in your project directory to specify your network configurations (e.g., development, testnet, mainnet).

Compile your contracts: Run the following command to compile your Solidity contracts:
truffle compile

Migrate your contracts: Run the migration script to deploy your contracts to the specified network. If you're deploying to the development network, you can simply run:
truffle migrate

Interact with your contracts: After deploying, you can interact with your contracts using Truffle's console or by writing scripts that utilize the web3.js library.

