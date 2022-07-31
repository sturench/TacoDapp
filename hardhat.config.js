require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("hardhat-gas-reporter");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  gasReporter: {
    enabled: process.env.GAS_REPORT,
  }
};
