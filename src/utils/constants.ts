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
  [Networks.Ropsten]: '0xbFf4acF789297A8507Eb7493AE18EB2C3A3A9632',
  [Networks.Mainnet]: ''
};

export const FACTORY: NetworkIndex = {
  [Networks.Ropsten]: '0x3fdB4b27e1b4be9b27514C643a8Baef95Cf9b549',
  [Networks.Mainnet]: ''
};

export const SIMPLE_UNISWAP_ORACLE: NetworkIndex = {
  [Networks.Ropsten]: '0xc53bb18028feA1B413057e2b2474F9838c465Fc3',
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
    ROPSTEN_ETH_UNI,
    //ROPSTEN_ETH_USDC,
  ],
  [Networks.Mainnet]: [
  ]
};