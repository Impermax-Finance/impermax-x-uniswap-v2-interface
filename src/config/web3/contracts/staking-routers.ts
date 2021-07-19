
import { CHAIN_IDS } from 'config/web3/chains';

const STAKING_ROUTER_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0x87da8bab9fbd09593f2368dc2f6fac3f80c2a845',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: ''
};

export {
  STAKING_ROUTER_ADDRESSES
};
