
import { CHAIN_IDS } from 'config/web3/chains';

const DEBANK_IDS = {
  [CHAIN_IDS.ROPSTEN]: '',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: 'eth',
  [CHAIN_IDS.MATIC]: 'matic',
  [CHAIN_IDS.ARBITRUM]: 'arb',
  [CHAIN_IDS.AVALANCHE]: 'avax',
  [CHAIN_IDS.MOONRIVER]: 'movr'
};

export {
  DEBANK_IDS
};
