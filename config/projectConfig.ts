const projectConfig = {
  allowlistMintActive: true,
  publicMintActive: false,
  revealHeaderFooter: true,

  allowMultiple: false, // implement if needed

  nftName: 'Mocko Taco',

  nftSymbol: 'TACO',

  maxSupply: 4005,

  maxMintAmountPerTxn: 1,
  publicMintPrice: 0,

  //  mintCost: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 100 : 0.01,

  networkName:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? 'Ethereum Mainnet' // 'Ethereum Mainnet'
      : 'Rinkeby Testnet', // 'Rinkeby Testnet'

  chainName: 'ETH', // 'ETH'

  chainId: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 1 : 4, // Ethereum (1), Rinkeby (4)
  network: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'mainnet' : 'rinkeby',

  siteUrl:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? `www.mockotaco.xyz`
      : 'http://localhost:3000',

  twitterUsername: '@MockoTaco',

  twitterUrl: 'https://twitter.com/MockoTaco',

  discordUrl: 'https://discord.gg/jEJ3r9zDs9',

  openseaCollectionUrl:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? 'https://opensea.io/collection/mockotaco'
      : 'https://testnets.opensea.io/collection/mockotaco',

  contractAddress:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? 'your_mainnet_contract_address'
      : '0x85C187BE7fd00a9dCe13c989FE08Ff7038E14C7d',

  scanUrl:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? 'https://etherscan.io/address/your_ethereum_contract_address'
      : 'https://rinkeby.etherscan.io/address/0x85C187BE7fd00a9dCe13c989FE08Ff7038E14C7d',
};

export default projectConfig;
