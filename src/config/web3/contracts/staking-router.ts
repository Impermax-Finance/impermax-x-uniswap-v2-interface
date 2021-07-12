
import { CHAIN_IDS } from 'config/web3/chains';

const STAKING_ROUTER_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0x34C8F7a53E10c17Fddf7eE5048C097569D99dE59',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: ''
};

export {
  STAKING_ROUTER_ADDRESSES
};
