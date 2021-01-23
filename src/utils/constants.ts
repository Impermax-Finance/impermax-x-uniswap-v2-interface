import { Networks } from './connections';

//TODO default network should be mainnet

export type NetworkIndex = {
  [key in Networks]: any
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