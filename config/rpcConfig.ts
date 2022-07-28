// For Ethereum, use the Infura endpoints
export default function rpcConfig(infuraKey?: string) {
    return `https://kovan.infura.io/v3/${infuraKey}`;
  // return process.env.NODE_ENV === 'production'
  //   ? 'https://polygon-rpc.com' // `https://mainnet.infura.io/v3/${infuraKey}`
  //   : 'https://kovan.infura.io/v3/f2b5f2637cf74af198e053f4fdf1653a'; // `https://rinkeby.infura.io/v3/${infuraKey}`
}
