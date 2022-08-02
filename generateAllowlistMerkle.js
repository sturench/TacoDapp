const {MerkleTree} = require('merkletreejs');
const keccak = require('keccak256');

const {addresses} = require('./config/allowlist.json')

const leafNodes = addresses.map(addr => keccak(addr));
const merkleTree = new MerkleTree(leafNodes, keccak, {sortPairs: true})
const rootHash = merkleTree.getRoot()

console.log('Whitelist Merkle Tree\n', merkleTree.toString());
console.log('Root Hash:\n0x'+ rootHash.toString('hex'))
