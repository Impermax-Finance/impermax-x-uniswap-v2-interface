
import { CHAIN_IDS } from 'config/web3/networks';

const AIR_DROP_URLS: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: 'https://wispy-truth-7af9.impermax.workers.dev',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: 'https://old-feather-0b99.impermax.workers.dev'
};

export {
  AIR_DROP_URLS
};
