
// ray test touch <<
import { CHAIN_IDS } from 'config/web3/networks';

const IMPERMAX_SUBGRAPH_URL: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: 'https://api.thegraph.com/subgraphs/name/impermax-finance/impermax-x-uniswap-v2-ropsten',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: 'https://api.thegraph.com/subgraphs/name/impermax-finance/impermax-x-uniswap-v2'
};

export {
  IMPERMAX_SUBGRAPH_URL
};
// ray test touch >>
