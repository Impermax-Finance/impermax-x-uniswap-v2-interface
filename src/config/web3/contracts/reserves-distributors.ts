
import { CHAIN_IDS } from 'config/web3/chains';

const RESERVES_DISTRIBUTOR_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0xC65D78707b1fbb8F3d65fc4B3E41B29EfCE40bEC',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: ''
};

export {
  RESERVES_DISTRIBUTOR_ADDRESSES
};
