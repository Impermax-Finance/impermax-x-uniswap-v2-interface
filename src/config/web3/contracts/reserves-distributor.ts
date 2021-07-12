
import { CHAIN_IDS } from 'config/web3/chains';

const RESERVES_DISTRIBUTOR_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0xccb284c85c595912c87e51a36637830d929376c7',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: ''
};

export {
  RESERVES_DISTRIBUTOR_ADDRESSES
};
