
import { CHAIN_IDS } from 'config/web3/chains';

const CLAIM_AGGREGATOR_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0x2078270ae9956f1298f8bfd8be43306bbd4ab551',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: '0x5287cac629be59997602b4177cb4420165264b69'
};

export {
  CLAIM_AGGREGATOR_ADDRESSES
};
