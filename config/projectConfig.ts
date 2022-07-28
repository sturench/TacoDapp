const projectConfig = {
  nftName: 'Kovan NFT Faucet',

  nftSymbol: 'NCX',

  maxSupply: 20000,

  maxMintAmountPerTxn: 5,

  //  mintCost: process.env.NODE_ENV === 'production' ? 100 : 0.01,

  networkName:'Kovan Testnet',
    // process.env.NODE_ENV === 'production'
    //   ? 'Ethereum Mainnet' // 'Ethereum Mainnet'
    //   : 'Kovan Testnet', // 'Kovan Testnet'

  chainName: 'ETH', // 'ETH'

  chainId: 42, // Ethereum (1), Kovan (42)
  // chainId: process.env.NODE_ENV === 'production' ? 1 : 42, // Ethereum (1), Kovan (42)

  siteDomain: 'www.yourdomain.com',

  siteUrl: 'https://minting-da-pp.vercel.app/',
    // process.env.NODE_ENV === 'production'
    //   ? `https://your_site_domain`
    //   : 'http://localhost:3000',

  twitterUsername: '@ConsiderChaos',

  twitterUrl: 'https://twitter.com/VaultSwap_me',

  discordUrl: 'https://discord.gg/jEJ3r9zDs9',

  openseaCollectionUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://opensea.io/collection/your_opensea_collection_name'
      : 'https://testnets.opensea.io/collection/your_opensea_collection_name',

  contractAddress:'0x55f6463854bf37f8B99B5409CA039137138d27F6',
    // process.env.NODE_ENV === 'production'
    //   ? 'your_mainnet_contract_address'
    //   : '0x55f6463854bf37f8B99B5409CA039137138d27F6',

  scanUrl: 'https://kovan.etherscan.io/address/0x55f6463854bf37f8B99B5409CA039137138d27F6',
    // process.env.NODE_ENV === 'production'
    //   ? 'https://polygonscan.com/address/your_polygon_contract_address'
    //   : 'https://kovan.etherscan.io/address/0x55f6463854bf37f8B99B5409CA039137138d27F6',
  // 'https://etherscan.io/address/your_ethereum_contract_address'
  // 'https://rinkeby.etherscan.io/address/your_rinkeby_contract_address'
};

export default projectConfig;
