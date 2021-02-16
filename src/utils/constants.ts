import { Networks } from './connections';

export type NetworkIndex = {
  [key in Networks]: any
};

export type Address = string;

export type AddressIndex = {
  [key in Address]: any
}

export const NETWORK_URL: NetworkIndex = {
  [Networks.Ropsten]: 'wss://ropsten.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158',
  [Networks.Mainnet]: 'wss://mainnet.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158'
};

export const ROUTER: NetworkIndex = {
  [Networks.Ropsten]: '0x179b6e60692f012f2DAE218075d77fa087E6f30d',
  [Networks.Mainnet]: ''
};

export const FACTORY: NetworkIndex = {
  [Networks.Ropsten]: '0x28B1fBEeDdE786c33E7aE0eE613F60fEc2Fe57db',
  [Networks.Mainnet]: ''
};

export const SIMPLE_UNISWAP_ORACLE: NetworkIndex = {
  [Networks.Ropsten]: '0x3c010c718A40838DD2FA83d8C83B24C304F068Cd',
  [Networks.Mainnet]: ''
};

export const WETH: NetworkIndex = {
  [Networks.Ropsten]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [Networks.Mainnet]: ''
};

export const ROPSTEN_ETH_DAI: Address = '0x1c5DEe94a34D795f9EEeF830B68B80e44868d316';
export const ROPSTEN_ETH_UNI: Address = '0x4E99615101cCBB83A462dC4DE2bc1362EF1365e5';
export const ROPSTEN_ETH_USDC: Address = '0x681A4164703351d6AceBA9D7038b573b444d3353';

export const MAINNET_ETH_DAI: Address = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11';
export const MAINNET_ETH_UNI: Address = '0xd3d2e2692501a5c9ca623199d38826e513033a17';

export const LISTED_PAIRS: NetworkIndex = {
  [Networks.Ropsten]: [
    ROPSTEN_ETH_DAI,
    //ROPSTEN_ETH_UNI,
    //ROPSTEN_ETH_USDC,
  ],
  [Networks.Mainnet]: [
  ]
};