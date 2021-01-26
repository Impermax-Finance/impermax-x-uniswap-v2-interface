import { Networks } from './connections';

//TODO default network should be mainnet

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
  [Networks.Ropsten]: '0xA48C6262890A45ef1a523Cf617AA6E816cf4e72A',
  [Networks.Mainnet]: ''
};

export const WETH: NetworkIndex = {
  [Networks.Ropsten]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [Networks.Mainnet]: ''
};

const ROPSTEN_ETH_DAI: Address = '0x1c5DEe94a34D795f9EEeF830B68B80e44868d316';
const ROPSTEN_ETH_UNI: Address = '0x4E99615101cCBB83A462dC4DE2bc1362EF1365e5';

const MAINNET_ETH_DAI: Address = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11';
const MAINNET_ETH_UNI: Address = '0xd3d2e2692501a5c9ca623199d38826e513033a17';

export const LISTED_PAIRS: NetworkIndex = {
  [Networks.Ropsten]: [
    ROPSTEN_ETH_DAI,
    ROPSTEN_ETH_UNI,
  ],
  [Networks.Mainnet]: [
  ]
};

export const ROPSTEN_TO_MAINNET: AddressIndex = {
  [ROPSTEN_ETH_DAI]: MAINNET_ETH_DAI,
  [ROPSTEN_ETH_UNI]: MAINNET_ETH_UNI,
}

export const CONVERT_TO_MAINNET: NetworkIndex = {
  [Networks.Ropsten]: ROPSTEN_TO_MAINNET,
  [Networks.Mainnet]: {},
}