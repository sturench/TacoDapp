const projectConfig = {
  nftName: 'Mocko Taco',

  nftSymbol: 'TACO',

  maxSupply: 4005,

  maxMintAmountPerTxn: 1,

  //  mintCost: process.env.NODE_ENV === 'production' ? 100 : 0.01,

  networkName: 'Rinkeby Testnet',
    // process.env.NODE_ENV === 'production'
    //   ? 'Ethereum Mainnet' // 'Ethereum Mainnet'
    //   : 'Rinkeby Testnet', // 'Kovan Testnet'

  chainName: 'ETH', // 'ETH'

  chainId: 4, // process.env.NODE_ENV === 'production' ? 1 : 4, // Ethereum (1), Kovan (42)

  siteUrl:
    process.env.NODE_ENV === 'production'
      ? `www.mockotaco.xyz`
      : 'http://localhost:3000',

  twitterUsername: '@MockoTaco',

  twitterUrl: 'https://twitter.com/MockoTaco',

  discordUrl: 'https://discord.gg/jEJ3r9zDs9',

  openseaCollectionUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://opensea.io/collection/mockotaco'
      : 'https://testnets.opensea.io/collection/mockotaco',

  contractAddress:'0x8F3232571adB80FBDe113274F3E9B6Bf73551361',
    // process.env.NODE_ENV === 'production'
    //   ? 'your_mainnet_contract_address'
    //   : '0x55f6463854bf37f8B99B5409CA039137138d27F6',

  scanUrl: 'https://rinkeby.etherscan.io/address/0x8F3232571adB80FBDe113274F3E9B6Bf73551361',
    // process.env.NODE_ENV === 'production'
    //   ? 'https://polygonscan.com/address/your_polygon_contract_address'
    //   : 'https://kovan.etherscan.io/address/0x55f6463854bf37f8B99B5409CA039137138d27F6',
  // 'https://etherscan.io/address/your_ethereum_contract_address'
  // 'https://rinkeby.etherscan.io/address/your_rinkeby_contract_address'
};

export default projectConfig;
