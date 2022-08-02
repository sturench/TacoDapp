const {MerkleTree} = require('merkletreejs');
const keccak = require('keccak256');

const {addresses} = require('./config/allowlist.json')

const leafNodes = addresses.map(addr => keccak(addr));
const merkleTree = new MerkleTree(leafNodes, keccak, {sortPairs: true})
const root = merkleTree.getHexRoot()

console.log('Whitelist Merkle Tree\n', merkleTree.toString());
console.log('Root Hash:\n'+ root)
