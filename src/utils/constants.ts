import { Networks } from './connections';

//TODO default network should be mainnet

export type NetworkIndex = {
  [key in Networks]: any
};

export const NETWORK_URL: NetworkIndex = {
  [Networks.Ropsten]: 'wss://ropsten.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158',
  [Networks.Mainnet]: 'wss://mainnet.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158'
};

export const ROUTER: NetworkIndex = {
  [Networks.Ropsten]: '0xA48C6262890A45ef1a523Cf617AA6E816cf4e72A',
  [Networks.Mainnet]: ''
};

export const WETH: NetworkIndex = {
  [Networks.Ropsten]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [Networks.Mainnet]: ''
};

export const LISTED_PAIRS: NetworkIndex = {
  [Networks.Ropsten]: [
    '0x1c5dee94a34d795f9eeef830b68b80e44868d316', //ETH-DAI
  ],
  [Networks.Mainnet]: [
  ]
};