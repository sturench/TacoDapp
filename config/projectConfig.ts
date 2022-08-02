const projectConfig = {
  allowlistMintActive: false,
  publicMintActive: false,
  revealHeaderFooter: false,

  allowMultiple: false, // implement if needed

  nftName: 'Mocko Taco',

  nftSymbol: 'TACO',

  maxSupply: 4005,

  maxMintAmountPerTxn: 1,
  publicMintPrice: 0,

  //  mintCost: process.env.NODE_ENV === 'production' ? 100 : 0.01,

  networkName:
    process.env.NODE_ENV === 'production'
      ? 'Ethereum Mainnet' // 'Ethereum Mainnet'
      : 'Rinkeby Testnet', // 'Rinkeby Testnet'

  chainName: 'ETH', // 'ETH'

  chainId: process.env.NODE_ENV === 'production' ? 1 : 4, // Ethereum (1), Rinkeby (4)
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'rinkeby',

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

  contractAddress:
    process.env.NODE_ENV === 'production'
      ? 'your_mainnet_contract_address'
      : '0x8F3232571adB80FBDe113274F3E9B6Bf73551361',

  scanUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://etherscan.io/address/your_ethereum_contract_address'
      : 'https://rinkeby.etherscan.io/address/0x8F3232571adB80FBDe113274F3E9B6Bf73551361',
};

export default projectConfig;
