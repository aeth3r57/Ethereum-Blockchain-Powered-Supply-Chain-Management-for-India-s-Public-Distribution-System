const pds = artifacts.require("pds");

module.exports = function (deployer) {
  deployer.deploy( pds );
};
